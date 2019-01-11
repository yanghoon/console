<template>
  <!-- <div v-if="!!val">
    <v-chip v-for="(k, v) in labels" :key="k + '-' + v"
        small color="grey lighten-2">
    <span>{{ k }}</span> : {{ v }}
    </v-chip>
  </div>
  <span v-else>-</span> -->
  <div v-if="!!labels">
    <v-chip v-for="(v, k) in labels" :key="k"
        small color="grey lighten-2">
    <span>{{ k }}</span> : {{ v }}
    </v-chip>
  </div>
  <span v-else>-</span>
</template>

<script>
export default {
  props: ['labels']
}
</script>
