<template>
  <v-container fluid>
    <v-layout row wrap align-center justify-center>
      <v-flex xs11>

        <v-layout row align-space-between column v-for="(value, key) in item" :key="item.key" v-if="skip_root.indexOf(key) == -1">
          <v-flex>
            <span class="subheading font-weight-regular">{{ key }}</span>
          </v-flex>

          <v-card>
            <!-- <v-card-title></v-card-title> -->
            <v-card-text>
              <v-layout v-for="(v, k) in value" :key="value.k">
                <v-flex xs2> {{ k }} </v-flex>
                <v-flex xs6 v-if="skip_obj.indexOf(k) == -1"> {{ v }}</v-flex>

                <!-- metadata.labels -->
                <v-flex xs6 v-if="'labels' == k">
                  <v-chip v-for="(lv, lk) in v" :key="v.lk">
                    <strong>{{ lk }}:</strong>
                    &nbsp;
                    <span>{{ lv }}</span>
                  </v-chip>
                </v-flex>

                <!-- metadata.ownerReferences -->
                <v-flex xs6 v-if="'ownerReferences' == k">
                  {{ `${v[0].kind.toLowerCase()}/${v[0].name}` }}
                </v-flex>

                <v-flex xs6 v-if="'volumes' == k">
                    <v-chip v-for="l in v">
                      <strong>{{ l.name }} :: </strong>
                      {{ _.omit(l, 'name') }}
                    </v-chip>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>

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
  	d.kind = 'pod'
  	d.cs = this.$route.query.cs
  	d.ns = this.$route.query.ns
  	d.name = this.$route.params.id
  	d.item = undefined

    d.skip_root = ['apiVersion','kind']
    d.skip_obj  = ['labels', 'ownerReferences', 'volumes']

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

  }
}
</script>
<style scoped>
</style>