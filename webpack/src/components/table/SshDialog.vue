<template>
  <!-- Resource Spec (YAML) -->
  <v-dialog v-model="show" :fullscreen="full" max-width="1000">
    <v-card>
      <v-card-title class="ssh-dialog headline grey lighten-2" primary-title>
        {{ _.property(['metadata', 'name'])(item) }}
        <v-spacer></v-spacer>
        <v-btn color="primary" flat icon @click="full = !full">
          <v-icon>{{ !full ? 'fullscreen' : 'fullscreen_exit' }}</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <ssh :info="ssh"/>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="show = false">Close</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['value', 'item'],
  data () {
    return {
      full: false,
      ssh: {
        show: true,
        // cs: undefined,
        // ns: undefined,
        // selected: {},
        api: '/api/exec',
        pod: '-',
        con: {items: ['alpine']}
      }
    }
  },
  computed: {
    ...mapState(['ns', 'kind']),
    show: { /* https://stackoverflow.com/a/49119008 */
      get () {
        this.value ? this.updateInfo() : this.cleanup()
        return this.value
      },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {
    updateInfo () {
      this.ssh.show = true
      this.ssh.reset = true
      this.ssh.selected = {}

      this.ssh.api = '/api/exec'
      this.ssh.pod = this.item.metadata.name
      this.ssh.con.items = this._.map(this.item.spec.containers, container => container.name)
    },
    cleanup () {
      this.full = false
      this.ssh.show = false
    }
  }
}
</script>

<style>
.ssh-dialog { padding: 8px; font-size: 20px!important; }
</style>
