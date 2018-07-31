<template>
  <v-app>
    <v-content>
      <v-container fluid>

        <v-card>
          <v-card-title>
            Pods
            <v-spacer></v-spacer>
            <v-text-field v-model="table.keyword" append-icon="search" label="Search" single-line hide-details></v-text-field>
          </v-card-title>

          <v-data-table :headers="table.headers" :items="table.items" :loading="table.loading" :search="table.keyword" hide-actions class="elevation-1">
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>

            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.metadata.name }}</td>
              <td class="text-xs-center">{{ "-" }}</td>
              <td class="text-xs-center">{{ props.item.status.phase }}</td>
              <td class="text-xs-center">{{ "-" }}</td>
              <td class="text-xs-center">{{ props.item.status.startTime }}</td>
              <td class="text-xs-center">
                <v-btn color="primary" flat icon @click.native="editor.show=!editor.show; editor.selected=props.item">
                  <v-icon>create</v-icon>
                </v-btn>
                <v-btn color="primary" flat icon>
                  <v-icon>web_asset</v-icon>
                </v-btn>
                <v-btn color="primary" flat icon>
                  <v-icon>notes</v-icon>
                </v-btn>
              </td>
            </template>

            <v-alert slot="no-results" :value="true" color="error" icon="warning">
              Your search for "{{ table.keyword }}" found no results.
            </v-alert>
          </v-data-table>
        </v-card>

      </v-container>
    </v-content>

    <v-dialog v-model="editor.show" width="700">
      <v-card>
        <v-card-title class="headline grey lighten-2"primary-title>
          {{ editor.selected && editor.selected.metadata.name }}
        </v-card-title>

        <v-card-text>
          <codemirror v-model="editor.code" :options="editor.options"></codemirror>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="editor.show = false">Save</v-btn>
          <v-btn color="blue darken-1" flat @click.native="editor.show = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
var meta = {
  "Name": "sortable | value=metadata.name | align=left",
  "Node": "value=kind",
  "Status": "sortable | value=status.phase",
  "Restarts": "value=value",
  "Age":"sortable | value=status.startTime",
  "":"value=none",
}

function expandFields(){
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

function handler(comp, pods){
  comp.pod = pods
  comp.table.items = pods.items
}

import 'codemirror/theme/base16-dark.css'

import 'codemirror/mode/yaml/yaml.js'
import 'codemirror/mode/xml/xml.js'

import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/xml-hint.js'
import 'codemirror/addon/hint/html-hint.js'

import 'codemirror/mode/htmlmixed/htmlmixed.js'

export default {
  name: 'Kube',
  data () {
    return {
      pod:{},
      table: {
        headers: expandFields(),
        items: [],
        loading: true,
        keyword: ""
      },
      editor: {
        show: false,
        selected: null,
        code: "<html></html>",
        options: {
          // codemirror options
          tabSize: 2,
          mode: 'text/html',
          theme: 'base16-dark',
          lineNumbers: true,
          line: true,
          extraKeys: {"Ctrl-Space": "autocomplete"}
        }
      }
    }
  },
  mounted() {
    this.getPod()
  },
  methods: {
    getPod () {
      var api = '/api'

      this.table.loading = true
      this.$http
        .get(`${api}/pod`)
        .then((res)=>{
          handler(this, res.data)
          this.table.loading = false
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
