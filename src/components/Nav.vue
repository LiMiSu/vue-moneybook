<template>
  <nav>
    <router-link to="/statistics" class="item" active-class="selected">
      <Icon name="statistics"/>
      报表
    </router-link>
    <router-link to="/money" class="item" active-class="selected">
      <router-link v-if="addMoneyShow" to="/addmoney">
        <Icon  name="add" class="addMoney" @click="addMoneyPad"/>
      </router-link>
      <div v-else class="tis">
        <Icon name="label"/>
        明细
      </div>
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
      return (this.$router as any).history.current.fullPath === '/money';
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
    position: relative;

    > .item, .tis {
      padding: 2px 0;
      width: 33.33333%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;

      .icon {
        width: 32px;
        height: 32px;

        &.addMoney {
          position: absolute;
          left: calc(50vw - 45px);
          bottom: 0;
          width: 90px;
          height: 90px;
          background: transparent;
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