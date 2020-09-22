<template>
  <div ref="container" class="content">
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop, Watch} from 'vue-property-decorator';
  import echarts, {ECharts,EChartOption} from 'echarts';

  @Component
  export default class Echarts extends Vue {
    @Prop() option?: EChartOption;
    chart?: ECharts;

    mounted() {
      if (this.option === undefined) {
        return console.error('options 为空');
      }
      this.chart = echarts.init(this.$refs.container as HTMLDivElement);
      this.chart.setOption(this.option!);
    }

    @Watch('option')
    onOptionChange(newValue: EChartOption) {
      this.chart!.setOption(newValue)
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    max-width: 100%;
    min-height: 40vh;
  }
</style>