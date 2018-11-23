<template>
  <v-container fluid>
    <v-layout row wrap align-center justify-center>
      <v-flex xs11>

      <!-- Cluster & Resource Navigation -->
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

        <!-- Main Data Table -->
        <v-card>
          <v-card-title>
            <!-- Kind: Pods -->
            <v-spacer></v-spacer>
            <v-text-field v-model="table.keyword" @keyup.esc="table.keyword = undefined"
                          hide-details clearable
                          append-icon="search" label="Search"></v-text-field>
          </v-card-title>

          <v-data-table :headers="table.headers" :items="table.items" :loading="table.loading" :search="table.keyword" hide-actions class="elevation-1" item-key="id">
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>

            <template slot="expand" slot-scope="props">
              <v-card>
                <v-card-text>
                  <v-layout>
                    <v-flex xs2> containers </v-flex>
                    <v-flex xs6 v-for="c in props.item.spec.containers" :key="image"> {{ c.image }}</v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </template>

            <template slot="items" slot-scope="props">
            <tr @click="props.expanded = !props.expanded">
              <td v-for="meta in table.headers" :class="`text-xs-${meta.align}`">
                <!-- COMMON: human readable time -->
                <template v-if="meta.slot == 'from-now'">
                  {{ _.property(meta.value.split('.'))(props.item) | moment('from', true) || '-' }}
                </template>

                <!-- COMMON: resource detail view link -->
                <template v-else-if="meta.text == 'Name'">
                  <router-link :to="`/${select[2].selected}/${props.item.metadata.name}?cs=${select[0].selected}&ns=${select[1].selected}`">
                    {{ _.property(meta.value.split('.'))(props.item) }}
                  </router-link>
                </template>

                <!-- COMMON: Label (key,value) -->
                <template v-else-if="meta.slot == 'label'">
                  <v-tooltip v-if="_.size(props.item.metadata.labels) > 3" right :open-delay="0.3" :close-delay="0.3">
                    <div slot="activator">
                      <div v-for=" e in _.pairs(props.item.metadata.labels).slice(0, 2)" class="mb-1">
                        <strong>{{ e[0] }}:</strong>
                        <span>{{ e[1] }}</span>
                      </div>
                      <div>more..</div>
                    </div>
                    <div v-for="(v, k) in props.item.metadata.labels" :key="k" class="mb-1">
                      <strong>{{ k }}:</strong>
                      <span>{{ v }}</span>
                    </div>
                  </v-tooltip>

                  <div v-else v-for="(v, k) in props.item.metadata.labels" :key="k" class="mb-2">
                    <strong>{{ k }}:</strong>
                    <span>{{ v }}</span>
                  </div>
                </template>

                <!-- COMMON: tools -->
                <template v-else-if="meta.slot == 'action'">
                  <v-tooltip right :open-delay="0.3" :close-delay="0.3">
                    <v-btn slot="activator" color="primary" flat icon @click="showEditor(props.item)" disabled>
                      <v-icon>create</v-icon>
                    </v-btn>
                    <span>Edit Yaml</span>
                  </v-tooltip>

                  <v-tooltip right :open-delay="0.3" :close-delay="0.3" v-if="select[2].selected == 'pod'">
                    <v-btn slot="activator" color="primary" flat icon @click="showSsh(props.item)">
                      <v-icon>web_asset</v-icon>
                    </v-btn>
                    <span>Open Shell</span>
                  </v-tooltip>

                  <v-tooltip right :open-delay="0.3" :close-delay="0.3" v-if="select[2].selected == 'pod'">
                    <v-btn slot="activator" color="primary" flat icon @click="showLog(props.item)" disabled>
                      <v-icon>notes</v-icon>
                    </v-btn>
                    <span>Logs</span>
                  </v-tooltip>
                </template>

                <!-- Deploy -->
                <template v-else-if="meta.slot == 'replica'">
                  {{ props.item.status.replicas }} / {{ props.item.status.availableReplicas }}
                </template>
                <template v-else-if="meta.slot == 'images'">
                  <div v-for="img in _.map(props.item.spec.template.spec.containers, _.property('image'))">
                    {{ img }}
                  </div>
                </template>

                <!-- Ingress Rules -->
                <template v-else-if="meta.slot == 'ingress'">
                  <div v-for="rule in props.item.spec.rules">
                    <v-tooltip v-for="svc in rule.http.paths" style="display: block;" class="mb-2"
                               right :open-delay="0.3" :close-delay="0.3" :key="svc.path">
                      <a slot="activator" target="_blank" :href="`${props.item.spec.tls ? 'https' : 'http'}://${rule.host}${svc.path || ''}`">
                        {{ `${props.item.spec.tls ? 'https' : 'http'}://${rule.host}${svc.path || ''}` }}
                      </a>
                      <span>
                        {{ `service: ${svc.backend.serviceName}:${svc.backend.servicePort}` }}
                      </span>
                    </v-tooltip>
                  </div>
                </template>

                <!-- POD -->
                <template v-else-if="meta.slot == 'pod-restart'">
                  {{ _.reduce(props.item.status.containerStatuses, (sum, item)=>{return sum + item.restartCount}, 0) || '-' }}
                </template>

                <template v-else>
                  {{ _.property(meta.value.split('.'))(props.item) || '-' }}
                </template>
              </td>
            </tr>
            </template>

            <v-alert slot="no-results" :value="true" color="error" icon="warning">
              Your search for "{{ table.keyword }}" found no results.
            </v-alert>
          </v-data-table>
        </v-card>

      </v-flex>
    </v-layout>

    <!-- Dialog -->
    <!-- Resource Spec (YAML) -->
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
          <v-btn color="blue darken-1" flat @click="editor.show = false" disabled>Save</v-btn>
          <v-btn color="blue darken-1" flat @click="editor.show = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- SSH of Pod -->
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

    <!-- Logs of Pod -->
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
var meta = {
  // Pod (Common)
  "Name": "sortable | value=metadata.name | align=left | slot=link",
  "Node": "value=spec.nodeName",
  "Status": "sortable | value=status.phase",
  "Restarts": "slot=pod-restart",
  "Age":"sortable | value=metadata.creationTimestamp | slot=from-now",
  "Action":"text= | value=none | slot=action",
  // Node
  "Labels":"value=metadata.labels | align=left | slot=label",
  "Ready":"value=status.a",
  "CPU-Req":"value=status.a | text=CPU requests (cores)",
  "CPU-Lmt":"value=status.b | text=CPU limits (cores)",
  "Mem-Req":"value=status.c | text=Memory requests (bytes)",
  "Mem-Lmt":"value=status.d | text=Memory limits (bytes)",
  // Deployment
  "Deploy-Status":"text=Status | slot=replica",
  "Deploy-Selector":"text=Selector | align=left | value=spec.selector.matchLabels | slot=label",
  "Strategy":"value=spec.strategy.type",
  "Images":"value=spec.selector.matchLabels | align=left | slot=images",
  // Ingerss
  "Endpoint":"align=left | slot=ingress | value=spec.rules", //TODO
  // Service
  "ClusterIP":"align=left | value=spec.clusterIP",
  "Selector":"align=left | value=spec.selector | slot=label",
  "Service-Endpoint":"text=Endpoint | value=spec.rules", //TODO
  // RoleBinding
  "Role":"value=roleRef.name",
}
var COLS = {
  clusterroles: 'Name,Labels,Age,Action',
  node: 'Name,Labels,Ready,CPU-Req,CPU-Lmt,Mem-Req,Mem-Lmt,Age',
  deployment: 'Name,Deploy-Selector,Strategy,Images,Age,Action',
  ing: 'Name,Endpoint,Age,Action',
  svc: 'Name,Selector,ClusterIP,Service-Endpoint,Age,Action',
  pod: 'Name,Node,Status,Restarts,Age,Action',
  rolebinding: 'Name,Role,Age,Action',
}
var DEFAULT_COLS = 'Name,Age,Action'

