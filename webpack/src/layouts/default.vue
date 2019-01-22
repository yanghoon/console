<template>
  <!-- https://github.com/vuetifyjs/nuxt/blob/master/template/layouts/default.vue -->
  <v-app class="grey lighten-4">

    <v-navigation-drawer v-model="active.drawer" fixed clipped class="grey lighten-4" app>
      <v-list dense>
        <v-subheader>
          Samples
        </v-subheader>

        <template v-for="menu in menus">
          <!-- single menu item -->
          <v-list-tile v-if="!menu.sub"
            :key="menu.title" :to="menu.link">
            <v-list-tile-action>
              <v-icon>{{ menu.icon }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-title v-text="menu.title"></v-list-tile-title>

            <v-flex v-if="menu.link.startsWith('http')">
              <v-icon small>launch</v-icon>
            </v-flex>
          </v-list-tile>

          <!-- multiple menu item -->
          <v-list-group v-if="menu.sub"
            :key="menu.title">

            <!-- activator -->
            <v-list-tile slot="activator">
              <v-list-tile-action>
                <v-icon>{{ menu.icon }}</v-icon>
              </v-list-tile-action>

              <v-list-tile-title v-text="menu.title"></v-list-tile-title>
            </v-list-tile>

            <!-- sub menu item -->
            <v-list-tile no-action v-for="sub in menu.sub" :key="sub.title" :to="sub.link.startsWith('http') ? '' : sub.link">
              <v-list-tile-action></v-list-tile-action>

              <v-list-tile-title>
                {{ sub.title }}
              </v-list-tile-title>

              <v-flex v-if="sub.link.startsWith('http')">
                <v-icon small>launch</v-icon>
              </v-flex>
            </v-list-tile>

          </v-list-group>

        </template>

      </v-list>
    </v-navigation-drawer>

    <v-toolbar app clipped-left>
      <div class="toolbar-band blue darken-1"></div>
      <v-toolbar-side-icon @click.native="active.drawer = !active.drawer"></v-toolbar-side-icon>

      <v-toolbar-items>
        <v-btn flat class="toolbar-title" to="/" exact>
          <span class="title ml-3 mr-5">
            Kubernetes <span class="text">Console</span>
          </span>
        </v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-menu offset-y bottom v-model="active.profile">
          <v-btn flat slot="activator">
            <!-- <v-icon>more_vert</v-icon> -->
            {{ profile.firstName }}
            <v-icon>{{ active.profile ? 'expand_less' : 'expand_more' }}</v-icon>
          </v-btn>
          <v-list>
            <template v-for="(item, index) in toolbar">
              <v-list-tile :key="index">
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile>

              <v-divider :key="toolbar.length + index" v-if="item.dvider"></v-divider>
            </template>
          </v-list>
        </v-menu>
      </v-toolbar-items>

    </v-toolbar>

    <v-content>
      <v-container fluid>
        <v-layout row wrap align-center justify-center>

          <v-flex xs11>
            <v-flex xs2>
              <namespace-select/>
            </v-flex>

            <nuxt/>
            <!-- <v-card>
              <v-card-text>
                <nuxt/>
              </v-card-text>
            </v-card> -->
          </v-flex>

        </v-layout>
      </v-container>
    </v-content>

  </v-app>
</template>

<script>
// https://github.com/vuejs/vuex/blob/dev/examples/shopping-cart/components/ProductList.vue

import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      active: {
        drawer: true,
        profile: false
      }
    }
  },
  created () {
    this.getProfile()
  },
  computed: mapState(['menus', 'toolbar', 'profile']),
  methods: mapActions(['getProfile'])
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
