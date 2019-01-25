<template>
  <v-select
    :label="_.isUndefined(label) || label ? select[1].label : ''"
    :items="select[1].items"
    item-text="metadata.name" item-value="metadata.name"
    v-model="ns" menu-props="auto">
  </v-select>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'ns-select',
  props: ['label'],
  data () {
    return {
      pod: {}
    }
  },
  computed: {
    ...mapState(['select']),
    ...mapFields(['ns'])
  },
  methods: {
    ...mapMutations(['changeCluster', 'chageNamespace']),
    ...mapActions(['getNamespace'])
  },
  created () {
    // IMPORTANT!! https://github.com/vuejs/vue-test-utils/issues/107
    this.getNamespace()
  }
  // nuxt-api (https://ko.nuxtjs.org/api/pages-fetch)
  // fetch: function(){}
}
</script>
