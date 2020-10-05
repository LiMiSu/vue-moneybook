<template>
  <div class="warpper">
    <div class="main">
      <Icon name="succeed"></Icon>
      <div class="succeed">{{this.$store.state.isSucceed}}</div>
      <div class="yes" @click="hidden">确&nbsp;定</div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  @Component
  export default class Succeed extends Vue {
    hidden() {
      const arr=['账单编辑成功！','记账成功！','账单删除成功！']
      if (this.$store.state.isSucceed && arr.indexOf(this.$store.state.isSucceed)>0) {
        this.$store.state.isSucceed = '';
        if (this.$route.params.id){
          this.$router.replace('/detail');
        }else {
          this.$router.replace('/main');
        }
      } else {
        this.$store.state.isSucceed = '';
        if (!this.$store.state.isSucceed) {
          this.$router.go(-1);
        }
      }
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