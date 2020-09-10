<template>
  <nav>
    <!--  导航组件-->
    <router-link to="/labels" class="item" active-class="selected">
      <Icon name="label"/>
      钱包
    </router-link>
    <router-link to="/labels" class="item" active-class="selected">
      <Icon name="label"/>
      钱包
    </router-link>
    <router-link to="/money" class="item" active-class="selected">
      <div v-if="addMoneyShow">
        <Icon name="add" class="addMoney" @click="addMoneyPad"/>
      </div>
      <div v-else>
        <Icon name="label"/>
        明细
      </div>

    </router-link>
    <router-link to="/statistics" class="item" active-class="selected">
      <Icon name="statistics"/>
      报表
    </router-link>
    <router-link to="/statistics" class="item" active-class="selected">
      <Icon name="statistics"/>
      明细
    </router-link>
  </nav>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  @Component
  export default class Nav extends Vue {


    get addMoneyShow() {
      return (this.$router as any).history.current.fullPath==='/money';
    }

    addMoneyPad() {
      this.$store.state.changeShow = !this.$store.state.changeShow;
    }

  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/helper.scss";

  nav {
    @extend %outerShadow;
    display: flex;
    flex-direction: row;
    font-size: 12px;

    > .item {
      padding: 2px 0;
      width: 33.33333%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;

      .icon {
        width: 32px;
        height: 32px;

        .addMoney {
          float: left;
        }
      }
    }

    > .item.selected {
      color: $color-highlight;
    }

    .addMoneyTable .icon {
      color: red;
    }
  }
</style>