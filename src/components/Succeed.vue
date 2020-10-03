<template>
  <div class="succ">
    <div class="value">
      <Icon name="succeed"></Icon>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  @Component
  export default class Succeed extends Vue {

  }
</script>

<style lang="scss" scoped>
  .value{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: white;
    .icon{
      background: transparent;
      color: rgb(82,196,25);
      width: 100px;
      height: 100px;
    }
  }
</style>