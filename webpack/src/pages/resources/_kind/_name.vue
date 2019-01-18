<template>
  <div>
    <span class="display-1"> {{ yaml && yaml.kind }} </span>

    <v-card v-for="(val, key) in (yaml)" :key="key">
      <v-card-title class="subheading font-weight-regular">
        <strong>{{ key }} : </strong>
        <template v-if="_.isString(val)">
            {{ val }}
        </template>
      </v-card-title>

      <v-card-text v-if="!_.isString(val)">

        <template>
          <div v-for="(v, k) in val" :key="k">
            <strong>{{ k }}</strong>
            {{ v }}
          </div>
        </template>

      </v-card-text>

    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      yaml: {}
    }
  },
  computed: {
    ...mapState(['ns']),
    kind () {
      return this.$route.params.kind
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
    }
  },
  mounted () {
    this.updateData()
  }
}
</script>
