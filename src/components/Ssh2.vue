<template>
  <div>
    <form>
      <v-text-field v-model="endpoint" label="Pod Endpoint" readonly></v-text-field>

      <v-btn color="primary" @click.native="connect()" v-bind:disabled="!!ws">
        <v-icon left>desktop_windows</v-icon> Connect
      </v-btn>
      <v-btn color="primary" @click.native="disconnect()" :disabled="!ws">
        <v-icon left>desktop_windows</v-icon> Disconnect
      </v-btn>

      <v-text-field
        v-model="cmd" @keyup.enter="exec()"
        label="Command" :placeholder="ws ? 'Type command and press enter' : 'No connection'"
        :disabled="!ws"
        required ></v-text-field>
    </form>
    
      <div class="console"></div>

  </div>
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
  name: 'ssh',
  props: ['cs', 'ns', 'pod', 'con'],
  data () {
    return {
      cmd: "",
      endpoint:'',
      //cs: 'zcp-demo',
      //ns: 'zcp-system',
      //pod: 'zcp-jenkins-7c878bd78-fs7j2',
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
      this.ws.close()
    },
    connect () {
      var api = '/api'
      var comp = this;

      var term = this.terminal.term
      term.clear()

      this.endpoint = `/api/v1/namespaces/${this.ns}/pods/${this.pod}`

      // https://github.com/websockets/wscat/blob/master/bin/wscat#L248
      function exec(info){
        var url = `ws://localhost:8080${api}/shell?cs=${comp.cs}&ns=${comp.ns}&pod=${comp.pod}&con=${comp.con}`
        const ws = new WebSocket(url);
        comp.ws = ws

        ws.onopen = () => {
          console.log('open')

          //info.endpoint = comp.endpoint
          //ws.send(JSON.stringify(info))
        }
        ws.onclose = (ev) => {
          console.log('close :: ', ev.code)
          comp.ws = undefined
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

      exec(); return;

      this.$http
        .get(`${api}/shell/info`)
        .then((res)=>{
          exec(res.data);
        })
    },
    init () {
      var term = this.terminal.term
      term.fit()
      term.resize()

      // https://github.com/xtermjs/xterm.js/issues/943#issuecomment-327367759
      term.write('\x1b')
      term.write('\n\n\r')
      term.clear()
    }
  },
  mounted () {
    // https://github.com/xtermjs/xterm.js/issues/573
    let terminalContainer = document.getElementsByClassName('console')[0]
    this.terminal.term = new Terminal({
      cursorBlink: true,
      //cols: this.terminal.cols,
      //rows: this.terminal.rows
      rows: 20,
      cols: 80,
      screenKeys: true
    })

    var term = this.terminal.term;
    term.open(terminalContainer);
    term.fit();
    //term.refresh(term.x, term.y);
    //term.showCursor();
    term.resize();

    this.endpoint = `/api/v1/namespaces/${this.ns}/pods/${this.pod}`
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
