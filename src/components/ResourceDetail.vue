<template>
  <v-container fluid>
    <v-layout row wrap align-center justify-center>
      <v-flex xs11>

        <v-layout wrap column fill-height>
          <v-flex xs12>

            <span class="display-1"> {{ item && item.kind }} </span>
            <v-flex xs12>&nbsp;</v-flex>

            <div v-for="(value, key) in item" :key="item.key" v-if="skip_root.indexOf(key) == -1">
              <v-card>
                <v-card-title class="subheading font-weight-regular">{{ key }}</v-card-title>
                <v-divider></v-divider>

                <v-card-text>
                  <v-layout v-for="(v, k) in value" :key="value.k">
                    <v-flex xs2 v-if="skip_obj_key.indexOf(k) == -1"> {{ k }} </v-flex>
                    <v-flex xs6 v-if="skip_obj_val.indexOf(k) == -1"> {{ v }}</v-flex>

                    <!-- metadata.name -->
                    <v-flex xs6 v-if="'name' == k">
                      <strong>{{ v }}</strong>
                      &nbsp;
                      <span>({{ value.creationTimestamp | moment('from', true) }})</span>
                      <!--
                        - http://momentjs.com/docs/#/i18n/
                        - https://www.npmjs.com/package/vue-moment
                      -->
                    </v-flex>

                    <!-- metadata.labels -->
                    <v-flex xs6 v-if="['labels', 'annotations'].indexOf(k) != -1">
                      <v-chip v-for="(lv, lk) in v" :key="v.lk">
                        <strong>{{ lk }}:</strong>
                        &nbsp;
                        <span>{{ lv }}</span>
                      </v-chip>
                    </v-flex>

                    <!-- metadata.ownerReferences -->
                    <v-flex xs6 v-if="'ownerReferences' == k">
                      <router-link :to="`/${v[0].kind.toLowerCase()}/${v[0].name}?cs=${cs}&ns=${ns}`">
                        {{ `${v[0].kind.toLowerCase()}/${v[0].name}` }}
                      </router-link>
                    </v-flex>

                    <v-flex xs6 v-if="'volumes' == k">
                        <v-chip v-for="l in v" :key="l.name">
                          <strong>{{ l.name }} :: </strong>
                          {{ _.omit(l, 'name') }}
                        </v-chip>
                    </v-flex>

                  </v-layout>
                </v-card-text>
              </v-card>
              
              <v-flex xs12>&nbsp;</v-flex>
            </div>

          </v-flex>
        </v-layout>
        <!--
          Event List
          - https://medium.com/covalent-ui/announcing-covalent-an-open-source-angular-2-0-material-ui-platform-by-teradata-ea77776e75cd
        -->

      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
const _ = require('underscore');

export default {
  name: 'ResourceDetail',
  data () {
  	var d = {}
  	d.kind = this.$route.params.resource
  	d.cs = this.$route.query.cs
  	d.ns = this.$route.query.ns
  	d.name = this.$route.params.id
  	d.item = undefined

    d.skip_root = ['apiVersion', 'kind']
    d.skip_obj_key = ['creationTimestamp']
    d.skip_obj_val = ['name', 'labels', 'annotations', 'ownerReferences', 'volumes']
    d.skip_obj_val = d.skip_obj_val.concat(d.skip_obj_key)

    console.log('data call')

  	return d
  },
  computed: {
    _: () => { return _ }
  },
  created () {
  	this.$http
  	  .get(`/api/${this.kind}/${this.name}?cs=${this.cs}&ns=${this.ns}`)
  	  .then((res) => {
  	  	this.item = res.data
  	  })
  },
  beforeRouteUpdate (to, from, next) {
    // - https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards
    this.$http
      .get(`/api/${to.params.resource}/${to.params.id}?cs=${to.query.cs}&ns=${to.query.ns}`)
      .then((res) => {
        this.item = res.data
      })
    next()
  }
}
</script>
<style scoped>
</style>