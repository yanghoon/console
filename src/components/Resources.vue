<template>
  <v-container fluid>
    <v-layout row wrap align-center justify-center>
      <v-flex xs11>

        <!--
        <v-breadcrumbs divider="-">
          <v-breadcrumbs-item v-for="(sel, index) in select" :key="index">
            <v-select :items="sel.items"
                item-text="name" item-value="name"
                :label="sel.label" v-model="sel.selected" @change="changeCluster">
            </v-select>

          </v-breadcrumbs-item>
        </v-breadcrumbs>
        -->

        <v-layout row wrap align-center justify-start>
          <v-flex xs2>
            <v-select :items="select[0].items"
                item-text="name" item-value="name" auto
                :label="select[0].label" v-model="select[0].selected" @change="changeCluster">
            </v-select>
          </v-flex>

          <div class="text-md-center"> <span>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</span> </div>
          <v-flex xs2>
            <v-select :items="select[1].items"
                item-text="metadata.name" item-value="metadata.name" auto
                :label="select[1].label" v-model="select[1].selected"  @change="getResources">
            </v-select>
          </v-flex>

          <div class="text-md-center" v-show="select[1].selected"> <span>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</span> </div>
          <v-flex xs2 v-show="select[1].selected">
            <v-select :items="select[2].items"
                item-text="text" item-value="value" auto
                :label="select[2].label" v-model="select[2].selected" @input="getResources">
            </v-select>
          </v-flex>
        </v-layout>

        <v-card>
          <v-card-title>
            Pods
            <v-spacer></v-spacer>
            <v-text-field v-model="table.keyword" @keyup.esc="table.keyword = undefined"
                          hide-details clearable
                          append-icon="search" label="Search"></v-text-field>
          </v-card-title>

          <v-data-table :headers="headers" :items="table.items" :loading="table.loading" :search="table.keyword" hide-actions class="elevation-1">
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>

            <template slot="items" slot-scope="props">
              <td class="text-xs-left">
                <!-- https://router.vuejs.org/kr/guide/essentials/navigation.html -->
                <router-link :to="`/${select[2].selected}/${props.item.metadata.name}?cs=${select[0].selected}&ns=${select[1].selected}`">
                  {{ props.item.metadata.name }}
                </router-link>
              </td>
              <td class="text-xs-center">{{ "-" }}</td>
              <td class="text-xs-center">{{ props.item.status ? props.item.status.phase : '-' }}</td>
              <td class="text-xs-center">{{ "-" }}</td>
              <!-- <td class="text-xs-center">{{ props.item.status.startTime }}</td> -->
              <td class="text-xs-center">{{ props.item.metadata.creationTimestamp | moment('from', true) }}</td>
              <td class="text-xs-center">

                <v-tooltip right :open-delay="0" :close-delay="0">
                  <v-btn slot="activator" color="primary" flat icon
                         @click="showEditor(props.item)">
                    <v-icon>create</v-icon>
                  </v-btn>
                  <span>Edit Yaml</span>
                </v-tooltip>

                <v-tooltip right :open-delay="0" :close-delay="0"
                           v-if="select[2].selected == 'pod'">
                  <v-btn slot="activator" color="primary" flat icon
                         @click="showSsh(props.item)">
                    <v-icon>web_asset</v-icon>
                  </v-btn>
                  <span>Open Shell</span>
                </v-tooltip>

                <v-tooltip right :open-delay="0" :close-delay="0"
                           v-if="select[2].selected == 'pod'">
                  <v-btn slot="activator" color="primary" flat icon
                         @click="showLog(props.item)">
                    <v-icon>notes</v-icon>
                  </v-btn>
                  <span>Logs</span>
                </v-tooltip>
              </td>
            </template>

            <v-alert slot="no-results" :value="true" color="error" icon="warning">
              Your search for "{{ table.keyword }}" found no results.
            </v-alert>
          </v-data-table>
        </v-card>

      </v-flex>
    </v-layout>

    <v-dialog v-model="editor.show" max-width="1000">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ editor.selected && editor.selected.metadata.name }}
        </v-card-title>

        <v-card-text>
          <codemirror v-model="editor.code" :options="editor.options"></codemirror>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="editor.show = false" v-if="false" disabled>Save</v-btn>
          <v-btn color="blue darken-1" flat @click="editor.show = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="ssh.show" max-width="1000" lazy :fullscreen="ssh.full">
      <v-card>
        <v-card-title class="ssh-dialog headline grey lighten-2">
          {{ ssh.selected && ssh.selected.metadata.name }}
          <v-spacer></v-spacer>
          <v-btn color="primary" flat icon @click="ssh.full = !ssh.full">
            <v-icon>{{ !ssh.full ? 'fullscreen' : 'fullscreen_exit' }}</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <!-- https://kr.vuejs.org/v2/guide/components.html#%EB%8F%99%EC%A0%81-Props -->
          <ssh-kube :info="ssh"></ssh-kube>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="ssh.show = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="log.show" max-width="1000" lazy>
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ log.selected && log.selected.metadata.name }}
        </v-card-title>

        <v-card-text>
          <!-- https://kr.vuejs.org/v2/guide/components.html#%EB%8F%99%EC%A0%81-Props -->
          <ssh-log :info="log"></ssh-log>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="log.show = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>

