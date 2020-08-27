<template>
  <div class="inputNumber">100</div>
</template>

<script lang="ts">
  export default {
    name: 'InputNumber'
  };
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/helper.scss";
  .inputNumber {
    @extend %innerShadow;
    font-size: 36px;
    font-family: Consolas, monospace;
    padding: 9px 16px;
    text-align: right;
  }
</style>