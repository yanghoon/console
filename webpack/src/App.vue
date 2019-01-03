<template>
  <div>
    <!-- <img src="./assets/logo.png"> -->
    <!-- <HelloWorld/> -->
    <!-- <router-view/> -->
    <vue-extend-layouts v-if="$route.path !== '/error'"/>
    <router-view v-else/>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
</style>
