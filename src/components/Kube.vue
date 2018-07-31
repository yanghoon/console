<template>
  <div class="hello">
    <b-table striped hover :items="items" :fields="fields">
      <template slot="pod" slot-scope="data">
        <b-badge v-bind:variant="{'Running':'success','Failed':'danger'}[data.item.status.phase] || ''">
          <i v-bind:class="['fa', {'Running':'fa-check','Failed':'fa-close'}[data.item.status.phase] ]"></i>
        </b-badge>
        {{ data.value }}
      </template>
    </b-table>
  </div>
</template>

<script>
var meta = {
  "Pod": "sortable | formatter=item.metadata.name",
  "Node": "",
  "Status": "sortable | formatter",
  "Restarts": "",
  "Age":"sortable | formatter=item.status.startTime"
}

var formatter = {
  "Status": (value, key, item)=>{
    return item.status.phase
  }
}

function expandFields(comp){
  for(var name in meta){
    var m = meta[name].split(/ ?\| ?/);
    var opt = {
      key: name.toLowerCase(),
      label: name
    }

    if(m.length){
      for(var j in m){
        var op1 = m[j].split("=")[0]
        var op2 = m[j].split("=")[1]
        switch(op1){
          case 'sortable':
            opt.sortable = true
            break;
          case 'formatter':
            opt.formatter = formatter[name] || (function(expr){
              return function(value, key, item){
                return eval(expr)
              }
            })(op2)
            break;
        }
      }
    }

    var idx = comp.fields.indexOf(name)
    comp.fields[idx] = opt
  }
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
      fields: Object.keys(meta),
      items: []
    }
  },
  created() {
    expandFields(this)
    this.getPod()
  },
  methods: {
    getPod () {
      var api = '/api'

      this.$http
        .get(`${api}/pod`)
        .then((res)=>{
          handler(this, res.data)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
