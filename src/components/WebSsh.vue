<template>
  <!--
  Layout Configure
  - https://vuetifyjs.com/ko/layout/pre-defined#default-markup
  - https://vuetifyjs.com/ko/layout/grid#example-playground
  -->
  <v-container fluid>
    <v-layout row wrap align-center justify-center>
      <v-flex xs11>
        <ns-select v-on:change="changeSelect"/>

        <v-card>
          <v-card-text>
            <ssh-kube :info="ssh"/>
          </v-card-text>
        </v-card>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'WebSsh',
  data () {
    return {
      endpoint:'/api/v1/namespaces/default/pods/mypod',
      cmd: "",
      ws: undefined,
      terminal: {
        term: null,
        terminalSocket: null
      },
      select: [ {selected: false}, {selected: false} ],
      ssh: {show: false, cs: undefined, ns: undefined, pod: undefined, con: {items:[]}, full: false },
    }
  },
  methods: {
    changeSelect (changed) {
      this.select = changed;

      this.ssh.cs = this.select[0].selected;
      this.ssh.ns = this.select[1].selected;
    }
  },
  mounted () {
    this.ssh.show = true;
    this.ssh.selected = {};

    this.ssh.api = '/api/wsh';
    this.ssh.pod = '-';
    this.ssh.con.items = ['apline'];
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
