<template>
  <v-app>
    <v-content>
      <v-container fluid>

        <v-card>
          <v-card-title>
            Pods
            <v-spacer></v-spacer>
            <v-text-field v-model="keyword" append-icon="search" label="Search" single-line hide-details></v-text-field>
          </v-card-title>

          <v-data-table :headers="headers" :items="items" :loading="loading" :search="keyword" hide-actions class="elevation-1">
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>

            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.metadata.name }}</td>
              <td class="text-xs-center">{{ "-" }}</td>
              <td class="text-xs-center">{{ props.item.status.phase }}</td>
              <td class="text-xs-center">{{ "-" }}</td>
              <td class="text-xs-center">{{ props.item.status.startTime }}</td>
              <td class="text-xs-center">
                <v-icon>create</v-icon>
              </td>
            </template>

            <v-alert slot="no-results" :value="true" color="error" icon="warning">
              Your search for "{{ keyword }}" found no results.
            </v-alert>
          </v-data-table>
        </v-card>

      </v-container>
    </v-content>
  </v-app>
</template>

<script>
var meta = {
  "Name": "sortable | value=metadata.name | align=left",
  "Node": "value=kind",
  "Status": "sortable | value=status.phase",
  "Restarts": "value=value",
  "Age":"sortable | value=status.startTime"
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
  comp.items = pods.items
}

export default {
  name: 'Kube',
  data () {
    return {
      pod:{},
      headers: expandFields(),
      items: [],
      loading: true,
      keyword: ""
    }
  },
  mounted() {
    this.getPod()
  },
  methods: {
    getPod () {
      var api = '/api'

      this.loading = true
      this.$http
        .get(`${api}/pod`)
        .then((res)=>{
          handler(this, res.data)
          this.loading = false
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
