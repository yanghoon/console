<template>
  <!-- https://github.com/vuetifyjs/nuxt/blob/master/template/layouts/default.vue -->
  <v-app class="grey lighten-4">

    <v-navigation-drawer v-model="drawer" fixed clipped class="grey lighten-4" app>
      <v-list dense class="grey lighten-4">
        <v-subheader>
          Samples
          <v-btn icon small color="info" @click="applyMenu(menu)">
            <v-icon dark>add</v-icon>
          </v-btn>
        </v-subheader>

        <v-list-tile v-for="menu in menus" :key="menu.title" :to="menu.link">
          <v-list-tile-action>
            <v-icon>{{ menu.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title v-text="menu.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app clipped-left>
      <div class="toolbar-band blue darken-1"></div>
      <v-toolbar-side-icon @click.native="drawer = !drawer"></v-toolbar-side-icon>

      <v-toolbar-items>
        <v-btn flat class="toolbar-title" to="/" exact>
          <span class="title ml-3 mr-5">
            Kubernetes <span class="text">Console</span>
          </span>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <v-layout row wrap align-center justify-center>

          <v-flex xs11>
            <!-- <ns-select v-on:change="changeSelect"/> -->
            <namespace-select/>

            <v-card>
              <v-card-text>
                <nuxt/>
              </v-card-text>
            </v-card>
          </v-flex>

        </v-layout>
      </v-container>
    </v-content>

  </v-app>
</template>

<script>
// https://github.com/vuejs/vuex/blob/dev/examples/shopping-cart/components/ProductList.vue

import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      drawer: null,
      menu: {title: 'Support', link: '/support', icon: 'phone'}
    }
  },
  computed: mapState(['menus']),
  methods: mapMutations(['applyMenu'])
}
</script>

<style>
.toolbar-title { text-transform: none; }
.toolbar-title .text { font-weight: 400; }
.toolbar-title:hover { text-decoration: none; }
.toolbar-title.v-btn--active:before { background-color: inherit; }

.toolbar-band {
  min-width: 100%;
  min-height: 5px;

  position: absolute;
  top: 0;
  left: 0;

  /* z-index: 4; */
}

.v-navigation-drawer a:hover { text-decoration: none !important; }

/* toolbar-title v-btn--active v-btn v-btn--flat v-btn--router */
/* toolbar-title               v-btn v-btn--flat v-btn--router */
</style>
