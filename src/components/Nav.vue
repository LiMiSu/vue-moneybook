<template>
  <nav>
    <router-link to="/detail" class="item" active-class="selected">
      <Icon name="detail"></Icon>
    </router-link>
    <router-link to="/main" class="item" active-class="selected">
      <router-link v-if="addMoneyShow" to="/addmoney">
        <Icon name="add" class="addMoney"/>
      </router-link>
      <div v-else>
        <Icon name="home"/>
      </div>
    </router-link>
    <router-link to="/statistics" class="item" active-class="selected">
      <Icon name="statil"></Icon>
    </router-link>
  </nav>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  @Component
  export default class Nav extends Vue {
    get addMoneyShow() {
      return (this.$router as any).history.current.fullPath === '/main';
    }

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
      height: 2vh;
      min-width: 25vw;
      margin: 10px;
      padding: 6px;

      .icon {
        width: 30px;
        height: 30px;
      }

      &.selected {
        color: #FC6468;
      }
    }
  }
</style>