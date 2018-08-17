<template>
  <div>
    <form>
      <v-text-field v-if="false" v-model="endpoint" label="Pod Endpoint" readonly></v-text-field>

      <v-layout row align-center justify-start>
        <v-select :items="con.items" v-model="con.selected" label="Container" auto></v-select>
        <div class="text-md-center"> <span>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</span> </div>
        <v-select :items="shell.items" v-model="shell.selected" label="Shell" auto></v-select>

        <v-spacer></v-spacer>

        <v-btn color="primary" @click.native="connect()" :disabled="!!ws">
          <v-icon left>desktop_windows</v-icon> Connect
        </v-btn>
        <v-btn color="primary" @click.native="disconnect()" :disabled="!ws">
          <v-icon left>desktop_windows</v-icon> Disconnect
        </v-btn>
      </v-layout>

      <!--
      <v-text-field
        v-model="cmd" @keyup.enter="exec()"
        label="Command" :placeholder="ws ? 'Type command and press enter' : 'No connection'"
        :disabled="!ws"
        required ></v-text-field>
      -->
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

// variable not in vue
var term_char_height = -1;

export default {
  name: 'ssh-kube',
  props: ['info'],
  watch: {
    info: {
      handler(_new, _old){
        console.log('WATCH !!')
        this.bindProps(_new)
      },
      deep:true
    }
  },
  data () {
    return {
      endpoint: undefined,
      cs: undefined,
      ns: undefined,
      pod: undefined,
      con: {},
      shell: {
        selected: 'bash',
        items: ['bash', 'sh']
      },
      ws: undefined,
      terminal: {
        term: null,
        terminalSocket: null
      }
    }
  },
  methods: {
    bindProps (_new) {
      this.cs = _new.cs
      this.ns = _new.ns
      this.pod = _new.pod
      this.con.items = _new.con.items
      this.con.selected = _new.con.items[0]
      this.endpoint = `/api/v1/namespaces/${this.ns}/pods/${this.pod}`
    },
    disconnect () {
      this.ws && this.ws.close()
    },
    connect () {
      var api = '/api'
      var term = this.terminal.term

      // https://github.com/xtermjs/xterm.js/issues/943#issuecomment-327367759
      term.reset()

      // https://github.com/websockets/wscat/blob/master/bin/wscat#L248
      var server = location.protocol.replace('http', 'ws') + '//' + location.host
      var url = `${server}${api}/shell?cs=${this.cs}&ns=${this.ns}&pod=${this.pod}&con=${this.con.selected}&shell=${this.shell.selected}`
      const ws = new WebSocket(url);
      this.ws = ws

      ws.onopen = () => {
        console.log('open')
      }
      ws.onclose = (ev) => {
        console.log('close :: ', ev.code)
        this.ws = undefined
      }
      ws.onerror = (err) => {
        console.log('error :: ', err)
      }
      ws.onmessage = (msg) => {
        this.terminal.term.write(msg.data)
      }
    },
    resize () {
      /*
       * Detect change of font size.
       * Tracking height of the single charactor span.
       * And re-measure before to calcuate new fit size.
       */
      var m = document.getElementsByClassName('xterm-char-measure-element')[0]
      if(!m){
        console.log('!!! mesaure not mounted.')
        return;
      }

      var _old = term_char_height
      var _new = m.getBoundingClientRect().height
      if(_old == _new)
        return

      console.log('term :: size of character is changed. [old=', _old, ', new=', _new, ']')

      var term = this.terminal.term
      if(!term){
        console.log('term :: terminal is not mounted. skip to re-measure.')
        return
      }

      // See also
      // - xterm/lib/addons/fit/fit.js
      //     proposeGeometry()
      //       term._core.renderer.dimensions.actualCellWidth
      // - xterm/lib/render/render.js
      //     Renderer.prototype._updateDimensions()
      //       charMeasure.width -> scaledCharWidth -> scaledCellHeight -> scaledCanvasHeight
      // - xterm/lib/ui/CharMeasure.js 
      //     CharMeasure.prototype.measure()
      //       this._measureElement.getBoundingClientRect()
      //       _measureElement.classList.add('xterm-char-measure-element')
      console.log('term :: do resize terminal.')
      term._core.charMeasure.measure(term._core.options)
      term.fit()

      term_char_height = _new
    }
  },
  mounted () {
    // https://github.com/xtermjs/xterm.js/issues/573
    let terminalContainer = document.getElementsByClassName('console')[0]
    let term = new Terminal({
      cursorBlink: true,
      //cols: this.terminal.cols,
      //rows: this.terminal.rows
      //rows: 24,
      //cols: 80,
      screenKeys: true,
    })

    term.open(terminalContainer);
    term.fit()

    term.on('data', (data) => {
      this.ws && this.ws.send(data)
    })
    term.on('key', (k, e) => {
      var printable = (
        !e.altKey && !e.altGraphKey && !e.ctrlKey && !e.metaKey
        && e.keyCode < 128
      );

      return

      if(printable){
        this.ws && this.ws.send(k)
      }
    })

    this.bindProps(this.info)
    this.terminal.term = term;
    this.$nextTick(this.resize)
  },
  updated () {
    this.$nextTick(this.resize)
  },
  beforeDestroy () {
    this.disconnect()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
