<template>
<!--  数据图形化组件-->
  <div ref="container" class="content">

  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';
  import echarts from 'echarts';
  import EChartOption = echarts.EChartOption;

  @Component
  export default class Echarts extends Vue {
    @Prop() option?: EChartOption;

    mounted() {
      const chart = echarts.init(this.$refs.container as HTMLDivElement);
      chart.setOption(this.option!)
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    max-width: 100%;
    min-height: 30vh;
  }
</style>