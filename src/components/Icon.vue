<template>
  <svg class="icon">
    <use v-bind:xlink:href="'#'+name"></use>
  </svg>
</template>

<script lang="ts">
  // import label from '@/assets/icons/label.svg';
  // import money from '@/assets/icons/money.svg';
  // import statistics from '@/assets/icons/statistics.svg';
  // console.log(label)
  // console.log(money)
  // console.log(statistics)

  //工程化引入
  //声明一个imporAll方法
  const importAll = (requireContext: __WebpackModuleApi.RequireContext) => requireContext.keys().forEach(requireContext);
  //使用它
  try { //单元测试的时候可能会出错，加try catch
    importAll(require.context('../assets/icons', true, /\.svg$/));
  } catch (error) {
    console.log(error);
  }

  export default {
    name: 'icon',
    props:['name']
  };
</script>

<style lang="scss" scoped>
  .icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>