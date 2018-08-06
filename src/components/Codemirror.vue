<template>
  <v-container fluid>
    <v-layout row wrap align-center justify-center>
      <v-flex xs11>

        <codemirror :code="code" :options="options"></codemirror>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
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
      code: '<!-- By "Ctrl-Space", you can use autocomplete for HTML. -->\n',
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vue-codemirror { text-align: left!important; }
</style>
