<template>
  <div>
    <div>当前页面不存在，请检查网站是否正确</div>
    <div>
      <div @click="goBack">返回首页</div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  @Component
  export default class NotFound extends Vue {
      goBack(){
        this.$router.go(-1)
      }
  }
</script>

<style lang="scss" scoped>

</style>