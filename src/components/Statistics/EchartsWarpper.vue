<template>
  <div>
    <MoneyType class="s-type" class-prefix="statistics" :data-source="intervalList" :value.sync="$store.state.interval"/>
    <div class="nav-wrapper">
      <div class="around"></div>
      <div>
        <Year :chooseDate.sync="$store.state.chooseYear" v-if="interval==='year'"></Year>
        <Month :chooseMonth.sync="$store.state.chooseMonth" v-if="interval==='month'"></Month>
      </div>
      <div class="iconlist around">
        <Icon name="yuan" v-if="showLine" @click="$emit('update:showLine',!showLine)"></Icon>
        <Icon name="line" v-else @click="$emit('update:showLine',!showLine)"></Icon>
      </div>
    </div>
    <div v-if="recordByTagTime.length>0" class="echarts-item">
      <Echarts :option="lineOption" v-if="showLine"/>
      <Echarts :option="circleOption" :getInitShowTag="getInitShowTag" v-else/>
    </div>
    <div v-if="recordByTagTime.length>0" class="head">
      <div>{{interval === 'year' ? showYear : showMonth}}<span class="text-s">(单位：元)</span></div>
      <div class="total" v-if="showLine"><span class="text-s">总计：</span><span class="num">{{interval === 'year' ? yearTotal : monthTotal}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';
  import Year from '@/components/Statistics/Year.vue';
  import Month from '@/components/Statistics/Month.vue';
  import Echarts from '@/components/Statistics/Echarts.vue';
  import intervalList from '@/constants/intervalList';
  import dayjs from 'dayjs';
  import MoneyType from '@/components/MoneyType.vue';
  @Component({
    components: {MoneyType, Echarts, Month, Year}
  })
  export default class EchartsWarpper extends Vue {
    @Prop() recordByTagTime!: RecordByTag[];
    @Prop() monthTotal!: number;
    @Prop() yearTotal!: number;
    @Prop() showYear!: string;
    @Prop() showMonth!: string;
    @Prop() type!: string;
    @Prop() dayRecordList!: DayResult[];
    @Prop() monthRecordList!: MonthResult[];
    @Prop() initShowTag!: string;
    @Prop() showLine!: boolean;
    intervalList=intervalList
    beforeCreate() {
      this.$store.commit('fetchRecords');
      this.$store.commit('fetchChooseMonth');
      this.$store.commit('fetchChooseYear');
    }
    get interval() {
      return this.$store.state.interval;
    }
    get keyValueListOfMonth() {
      const today = this.$store.state.chooseMonth;
      const monthLength = dayjs(today).daysInMonth();
      const array = [];
      for (let i = 1; i <= monthLength; i++) {
        const date = dayjs(today).date(i).format('YYYY-M-DD');
        const found = (this.dayRecordList as DayResult[]).filter(item => dayjs(item.title).format('YYYY-M-DD') === date);
        let value = found.reduce((sum, item) => {
          return sum + item.total!;
        }, 0);
        value = value < 0 ? -value : value;
        array.push({date: date, value: value ? value : 0});
      }
      array.sort((a, b) => {
        if (dayjs(a.date).unix() > dayjs(b.date).unix()) {
          return 1;
        } else if (dayjs(a.date).unix() === dayjs(b.date).unix()) {
          return 0;
        } else {
          return -1;
        }
      });
      return array;
    }

    get keyValueListOfYear() {
      const today = this.$store.state.chooseYear;
      const array = [];
      for (let i = 0; i < 12; i++) {
        const date = dayjs(today).month(i).format('YYYY-M');
        const found = (this.monthRecordList as MonthResult[]).filter(item => dayjs(item.title).format('YYYY-M') === date);
        let value = found.reduce((sum, item) => {
          return sum + item.total!;
        }, 0);

        value = value < 0 ? -value : value;
        array.push({date: date, value: value ? value : 0});
      }
      array.sort((a, b) => {
        if (dayjs(a.date).unix() > dayjs(b.date).unix()) {
          return 1;
        } else if (dayjs(a.date).unix() === dayjs(b.date).unix()) {
          return 0;
        } else {
          return -1;
        }
      });
      return array;
    }
    get lineOption() {
      const monthKeys = this.keyValueListOfMonth.map(item => item.date);
      const monthValues = this.keyValueListOfMonth.map(item => item.value);
      const yearKeys = this.keyValueListOfYear.map(item => item.date);
      const yearValues = this.keyValueListOfYear.map(item => item.value);
      const interval = this.interval;
      const type = this.type;
      return {
        xAxis: {
          type: 'category',
          data: interval === 'year' ? yearKeys : monthKeys,
          axisLabel: {
            formatter: function (value: string) {
              return interval === 'year' ? value.substr(5) : value.substr(7);
            },
            fontSize: 10,
            color: '#999999'
          },
          axisLine: {
            color: '#999999'
          },
          splitLine: {
            show: true,
            interval: 0,
          },
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: function (value: string) {
              if (value.toString().length === 5) {
                value = +value / 10000 + '万';
              } else if (value.toString().length === 6) {
                value = +value / 100000 + '十万';
              } else if (value.toString().length === 7) {
                value = +value / 1000000 + '百万';
              } else if (value.toString().length === 8) {
                value = +value / 10000000 + '千万';
              } else if (value.toString().length === 9) {
                value = +value / 100000000 + '亿';
              } else if (value.toString().length === 10) {
                value = +value / 1000000000 + '十亿';
              } else if (value.toString().length === 11) {
                value = +value / 10000000000 + '百亿';
              } else if (value.toString().length === 12) {
                value = +value / 100000000000 + '千亿';
              } else if (value.toString().length >= 13) {
                value = '...亿';
              }
              return value;
            },
            axisLine: {
              color: '#999999'
            },
            color: '#999999',
            fontSize: 10,
            width: '40%',
          },
          axisTick: {
            show: false
          }
        },
        grid: {
          left: '12%',
          right: '10%',
          top: '10px'
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            animation: true,
            label: {
              color: '#fff',
            },
            lineStyle: {
              type: 'solid',
              width: 1,
              color: '#ccc',
            }
          },
          formatter: function (value: any) {
            const time = interval === 'year' ? dayjs(value[0].name).format('M') + '月' : dayjs(value[0].name).format('DD') + '日';
            const amount = type === '-' ? '支出：' + `${value[0].value}` + '元' : '收入：' + `${value[0].value}` + '元';
            return `${time}<br />${amount}`;
          },
        },
        series: [{
          data: interval === 'year' ? yearValues : monthValues,
          type: 'line',
          areaStyle: {},
          smooth: true,
          symbolSize: 5,
          symbol: 'none',
          lineStyle: {
            // color: 'blue',
          },
        }]
      };
    }

    get circleOption() {
      const monthTag = this.recordByTagTime.map(item => item.name);
      const monthRecord = this.recordByTagTime.map(item => {
        return {value: Math.abs(item.num), name: item.name};
      });
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          alwaysShowContent: false,
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          left: 10,
          data: monthTag,
          top: 'middle',
          selectedMode: false,
        },
        series: [
          {
            name: this.type === '-' ? '支出金额' : '收入金额',
            type: 'pie',
            radius: ['50%', '70%'],

            // avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: monthRecord,
          }
        ]
      };
    }
    getInitShowTag(value: string) {
      this.$emit('update:initShowTag',value)
    }

  }
</script>

<style lang="scss" scoped>
  .s-type {
    width: 40%;
  }
  .nav-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 16px 16px 0 16px;
    width: 100%;

    .around {
      width: 50px;
      height: 100%;
    }

    .iconlist {
      display: flex;
      justify-content: center;
      align-items: center;

      .icon {
        width: 30px;
        height: 30px;
      }
    }
  }
  .echarts-item {
    width: 98vw;
    background: rgb(243, 243, 243);
    box-shadow: 0 16px 20px -16px #d9d9d9;
    border-radius: 10px;
  }
  .head {
    width: 100%;
    background: #ffffff;
    box-shadow: 0 3px 11px -9px #d9d9d9;
    line-height: 4vh;
    height: 4vh;
    padding: 2px 16px;
    margin-top: 5px;
    color: #b5b5b5;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    .text-s {
      font-size: 12px;
    }

    .text-s:first-child {
      margin-left: 5px;
    }

    .total {
      display: flex;
      flex-wrap: wrap;
      max-width: 50vw;

      .num {
        word-break: break-all;
        font-size: 12px;
      }
    }
  }
</style>