<template>
  <div class="dayBook" @click="$store.state.showBody=!$store.state.showBody">
    <div class="left"></div>
    {{dayValue}}
    <div class="right"></div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  @Component
  export default class DayBook extends Vue {
    get dayValue() {
      return new Date(this.$store.state.record.createdAt).getDate();
    }
  }
</script>

<style lang="scss" scoped>
  .dayBook {
    height: 22px;
    width: 33px;
    border: 1px solid #5a5a5a;
    border-radius: 1px;
    box-shadow: 0px -3px 0px 0px #333333;
    background: white;
    position: relative;
    font-size: 12px;
    line-height: 22px;
    text-align: center;

    .left {
      position: absolute;
      left: 3px;
      top: -7px;
      width: 0;
      height: 10px;
      border: 1px solid #5a5a5a;
    }

    .right {
      position: absolute;
      right: 3px;
      top: -7px;
      width: 0;
      height: 10px;
      border: 1px solid #5a5a5a;
    }
  }
</style>