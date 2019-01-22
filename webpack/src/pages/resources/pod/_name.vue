<template>
  <resource-detail>
    <labels slot="annotations" slot-scope="{val}" :labels="val"/>
    <labels slot="labels" slot-scope="{val}" :labels="val"/>

    <template slot="startTime" slot-scope="{val}">
      {{ val | moment('YYYY-MM-DD A hh:mm:ss') }}
    </template>
    <template slot="creationTimestamp" slot-scope="{val}">
      {{ val | moment('YYYY-MM-DD A hh:mm:ss') }}
    </template>

    <template slot="ownerReferences" slot-scope="{val}">
      <router-link :to="`/resources/${val[0].kind.toLowerCase()}/${val[0].name}?cs=-&ns=${ns}`">
        {{ val[0].name }} ({{ val[0].kind }})
      </router-link>
    </template>

    <template slot="imagePullSecrets" slot-scope="{val}">
      <div v-for="(s, i) in val" :key="i">
        {{ s.name }}
      </div>
    </template>

    <template slot="containers" slot-scope="{val}">
      <div v-for="(v, k) in val" :key="k">
        {{ v.name }}

        <v-layout row wrap>
          <v-flex class="grey--text">{{ `${v.image} (${v.imagePullPolicy})` }}</v-flex>
        </v-layout>

        <!-- env -->
        <v-layout row wrap>
          <v-flex xs12>
            <span class="text-truncate grey--text">env ({{ v.env && v.env.length || '-' }})</span>
          </v-flex>

          <v-flex xs12 v-for="(variable, index) in v.env" :key="index">
            <v-layout row wrap>
                <v-flex xs3>
                  {{ variable.name }}
                </v-flex>

                <v-flex xs9>
                  {{ variable.value }}
                </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>

        <!-- volumeMounts -->
        <v-layout row wrap>
          <v-flex xs12>
            <span class="text-truncate grey--text">volumeMounts ({{ v.volumeMounts && v.volumeMounts.length || '-' }})</span>
          </v-flex>

          <v-flex xs12 v-for="(volume, name) in _.groupBy(v.volumeMounts, v => v.name)" :key="name">
            <v-layout row wrap>
                <v-flex xs2 style="display: flex;" align-start>
                  <v-icon>storage</v-icon>
                  {{ name }}
                </v-flex>

                <v-flex xs10>
                  <v-flex v-for="(vol, i) in volume" :key="i">
                    <span v-if="vol.subPath">{{ `/${vol.subPath} : ` }}</span>
                    <span>{{ `${vol.mountPath}` }}</span>
                  </v-flex>
                </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>

        <!-- <v-divider/> -->

        <!-- <pre>{{ v.livenessProbe }}</pre> -->
        <!-- <pre>{{ v.readinessProbe }}</pre> -->

        <!-- <pre>{{ v }}</pre> -->
      </div>
    </template>

  </resource-detail>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState(['ns'])
}
</script>
