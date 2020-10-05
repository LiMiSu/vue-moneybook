<template>
  <div>
    <div ref="container" class="content" v-if="optionType==='pie'"></div>
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
      if (this.optionType === 'pie') {
        this.$store.state.circleShowDate = this.maxName;
      } else if (this.optionType !== 'pie') {
        this.$store.state.circleShowDate = '';
      }
      this.initAction();
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


    get optionType() {
      return this.option?.series && this.option?.series[0].type;
    }

    get maxtag() {
      return Math.max(...((this.option?.series as any)[0].data as any).map((item: any) => +item.value));
    }

    get maxName() {

      return ((this.option?.series as any)[0].data as any).filter((item: any) => item.value === this.maxtag)[0].name;
    }


    initAction() {
      this.chart?.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        name: this.$store.state.circleShowDate,
      });
      this.chart?.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        name: this.$store.state.circleShowDate,
      });
      // PC端
      this.chart?.on('mouseover', (value: any) => {
        if (value.name != this.$store.state.circleShowDate) {
          this.chart?.dispatchAction({
            type: 'hideTip',
            seriesIndex: 0,
            name: this.$store.state.circleShowDate
          });
          this.chart?.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            name: this.$store.state.circleShowDate
          });
        }
        if ((this.chart as any)._dom.innerText) {
          this.$store.state.circleShowDate = value.name;

        }
      });
      this.chart?.on('mouseout', (value: any) => {
        this.chart?.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          name: this.$store.state.circleShowDate
        });
        this.chart?.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          name: this.$store.state.circleShowDate
        });
      });
      //移动端
      this.chart?.on('touchstart', (value: any) => {
        if (value.name != this.$store.state.circleShowDate) {
          this.chart?.dispatchAction({
            type: 'hideTip',
            seriesIndex: 0,
            name: this.$store.state.circleShowDate
          });
          this.chart?.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            name: this.$store.state.circleShowDate
          });
        }

        if ((this.chart as any)._dom.innerText) {
          this.$store.state.circleShowDate = value.name;
        }
      });
      this.chart?.on('touchend', () => {
        this.chart?.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          name: this.$store.state.circleShowDate
        });
        this.chart?.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          name: this.$store.state.circleShowDate
        });
      });

      // this.chart?.off('legendselectchanged');
      //
      // this.chart?.on('legendselectchanged', (value: any) => {
      //   this.chart?.setOption({
      //     legend: {selected: {[value.name]: true}}
      //   });
      //   if (value.name != this.$store.state.circleShowDate) {
      //     this.chart?.dispatchAction({
      //       type: 'hideTip',
      //       seriesIndex: 0,
      //       name: this.$store.state.circleShowDate
      //     });
      //     this.chart?.dispatchAction({
      //       type: 'downplay',
      //       seriesIndex: 0,
      //       name: this.$store.state.circleShowDate
      //     });
      //   }
      //   this.$store.state.circleShowDate = value.name;
      // });
      // (this.chart as any).getZr().on('click',(value: any)=>{
      //   this.chart?.dispatchAction({
      //     type: 'showTip',
      //     seriesIndex: 0,
      //     name: this.$store.state.circleShowDate,
      //   });
      //   this.chart?.dispatchAction({
      //     type: 'highlight',
      //     seriesIndex: 0,
      //     name: this.$store.state.circleShowDate,
      //   });
      // })
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    max-width: 98vw;
    min-height: 30vh;
    border-radius: 10px;
  }
</style>