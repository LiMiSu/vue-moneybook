<template>
  <NavStyle>
    <template #header>
      统计
    </template>
    <template #main>
      <div>
        <MoneyType class-prefix="type" :data-source="typeList" :value.sync="type"/>
        <!--      <MoneyType class-prefix="interval" :data-source="intervalList" :value.sync="interval"/>-->
      </div>
      <div class="echarts-wrapper">
        <div class="echarts" v-if="dayRecordList.length>0">
          <!--          <Echarts :option="columnOption"/>-->
          <Echarts :option="circleOption" :getText="getText"/>
        </div>
        <div class="noResult" v-else>目前没有相关记录</div>
      </div>
      <div class="data-wrapper">
        <!--        <div v-for="record in recordByTag" :key="record.name">-->
        <!--          <Icon :name="record.icon"></Icon>-->
        <!--          <span>{{record.name}}</span><span>{{recordByTagTotalPercent(record.num)}}</span><span>{{record.num}}</span>-->
        <!--        </div>-->
        <div v-for="result in RecordSameTagListResult" :key="result.name">
          <div v-if="result.name===text">
            <div>
              <Icon :name="result.icon"></Icon>
              <span>{{result.name}}</span><span>{{recordByTagTotalPercent(result.total)}}</span><span>{{result.total}}</span>
            </div>
            <div v-for="item in result.recordList" :key="item.num">
              {{item.name}}{{item.num}}
            </div>
          </div>
        </div>
      </div>
    </template>
  </NavStyle>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import MoneyType from '@/components/MoneyType.vue';
  import typeList from '@/constants/typeList';
  import Button from '@/components/Button.vue';
  import Echarts from '@/components/Echarts.vue';
  import intervalList from '@/constants/intervalList';
  import dayjs from 'dayjs';
  import echarts from 'echarts';

  @Component({
    components: {Button, Echarts, MoneyType},
  })
  export default class Statistics extends Vue {
    type = '-';
    interval = 'day';
    intervalList = intervalList;
    typeList = typeList;
    text='';

    beforeCreate() {
      this.$store.commit('fetchRecords');
    }

    get recordList() {
      return this.$store.state.recordList;
    }

    get dayRecordList() {
      this.$store.commit('createdDayRecordList', {recordList: this.recordList, type: this.type});
      return (this.$store.state.dayRecordList as DayResult[]).filter(item => item.items[0].type === this.type);//解决一条账单时不分支收问题
    }

    get recordByTag() {

      const result: RecordByTag[] = [];
      this.dayRecordList.map(item => {
        for (let i = 0; i < item.items.length; i++) {
          const current = {icon: item.items[i].tag.tagicon, name: item.items[i].tag.name, num: item.items[i].amount};
          result.push(current);
        }
        for (let i = 0; i < result.length; i++) {
          for (let f = i + 1; f < result.length; f++) {
            if (result[f].name === result[i].name) {
              result[i].num += result[f].num;
              result.splice(f, 1);
              f--;
            }
          }
        }
      });
      return result;
    }

    get RecordSameTagListResult() {
      const result: RecordSameTagListResult[] = [];
      this.dayRecordList.map(item => {
        for (let i = 0; i < item.items.length; i++) {
          const current: RecordSameTagListResult = {
            total: item.items[i].amount,
            icon: item.items[i].tag.tagicon,
            name: item.items[i].tag.name,
            recordList: [{name: item.items[i].tag.name, num: item.items[i].amount}]
          };
          result.push(current);
          for (let i = 0; i < result.length; i++) {
            for (let f = i + 1; f < result.length; f++) {
              if (result[f].name === result[i].name) {
                result[i].recordList.push(result[f].recordList[0]);
                result[i].total += result[f].recordList[0].num;
                result.splice(f, 1);
                f--;
              }
            }
          }
        }
      });
      return result;
    }

    get recordByTagTotal() {
      return this.recordByTag.reduce((sum, item) => {
        return sum + Math.abs(item.num);
      }, 0);
    }

    recordByTagTotalPercent(value: number) {
      return parseFloat((Math.abs(value) / this.recordByTagTotal * 100).toFixed(2)) + '%';
    }

    get keyValueList() {
      const today = this.$store.state.record.createdAt;
      const monthLength = dayjs(today).daysInMonth();
      const array = [];
      for (let i = 1; i <= monthLength; i++) {
        const date = dayjs(today).date(i).format('YYYY-MM-DD');
        const found = (this.dayRecordList as DayResult[]).filter(item => dayjs(item.title).format('YYYY-MM-DD') === date);
        let value = found.reduce((sum, item) => {
          return sum + item.total!;
        }, 0);
        value = value < 0 ? -value : value;
        array.push({date: date, value: value ? value : 0});
      }
      array.sort((a, b) => {
        if (a.date > b.date) {
          return 1;
        } else if (a.date === b.date) {
          return 0;
        } else {
          return -1;
        }
      });
      return array;
    }

    get circleOption() {
      const tag = this.recordByTag.map(item => item.name);
      const record = this.recordByTag.map(item => {
        return {value: Math.abs(item.num), name: item.name};
      });
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: tag
        },
        series: [
          {
            name: this.type === '-' ? '支出金额' : '收入金额',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
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
            data: record
          }
        ]
      };
    }
    getText(value: string) {
      this.text = value;
    }
    get columnOption() {
      const keys = this.keyValueList.map(item => item.date);
      const values = this.keyValueList.map(item => item.value);
      return {
        grid: {
          left: '12%',
          right: '6%'
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            animation: true
          }
        },
        itemStyle: {
          color: 'red'
        },
        xAxis: {
          type: 'category',
          data: keys,
          axisLabel: {
            formatter: function (value: string, index: number) {
              return value.substr(8);
            },
            color: '#ccc',
            fontSize: 10
          },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          },
          axisPointer: {
            label: {
              show: true
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: function (value: string, index: number) {
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
            color: '#ccc',
            fontSize: 10,
            width: '40%',
          },
          axisLine: {
            lineStyle: {
              color: '#ccc',
            }
          },
          axisTick: {
            show: false
          }
        },
        series: [{
          data: values,
          type: 'bar'
        }]
      };
    }
  }
</script>

<style lang="scss" scoped>
  .echarts-wrapper {
    overflow: auto;
  }

  .noResult {
    padding: 16px;
    text-align: center;
    color: #999;
  }

  .echarts {
    width: 100%;
    height: 50vh;
  }


</style>