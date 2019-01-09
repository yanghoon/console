<template>
  <v-flex xs2>
    <v-select :items="select[2].items"
      :label="select[2].label"
      item-text="text" item-value="value" menu-props="auto"
      v-model="kind">
    </v-select>
  </v-flex>
</template>

<script>
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'kind-select',
  data () {
    return {}
  },
  computed: {
    ...mapState(['select']),
    ...mapFields(['kind'])
  },
  methods: {
  }
}
</script>
