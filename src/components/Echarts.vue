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
        this.initAction()
      }
    }

    initAction(){
      if (this.getText) {
        this.chart?.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          name: this.tag
        });
        this.chart?.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          name: this.tag
        });

        //PC端
        this.chart?.on('mouseover', (value: any) => {
          if (value.name != this.tag) {
            this.chart?.dispatchAction({
              type: 'hideTip',
              seriesIndex: 0,
              name: this.tag
            });
            this.chart?.dispatchAction({
              type: 'downplay',
              seriesIndex: 0,
              name: this.tag
            });
          }
        });
        this.chart?.on('mouseout', () => {
          this.chart?.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            name: this.tag
          });
          this.chart?.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            name: this.tag
          });
        });

        //移动端
        this.chart?.on('touchstart', (value: any) => {
          if (value.name != this.tag) {
            this.chart?.dispatchAction({
              type: 'hideTip',
              seriesIndex: 0,
              name: this.tag
            });
            this.chart?.dispatchAction({
              type: 'downplay',
              seriesIndex: 0,
              name: this.tag
            });
          }
        });
        this.chart?.on('touchend', () => {
          this.chart?.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            name: this.tag
          });
          this.chart?.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            name: this.tag
          });
        });
      }
    }

    @Watch('option')
    onOptionChange(newValue: EChartOption) {
      this.chart?.setOption(newValue, true);
      if (this.getText) {
        this.getText(this.tag);
        this.initAction()
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
      return ((this.option?.series as any)[0].data as any).filter((item: any, index: number) => item.value === this.max)[0].name;
    }

    get index() {
      return this.tag.indexOf((this.option?.series as any)[0].data);
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    max-width: 100%;
    min-height: 30vh;

  }
</style>