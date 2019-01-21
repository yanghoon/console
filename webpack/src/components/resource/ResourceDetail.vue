<template>
  <v-card>
    <v-card-title class="subheading">
      <v-btn icon flat @click="$router.go(-1)">
        <v-icon>arrow_back</v-icon>
      </v-btn>

      <span class="font-weight-regular title">
        {{ yaml && yaml.kind || kind }} / {{ $route.params.name }}
      </span>

      <v-btn icon flat @click="updateData()">
        <v-icon>replay</v-icon>
      </v-btn>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text v-for="(val, key) in displayYaml" :key="key" class="prop">
      <v-flex class="font-weight-bold text-capitalize"> {{ key }} </v-flex>

      <!-- String Type -->
      <v-flex v-if="_.isString(val)"> {{ val }} </v-flex>

      <!-- Object Type -->
      <v-layout v-else v-for="(v, k) in val" :key="k" row>
        <v-flex class="xs2 grey--text">{{ k }}</v-flex>
        <v-flex class="xs10 font-weight-regular">
          <!-- customized cell by header.id -->
          <slot :name="k" v-if="!!$scopedSlots[k] || !!$slots[k]" v-bind="{key: k, val: v}">
          </slot>
          <!-- Object Type -->
          <v-tooltip v-else-if="_.isObject(v)" bottom>
            <div slot="activator" class="text-truncate">{{ v }}</div>
            <pre>{{ stringify(v) }}</pre>
          </v-tooltip>
          <!-- toString -->
          <div class="text-truncate" v-else>{{ v }}</div>
        </v-flex>
      </v-layout>

      <v-divider></v-divider>
    </v-card-text>

  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import stringify from 'json-stringify-pretty-compact'

export default {
  data () {
    return {
      yaml: {}
    }
  },
  computed: {
    ...mapState(['ns']),
    kind () {
      const route = this.$route
      const _ = this.$_
      return route.params.kind || _.chain(route.path.split('/')).initial().last().value()
    },
    displayYaml () {
      return this.$_.pick(this.yaml, (v, k) => ['apiVersion', 'kind'].indexOf(k) === -1)
    }
  },
  methods: {
    updateData () {
      const cs = '-'
      const url = `/api/resource/${this.kind}/${this.$route.params.name}?ns=${this.ns}&cs=${cs}&type=json`
      this.$http
        .get(url)
        .then((res) => {
          // this.yaml = this.$filters.cleanup(res.data)
          if (res.data.code) {
            // TODO: ERROR
            return
          }
          this.cleanup(res.data)
          this.yaml = res.data
        })
    },
    cleanup (v, k, ctx) {
      const _ = this._
      if (_.isObject(v)) {
        _.mapObject(v, this.cleanup)
      } else if (_.isArray(v)) {

      } else if (_.isNull(v)) {
        delete ctx[k]
      }
    },
    stringify
  },
  mounted () {
    this.updateData()
  }
}
</script>

<style>
.prop > :nth-child(1) { padding-bottom: 20px; }
.prop > :nth-child(2),.row { padding-bottom: 10px; }
.prop:nth-last-child(1) > hr { display: none; }
pre { font-family: Roboto,sans-serif; }
</style>
