<template>
  <layout-content>
    <template slot="title">
      <v-layout>
        <kind-select/>
        <v-spacer></v-spacer>
        <v-text-field v-model="table.keyword" @keyup.esc="table.keyword = undefined"
          hide-details clearable
          append-icon="search" label="Search"></v-text-field>
      </v-layout>
    </template>

    <resource-table v-bind="table">
      <template slot="age" slot-scope="{val}">
        {{ val.millis | moment('from', true) || '-' }}
      </template>
      <template slot="restarts" slot-scope="{val}">
        {{ val ? val.reduce((s, c) => s + c.restartCount, 0) : '!!!' }}
      </template>

      <!-- Service -->
      <labels slot="selector" slot-scope="{val}" v-bind:labels="val"/>
      <template slot="service-endpoint" slot-scope="{item}">
        {{ item.spec.type === 'LoadBalancer' ? item.status.loadBalancer.ingress[0].ip : item.spec.clusterIP }}
      </template>

      <!-- ConfigMap -->
      <labels slot="labels" slot-scope="{val}" v-bind:labels="val"/>
      <template slot="data-key" slot-scope="{val}">
        <div v-for="(v, k) in val" :key="k" small>
          <!-- https://programmingsummaries.tistory.com/239 -->
          {{ k }} ({{ !!v ? v.length : 0 }} bytes)
        </div>
      </template>

      <!-- PVC -->
      <template slot="capacity" slot-scope="{val}">
        {{ sizeOf(val) }}
      </template>

    </resource-table>

  </layout-content>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

const KIND_ITEMS = [
  // ** workload
  // {text:'Deployment', value:'deployment'},
  // {text:'StatefulSets', value:'statefulset'},
  {text: 'Pod', value: 'pod'},
  // {text:'CronJob', value:'cronjob'},
  // {text:'Job', value:'job'},
  // ** network
  {text: 'Service', value: 'svc'},
  // {text:'Ingress', value:'ing'},
  // ** volume
  {text: 'ConfigMap', value: 'cm'},
  {text: 'Secret', value: 'secrets'},
  {text: 'PersistentVolumeClaim', value: 'pvc'}
  // ** auth
  // {text:'RoleBinding', value:'rolebinding'},
  // ** cluster
  // {text:'Node', value:'node'},
  // {text:'PersistentVolume', value:'pv'},
  // {text:'ClusterRoles', value:'clusterroles'},
]

const HEADERS = {
  pod: 'Name,Node,Status,Restarts,Age,Action'.split(','),
  svc: 'Name,Selector,ClusterIP,Service-Endpoint,Age,Action'.split(','),
  cm: 'Name,Data-Key,Age,Action'.split(','),
  secrets: 'Name,Secret-Type,Data-Key,Age,Action'.split(','),
  pvc: 'Name,Pvc-Status,Volume,Capacity,Access-Modes,Storage-Class,Age,Action'.split(',')
}

export default {
  data () {
    return {
      cs: '',
      table: {
        keywoard: '',
        loading: false,
        data: [],
        headers: HEADERS
      }
    }
  },
  computed: {
    ...mapState(['select', 'ns', 'kind'])
  },
  methods: {
    ...mapMutations(['setKindItem']),
    updateData () {
      if (!this.kind || !this.ns) {
        return
      }

      const URL = `/api/${this.kind}/list?type=yaml&cs=${this.cs}&ns=${this.ns}`
      this.table.loading = true

      this.$http
        .get(URL)
        .then((res) => {
          this.table.data = res.data.items
          this.table.loading = false
        })
    },
    sizeOf (bytes) {
      // https://stackoverflow.com/a/28120564
      // https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/resources.md#resource-quantities
      if (bytes === 0) { return '0.0 Bi' }
      if (!bytes) { return '-' }
      var e = Math.floor(Math.log(bytes) / Math.log(1024))
      var s = (bytes / Math.pow(1024, e)).toFixed(1)
      return `${s} ${' KMGTP'.charAt(e)}i`
    }
  },
  created () {
    this.setKindItem(KIND_ITEMS)

    /**
     * https://vuex.vuejs.org/kr/api/#watch
     */
    this.$store.watch(() => this.ns, this.updateData)
    this.$store.watch(() => this.kind, this.updateData)
  },
  mounted () {
    if (this.table.data.length === 0) {
      this.updateData()
    }
  }
}
</script>
