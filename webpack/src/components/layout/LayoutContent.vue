<template>
  <!-- https://forum.vuejs.org/t/check-if-components-slot-is-empty/6015/4 -->
  <v-card>
    <v-card-title v-if="!!$slots.title">
      <slot name="title"></slot>
    </v-card-title>

    <template v-if="!!$slots.text">
      <v-card-text >
        <slot name="text"></slot>
      </v-card-text>
    </template>

    <template v-if="Object.keys($slots).length === 1 && !!$slots.default">
      <v-card-text>
        <slot></slot>
      </v-card-text>
    </template>
    <template v-else>
      <slot></slot>
    </template>

  </v-card>
</template>
