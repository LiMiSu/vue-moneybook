<template>
  <div>
    <div ref="container" class="content" v-if="getInitShowTag"></div>
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
    @Prop() getInitShowTag?: Function;
    chart?: ECharts;

    initChart(value: EChartOption) {
      this.chart = echarts.init(this.$refs.container as HTMLDivElement);
      this.chart.clear();
      this.chart.showLoading();
      this.chart.setOption(value, true);
      this.chart.hideLoading();
      this.chart.off('mouseover');
      this.chart.off('touchstart');
    }

    ChartStart(value: EChartOption) {
      this.initChart(value);
      if (this.getInitShowTag) {
        this.getInitShowTag(this.initShowTag);
        this.initAction();
      }
    }

    mounted() {
      if (this.option === undefined) {
        return console.error('options 为空');
      }
      this.ChartStart(this.option);
    }

    @Watch('option')
    onOptionChange(newValue: EChartOption) {
      this.ChartStart(newValue);
    }


    get maxtag() {
      return Math.max(...((this.option?.series as any)[0].data as any).map((item: any) => +item.value));
    }

    get initShowTag() {
      return ((this.option?.series as any)[0].data as any).filter((item: any) => item.value === this.maxtag)[0].name;
    }


    initAction() {
      if (this.getInitShowTag) {
        this.chart?.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          name: this.initShowTag,
        });
        this.chart?.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          name: this.initShowTag,
        });
        // PC端
        this.chart?.on('mouseover', (value: any) => {
          if (value.name != this.initShowTag) {
            this.chart?.dispatchAction({
              type: 'hideTip',
              seriesIndex: 0,
              name: this.initShowTag
            });
            this.chart?.dispatchAction({
              type: 'downplay',
              seriesIndex: 0,
              name: this.initShowTag
            });
          }
          if ((this.chart as any)._dom.innerText) {
            if (this.getInitShowTag) {
              this.getInitShowTag(value.name);
            }
          }
        });
        this.chart?.on('mouseout', () => {
          this.chart?.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            name: this.initShowTag
          });
          this.chart?.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            name: this.initShowTag
          });
        });

        //移动端
        this.chart?.on('touchstart', (value: any) => {
          if (value.name != this.initShowTag) {
            this.chart?.dispatchAction({
              type: 'hideTip',
              seriesIndex: 0,
              name: this.initShowTag
            });
            this.chart?.dispatchAction({
              type: 'downplay',
              seriesIndex: 0,
              name: this.initShowTag
            });
          }
          if ((this.chart as any)._dom.innerText) {
            if (this.getInitShowTag) {
              this.getInitShowTag(value.name);
            }
          }
        });
        this.chart?.on('touchend', () => {
          this.chart?.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            name: this.initShowTag
          });
          this.chart?.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            name: this.initShowTag
          });
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    max-width: 100%;
    min-height: 30vh;

  }
</style>