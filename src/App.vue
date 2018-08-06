<template>
  <!-- Layout Sample :: https://github.com/vuetifyjs/vuetifyjs.com/blob/master/src/examples/layouts/googleKeep.vue -->
  <v-app class="grey lighten-4">
    <div class="toolbar-band blue darken-1"></div>

    <v-navigation-drawer v-model="drawer" fixed clipped class="grey lighten-4" app>

      <v-list dense class="grey lighten-4">
        <v-subheader>Samples</v-subheader>

        <v-list-tile v-for="menu in menus" :key="menu.title" @click="" :to="menu.link">
          <v-list-tile-action>
            <v-icon>{{ menu.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title v-text="menu.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

    </v-navigation-drawer>

    <v-toolbar app absolute clipped-left>
      <v-toolbar-side-icon @click.native="drawer = !drawer"></v-toolbar-side-icon>

      <v-toolbar-items>
        <v-btn flat class="toolbar-title" to="/" exact>
          <span class="title ml-3 mr-5">
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
console.log(this)
export default {
  data () {
    return {
      drawer: null,
      menus: [
        {title:'Pods', link:'/', icon:'widgets'},
        {title:'Web SSH', link:'/ssh', icon:'web_asset'},
        {title:'Editor', link:'/code', icon:'create'}
      ]
    }
  }
}
</script>

<style>
.toolbar-title { text-transform: none; }
.toolbar-title.text { font-weight: 400; }
.toolbar-title:hover { text-decoration: none; }
.toolbar-title.v-btn--active:before { background-color: inherit; }

.toolbar-band {
  min-width: 100%;
  min-height: 5px;

  position: absolute;

  z-index: 4;
}

.v-navigation-drawer a:hover { text-decoration: none !important; }

/* toolbar-title v-btn--active v-btn v-btn--flat v-btn--router */
/* toolbar-title               v-btn v-btn--flat v-btn--router */
</style>
