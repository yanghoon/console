<template>
  <!--
  Layout Sample
  - https://github.com/vuetifyjs/vuetifyjs.com/blob/master/src/examples/layouts/googleKeep.vue
  Icons
  - https://material.io/tools/icons/?icon=desktop_access_disabled&style=baseline
  -->
  <v-app class="grey lighten-4">

    <!-- <v-navigation-drawer v-model="drawer" fixed clipped class="grey lighten-4" app> -->
    <v-navigation-drawer fixed left clipped app
        justify-space-between
        class="grey lighten-4" width="225" mini-variant-width="60"
        :mini-variant.sync="drawer">

      <v-list dense class="grey lighten-4">
        <v-subheader>Samples</v-subheader>

        <v-list-tile v-for="menu in menus" :key="menu.title" @click="" :to="menu.link">
          <!--
          <v-list-tile-action>
            <v-icon>{{ menu.icon }}</v-icon>
          </v-list-tile-action>
          -->

          <v-list-tile-content>
            <v-list-tile-title v-text="menu.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list dense class="grey lighten-4 nav-mini">
        <v-list-tile>
          <v-list-tile-action>
            <v-btn slot="activator" class="grey darken-1" icon @click="drawer = !drawer">
              <v-icon >list</v-icon>
            </v-btn>
          </v-list-tile-action>

          <v-list-tile-content>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app clipped-left>
      <div class="toolbar-band blue darken-1"></div>

      <v-toolbar-items>
        <v-btn flat class="toolbar-title" to="/" exact>
          <span class="title">
            Kubernetes <span class="text">Console</span>
          </span>
        </v-btn>
      </v-toolbar-items>

      <!--
        <span class="title ml-3 mr-5" @click.native="alert('!!')">
          Kubernetes <span class="text">Console</span>
        </span>
      -->
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>

  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: null,
      menus: [
        {title:'Web SSH', link:'/ssh', icon:'web_asset'},
        {title:'Resources', link:'/', icon:'widgets'},
        {title:'Editor', link:'/code', icon:'create'},
        {title:'Configure', link:'/conf', icon:'settings'}
      ]
    }
  }
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
}

.nav-mini { position: fixed; bottom: 0; right: 0; }
.nav-mini > div { float: right; }
.nav-mini .v-list__tile { padding: 0px; }
.nav-mini .v-list__tile__action { justify-content: flex-end; }
.nav-mini .v-list__tile__action button { border-radius: 50px 0px 0px 50px; min-width: 45px; margin: 0px; margin-right: 1px; }
.nav-mini .v-list__tile__action button .v-btn__content { color: white; }

.v-toolbar__content { padding: 0px; }
.v-navigation-drawer a:hover { text-decoration: none !important; }

/* toolbar-title v-btn--active v-btn v-btn--flat v-btn--router */
/* toolbar-title               v-btn v-btn--flat v-btn--router */
</style>