function expandFields(meta){
  var arr = [];
  for(var name in meta){
    var m = meta[name].split(/ ?\| ?/);
    var opt = {
      text: name,
      align: 'center',
      sortable: false
    }

    if(m.length){
      for(var j in m){
        var op1 = m[j].split("=")[0]
        var op2 = m[j].split("=")[1]
        switch(op1){
          case 'sortable':
            opt.sortable = true
            break;
          case 'value':
          case 'align':
            opt[op1] = op2
            break;
        }
      }
    }
    arr.push(opt)
  }

  return arr
}

import 'codemirror/theme/base16-dark.css'
import 'codemirror/mode/yaml/yaml.js'

const _ = require('underscore');

export default {
  name: 'Kube',
  data () {
    return {
      pod:{},
      select: [
        {
          label: 'Cluster',
          selected: 'zcp-demo',
          items: []
        },
        {
          label: 'Namespace',
          selected: 'zcp-system',
          items: []
        },
        {
          label: 'Kind',
          selected: undefined,
          items: [
            {text:"Node", value:"node"},
            {text:"Deployment", value:"deployment"},
            {text:"Pod", value:"pod"},
            {text:"Service", value:"svc"},
            {text:"Ingress", value:"ing"},
            {text:"ConfigMap", value:"cm"},
            {text:"Secret", value:"secrets"},
            {text:"PersistentVolume", value:"pv"},
            {text:"PersistentVolumeClaim", value:"pvc"},
            {text:"StatefulSets", value:"statefulset"},
            {text:"CronJob", value:"cronjob"},
            {text:"Job", value:"job"}
          ]
        },
      ],
      table: {
        items: [],
        loading: false,
        keyword: "",
        headers: []
      },
      editor: {
        show: false,
        selected: null,
        code: "(Loading...)",
        options: {
          // codemirror options
          tabSize: 2,
          mode: 'text/x-yaml',
          theme: 'base16-dark',
          lineNumbers: true,
          line: true
        }
      },
      ssh: {
        show: false,
        cs: undefined,
        ns: undefined,
        pod: undefined,
        full: false,
        con: {}
      },
      log: {
        show: false,
        cs: undefined,
        ns: undefined,
        pod: undefined,
        con: {}
      }
    }
  },
  computed: {
    headers (){
      var meta = {
        "Name": "sortable | value=metadata.name | align=left",
        "Node": "value=kind",
        "Status": "sortable | value=status.phase",
        "Restarts": "value=value",
        "Age":"sortable | value=status.startTime",
        "":"value=none",
      }

      var kind = this.select[2].selected
      if(kind == 'ing'){
        meta.Endpoint = "value=spec.rules[0].host"
      }

      return expandFields(meta)
    }
  },
  mounted() {
    this.getCluster()
    if(this.select[0].selected){
      this.changeCluster()
    }
  },
  methods: {
    getPod () {
      var api = '/api'

      var cluster = this.select[0].selected;
      var ns = this.select[1].selected;

      this.table.loading = true
      this.$http
        .get(`${api}/cluster/${cluster}/namespace/${ns}/pod/list`)
        .then((res)=>{
          this.pod = res.data
          this.table.items = res.data.items
          this.table.loading = false
        })
    },
    getCluster() {
      var api = '/api'

      this.$http
        .get(`${api}/cluster/list`)
        .then((res)=>{
          this.select[0].items = res.data
        })
    },
    changeCluster() {
      var api = '/api'

      this.$http
        .get(`${api}/cluster/${this.select[0].selected}/namespace/list`)
        .then((res)=>{
          this.select[1].items = res.data.items
        })
    },
    showEditor (item) {
      this.editor.show=!this.editor.show;
      this.editor.selected = item;

      var cs = this.select[0].selected;
      var ns = this.select[1].selected;
      var kind = this.select[2].selected;

      var api = '/api'
      this.$http
        .get(`${api}/${kind}/${item.metadata.name}?type=yaml&cs=${cs}&ns=${ns}`)
        .then((res)=>{
          console.log(res)
          this.editor.code = res.data
        })
    },
    showSsh (item) {
      this.ssh.show = true;
      this.ssh.selected = item;

      this.ssh.cs = this.select[0].selected;
      this.ssh.ns = this.select[1].selected;
      this.ssh.pod = item.metadata.name;
      this.ssh.con.items = _.map(item.spec.containers, (con) => {return con.name})

      /*
      var api = '/api'
      this.$http
        .get(`${api}/${kind}/${item.metadata.name}?type=yaml&cs=${cs}&ns=${ns}`)
        .then((res)=>{
          console.log(res)
          this.editor.code = res.data
        })
      */
    },
    showLog (item) {
      this.log.show = true;
      this.log.selected = item;

      this.log.cs = this.select[0].selected;
      this.log.ns = this.select[1].selected;
      this.log.pod = item.metadata.name;
      this.log.con.items = _.map(item.spec.containers, (con) => {return con.name})
    },
    getResources () {
      var api = '/api'
      var cs = this.select[0].selected;
      var ns = this.select[1].selected;
      var kind = this.select[2].selected;

      if(!ns || !kind)
        return;

      this.table.loading = true
      this.table.keyword = undefined
      this.$http
        .get(`${api}/${kind}/list?cs=${cs}&ns=${ns}`)
        .then((res)=>{
          console.log(res)
          //this.pod = res.data
          this.table.items = res.data.items
          this.table.loading = false
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.vue-codemirror { text-align: left!important; }
.CodeMirror { height: 500px; }
.CodeMirror-hints { z-index: 203 !important; }

.ssh-dialog { padding: 8px; font-size: 20px!important;}
</style>
