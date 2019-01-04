<template>
  <v-layout row wrap align-center justify-start>
    <!--
    <v-flex xs2>
      <v-select :items="select[0].items"
        item-text="name" item-value="name" auto
        :label="select[0].label" v-model="select[0].selected" @change="changeCluster">
      </v-select>
    </v-flex>

    <div class="text-md-center"> <span>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</span> </div>
    -->

    <v-flex xs2>
      <v-select :items="select[1].items"
        item-text="metadata.name" item-value="metadata.name" menu-props="auto"
        :label="select[1].label" v-model="select[1].selected">
      </v-select>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'ns-select',
  data () {
    return {
      pod: {}
    }
  },
  computed: mapState(['select']),
  methods: {
    ...mapMutations(['changeCluster', 'chageNamespace']),
    ...mapActions(['getNamespace'])
  },
  mounted: () => {
    this.$store.dispatch('getNamespace')
    this.getNamespace()
  }
  // nuxt-api (https://ko.nuxtjs.org/api/pages-fetch)
  // fetch: function(){}
}
</script>
