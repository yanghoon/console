<template>
  <v-app class="grey lighten-4">
    <v-content>
      <v-container>

        <form>
          <v-text-field v-model="endpoint" label="Pod Endpoint" required>
          </v-text-field>

          <v-btn color="primary" @click.native="connect()">
            <v-icon left>desktop_windows</v-icon> Connect
          </v-btn>
        </form>

      </v-container>
    </v-content>
  </v-app>
</template>

<script>

//import WebSocketClient from 'ws'
import * as io from 'socket.io-client'  // https://github.com/gdi2290/angular-starter/issues/221
//import eio from 'engine.io-client'

export default {
  name: 'Ssh',
  data () {
    return {
      endpoint:'/api/v1/namespaces/default/pods/mypod'
    }
  },
  methods: {
    connect () {
      var api = '/api'
      var comp = this;

      // https://github.com/websockets/wscat/blob/master/bin/wscat#L248
      function exec(info){
        /*
        var url = info.server;
        var protocol = info.protocol;
        var headers = info.headers;

        url = url + comp.endpoint + '/exec?container=mypod&stdin=1&stdout=1&stderr=1&tty=1&command=bash';
        headers['Sec-WebSocket-Protocol'] = info.protocol;

        var opts = {
          ca: new Buffer(info.ca, 'base64'),
          extraHeaders: headers,
          transports: ['websocket']
        }

        var socket = io(url, opts);
        socket.on('connect', function(){
          console.log('connect')
        });

        return;

        var url = info.server;
        var protocol = info.protocol;
        var headers = info.headers;

        url = url + comp.endpoint + '/exec?container=mypod&stdin=1&stdout=1&stderr=1&tty=1&command=bash';
        headers['Sec-WebSocket-Protocol'] = info.protocol;

        var opts = {
          ca: new Buffer(info.ca, 'base64'),
          extraHeaders: headers,
          transports: ['websocket']
        }

        var socket = eio.Socket(url, opts);
        socket.on('connect', function(){
          console.log('connect')
        });

        return;
        */


        //var url = info.server;
        //var protocol = info.protocol;
        //var options = {};

        //url = url + comp.endpoint + '/exec?container=mypod&stdin=1&stdout=1&stderr=1&tty=1&command=bash';
        //options.heaers = info.headers;
        //options.ca = new Buffer(info.ca, 'base64');

        var url = `ws://10.250.44.162:8080${api}/shell`
        const ws = new WebSocket(url);

        ws.onopen = () => {
          console.log('open')

          ws.send(info)
        }
        ws.onclose = (code) => {
          console.log('close :: ', code)
        }
        ws.onerror = (err) => {
          console.log('error :: ', err)
        }
        ws.onmessage = (data) => {
          console.log('message', data)
        }
      }

      this.$http
        .get(`${api}/shell/info`)
        .then((res)=>{
          exec(res.data);
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.vue-codemirror { text-align: left!important; }
.CodeMirror-hints { z-index: 203 !important; }
</style>
