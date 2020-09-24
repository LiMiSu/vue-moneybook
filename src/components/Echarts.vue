<template>
  <div ref="container" class="content" @click="transferText" rel="echarts">
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop, Watch} from 'vue-property-decorator';
  import echarts, {ECharts, EChartOption} from 'echarts';

  @Component
  export default class Echarts extends Vue {
    @Prop() option?: EChartOption;
    @Prop() getText!: Function;
    chart?: ECharts;

    mounted() {
      if (this.option === undefined) {
        return console.error('options 为空');
      }
      this.chart = echarts.init(this.$refs.container as HTMLDivElement);
      this.chart.setOption(this.option!);
    }


    get max() {
      return Math.max(...((this.option!.series as any)[0].data as any).map((item: any) => +item.value));
    }

    get tag() {
      return ((this.option!.series as any)[0].data as any).filter((item: any) => item.value === this.max)[0].name;
    }

    @Watch('option')
    onOptionChange(newValue: EChartOption) {
      this.chart!.setOption(newValue);
    }

    transferText() {
      this.getText((this.chart as any)._dom.innerText);
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    max-width: 100%;
    min-height: 40vh;
  }
</style>