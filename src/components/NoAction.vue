<template>
  <div class="warpper">
    <div class="main">
      <Icon name="error"></Icon>
      <div class="succeed">此功能尚未开发,敬请期待!</div>
      <div class="yes" @click="hidden">确&nbsp;定</div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  @Component
  export default class NoAction extends Vue {
    hidden(){
      this.$store.state.noAction=!this.$store.state.noAction
    }
  }
</script>

<style lang="scss" scoped>
  %fl {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .warpper {
    @extend %fl;
    z-index: 9;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(200, 200, 200, 0.3);

    .main {
      @extend %fl;
      position: absolute;
      flex-direction: column;
      justify-content: space-between;
      width: 80%;
      height: 170px;
      background: white;
      border-radius: 10px;

      .icon {
        background: transparent;
        margin-top: 10px;
        color: #DE7873;
        width: 50px;
        height: 50px;
      }

      .succeed {
        @extend %fl;
        color: #999;
        width: 100%;
        height: 30px;
        margin-bottom: 10px;
      }

      .yes {
        @extend %fl;
        border-top: 1px solid rgb(243, 243, 243);
        width: 100%;
        height: 50px;
        color: #DE7873;
      }
    }

  }

</style>