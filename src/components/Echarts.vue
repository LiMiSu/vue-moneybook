<template>
  <div>
    <div ref="container" class="content" v-if="getText" @click="transferText"></div>
    <div ref="container" class="content" v-else></div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop, Watch} from 'vue-property-decorator';
  import echarts, {ECharts, EChartOption} from 'echarts';

  @Component
  export default class Echarts extends Vue {
    @Prop() option?: EChartOption;
    @Prop() getText?: Function;
    chart?: ECharts;

    mounted() {
      if (this.option === undefined) {
        return console.error('options 为空');
      }
      this.chart = echarts.init(this.$refs.container as HTMLDivElement);
      this.chart.setOption(this.option);
      if (this.getText) {
        this.getText(this.tag);
      }
    }

    @Watch('option')
    onOptionChange(newValue: EChartOption) {
      this.chart?.setOption(newValue);
      if (this.getText) {
        this.getText(this.tag);
      }
    }

    transferText() {
      if ((this.chart as any)._dom.innerText) {
        if (this.getText) {
          this.getText((this.chart as any)._dom.innerText.slice(5).split(':')[0]);
        }
      }
    }
    get max() {
      return Math.max(...((this.option?.series as any)[0].data as any).map((item: any) => +item.value));
    }

    get tag() {
      return ((this.option?.series as any)[0].data as any).filter((item: any) => item.value === this.max)[0].name;
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    max-width: 100%;
    min-height: 30vh;

  }
</style>