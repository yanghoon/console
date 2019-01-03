<template>
  <v-layout row wrap align-center justify-start>
    <v-flex xs2>
      <v-select :items="select[0].items"
        item-text="name" item-value="name" auto
        :label="select[0].label" v-model="select[0].selected" @change="changeCluster">
      </v-select>
    </v-flex>

    <div class="text-md-center"> <span>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</span> </div>

    <v-flex xs2>
      <v-select :items="select[1].items"
        item-text="metadata.name" item-value="metadata.name" auto
        :label="select[1].label" v-model="select[1].selected">
      </v-select>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'ns-select',
  data () {
    return {
      pod: {},
      select: [
        {label: 'Cluster', items: [], selected: 'cloudzcp-pou-dev'},
        {label: 'Namespace', items: [], selected: 'default'}
      ]
    }
  },
  watch: {
    select: {
      handler (_new, _old) { this.$emit('change', _new) },
      deep: true
    }
  },
  mounted () {
    this.getCluster()
    this.select[0].selected && this.changeCluster()
  },
  methods: {
    getCluster () {
      var api = '/api'

      this.$http
        .get(`${api}/cluster/list`)
        .then((res) => {
          this.select[0].items = res.data
        })
    },
    changeCluster () {
      var api = '/api'

      this.$http
        .get(`${api}/cluster/${this.select[0].selected}/namespace/list`)
        .then((res) => {
          this.select[1].items = res.data.items
        })
    }
  }
}
</script>
