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
      <template slot="items" slot-scope="xxx">
        <tr>
          <td> {{ xxx.item.metadata.name }} </td>
          <td> {{ xxx.item.metadata.namespace}} </td>
        </tr>
      </template>
    </resource-table>

  </layout-content>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      cs: '',
      table: {
        keywoard: '',
        loading: true,
        data: [],
        headers: [
          {text: 'xxx', value: 'yyy'},
          {text: 'xxx', value: 'yyy'}
        ]
      }
    }
  },
  computed: {
    ...mapState(['select', 'ns', 'kind'])
  },
  methods: {
    ...mapMutations(['setKindItem']),
    updateData () {
      const URL = `/api/${this.kind}/list?type=yaml&cs=${this.cs}&ns=${this.ns}`

      this.$http
        .get(URL)
        .then((res) => {
          this.table.data = res.data.items
        })
    }
  },
  created () {
    const items = [
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

    this.setKindItem(items)
    /**
     * https://vuex.vuejs.org/kr/api/#watch
     */
    this.$store.watch(() => this.ns, this.updateData)
    this.$store.watch(() => this.kind, this.updateData)
  }
}
</script>
