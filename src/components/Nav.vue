<template>
  <nav>
    <router-link to="/detail" class="item" active-class="selected">
<!--      <svg>-->
<!--        <text>明细</text>-->
<!--      </svg>-->
      明细
    </router-link>
    <router-link to="/main" class="item" active-class="selected">
      记账
    </router-link>
    <router-link to="/statistics" class="item" active-class="selected">
      统计
    </router-link>
  </nav>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  @Component
  export default class Nav extends Vue {

  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/helper.scss";

  nav {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    margin: 10px;
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 8vh;
      width: 25vw;
      margin: 10px;
      padding: 6px;
      &.selected {
        color: red;
      }
    }
  }
</style>