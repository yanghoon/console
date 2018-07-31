<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <div v-for="(value, key) in content">
    <h2>{{ key }}</h2>
    <ul>
      <li v-for="link in value">
        <a v-bind:href="link.href" target="_blank">{{link.label}}</a>
      </li>
    </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      content: {
        "Essential Links": [
          {href:"https://vuejs.org", label:"Core Docs"},
          {href:"https://forum.vuejs.org", label:"Forum"},
          {href:"https://chat.vuejs.org", label:"Community Chat"},
          {href:"https://twitter.com/vuejs", label:"Twitter"},
          {href:"http://vuejs-templates.github.io/webpack/", label:"Docs for This Template"}
        ],
        "Ecosystem": [
          {href:"http://router.vuejs.org/", label:"vue-router"},
          {href:"http://vuex.vuejs.org/", label:"vuex"},
          {href:"http://vue-loader.vuejs.org/", label:"vue-loader"},
          {href:"https://github.com/vuejs/awesome-vue", label: "awesome-vue"}
        ]
      }
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
