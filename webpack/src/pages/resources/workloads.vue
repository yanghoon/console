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
        {{ val[0].restartCount }}
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
  svc: [ 'Name', 'Namespace' ],
  cm: [ 'Name', 'Namespace' ],
  secrets: [ 'Name', 'Namespace' ],
  pvc: [ 'Name', 'Namespace' ]
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
