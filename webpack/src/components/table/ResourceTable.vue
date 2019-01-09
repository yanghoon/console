<template>
  <v-data-table class="elevation-1" item-key="id" :items="data" :headers="headers">
    <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>

    <v-alert slot="no-results" :value="true" color="error" icon="warning">
      Your search found no results.
    </v-alert>

    <!--
      https://github.com/vuejs/vue/issues/7464
      https://gist.github.com/elpete/7068308c5a1bf4f1a0f44f8d0259a9a2#file-managelists-vue-L4
    -->
    <template slot="items" slot-scope="props">
      <slot name="items" v-bind="props"></slot>
    </template>

  </v-data-table>
</template>

<script>
export default {
  props: 'data, headers'.split(/, ?/),
  data () {
    return {}
  }
}
</script>
