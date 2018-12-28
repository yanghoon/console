<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">Page Not Found</h1>
    <h1 v-else>An error occurred</h1>
    <nuxt-link to="/">Home page</nuxt-link>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: '' // you can set a custom layout for the error page
}
</script>
