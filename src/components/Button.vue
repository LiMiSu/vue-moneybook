<template>
<!--  新建标签按钮组件-->
  <button class="button"
          @click="$emit('click', $event)">
    <slot/>
  </button>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  @Component
  export default class Button extends Vue {

  }
</script>

<style lang="scss" scoped>
  .button {
    background: #767676;
    color: white;
    border: none;
    border-radius: 4px;
    height: 40px;
    padding: 0 16px;
  }
</style>