function expandFields(cols){
  var arr = [];
  for(var i in cols){
    var name = cols[i];
    var m = meta[name].split(/ ?\| ?/);
    var opt = {text: name, align: 'center', sortable: false, value: ''}

    for(var j in m){
      var op1 = m[j].split("=")[0]
      var op2 = m[j].split("=")[1]
      switch(op1){
        case 'sortable':
          opt.sortable = true; break;
        case 'value':
        case 'align':
        default:
          opt[op1] = op2; break;
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
  name: 'Resources',
  data () {
    return {
      pod:{},
      select: [
        {label: 'Cluster',   items: [], selected: 'cloudzcp-pou-dev'},
        {label: 'Namespace', items: [], selected: 'default'},
        {
          label: 'Kind',
          selected: '',
          items: [
            // {text:"Node", value:"node"},
            // {text:"Deployment", value:"deployment"},
            {text:"Pod", value:"pod"},
            {text:"Service", value:"svc"},
            // {text:"Ingress", value:"ing"},
            {text:"ConfigMap", value:"cm"},
            {text:"Secret", value:"secrets"},
            // {text:"PersistentVolume", value:"pv"},
            {text:"PersistentVolumeClaim", value:"pvc"},
            // {text:"StatefulSets", value:"statefulset"},
            // {text:"CronJob", value:"cronjob"},
            // {text:"Job", value:"job"},
            // {text:"ClusterRoles", value:"clusterroles"},
            // {text:"RoleBinding", value:"rolebinding"},
          ]
        },
      ],
      table: {headers:[], items: [], loading: false, keyword: ""},
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
      ssh: {show: false, cs: undefined, ns: undefined, pod: undefined, con: {}, full: false },
      log: {show: false, cs: undefined, ns: undefined, pod: undefined, con: {} }
    }
  },
  computed: {
    _: () => { return _ }
  },
  mounted() {
    this.table.headers = this.getTabelHeaders()

    this.getCluster()
    this.select[0].selected && this.changeCluster()
  },
  methods: {
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
          this.table.headers = this.getTabelHeaders()
          this.table.items = res.data.items.map( (e,i)=>({id: i, ...e}) )
          this.table.loading = false
        })
    },
    getTabelHeaders () {
      var kind = this.select[2].selected;
      var cols = COLS[kind] || DEFAULT_COLS
      if(_.isString(cols)){
        COLS[kind] = expandFields(cols.split(','))
      }

      return COLS[kind]
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
