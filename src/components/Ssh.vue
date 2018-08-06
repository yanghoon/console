<template>
  <!--
  Layout Configure
  - https://vuetifyjs.com/ko/layout/pre-defined#default-markup
  - https://vuetifyjs.com/ko/layout/grid#example-playground
  -->
  <v-container fluid>
    <v-layout row wrap align-center justify-center>
      <v-flex xs11>

        <form>
          <v-text-field v-model="endpoint" label="Pod Endpoint" required></v-text-field>

          <v-btn color="primary" @click.native="connect()" :disabled="ws">
            <v-icon left>desktop_windows</v-icon> Connect
          </v-btn>
          <v-btn color="primary" @click.native="disconnect()" :disabled="!ws">
            <v-icon left>desktop_windows</v-icon> Disconnect
          </v-btn>
        </form>

        <form>
          <v-text-field
            v-model="cmd" @keyup.enter="exec()"
            label="Command" :placeholder="ws ? 'Type command and press enter' : 'No connection'"
            :disabled="!ws"
            required ></v-text-field>
        </form>

        <div class="console"></div>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

//import WebSocketClient from 'ws'
//import * as io from 'socket.io-client'  // https://github.com/gdi2290/angular-starter/issues/221
//import eio from 'engine.io-client'

import 'xterm/lib/xterm.css';   //https://xtermjs.org/docs/guides/import/
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
Terminal.applyAddon(fit);

export default {
  name: 'Ssh',
  data () {
    return {
      endpoint:'/api/v1/namespaces/default/pods/mypod',
      cmd: "",
      ws: undefined,
      terminal: {
        term: null,
        terminalSocket: null
      }
    }
  },
  methods: {
    exec () {
      if(!this.ws)
        return;

      this.ws.send(this.cmd)
      this.cmd = ""
    },
    disconnect () {
      alert('Not implement')
    },
    connect () {
      var api = '/api'
      var comp = this;

      // https://github.com/websockets/wscat/blob/master/bin/wscat#L248
      function exec(info){
        var url = `ws://10.250.44.162:8080${api}/shell`
        const ws = new WebSocket(url);
        comp.ws = ws

        ws.onopen = () => {
          console.log('open')

          info.endpoint = comp.endpoint
          ws.send(JSON.stringify(info))
        }
        ws.onclose = (code) => {
          console.log('close :: ', code)
        }
        ws.onerror = (err) => {
          console.log('error :: ', err)
        }
        ws.onmessage = (msg) => {
          //console.log('message', data)
          console.log("< ", msg.data)
          comp.terminal.term.write(msg.data)
        }
      }

      this.$http
        .get(`${api}/shell/info`)
        .then((res)=>{
          exec(res.data);
        })
    }
  },
  mounted () {
    // https://github.com/xtermjs/xterm.js/issues/573
    let terminalContainer = document.getElementsByClassName('console')[0]
    this.terminal.term = new Terminal({
      cursorBlink: true,
      //cols: this.terminal.cols,
      //rows: this.terminal.rows
      rows: 25,
      cols: 80,
      screenKeys: true
    })

    var term = this.terminal.term;
    term.open(terminalContainer);
    //term.fit();
    //term.refresh(term.x, term.y);
    //term.showCursor();
    //term.resize();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.vue-codemirror { text-align: left!important; }
.CodeMirror-hints { z-index: 203 !important; }
</style>
