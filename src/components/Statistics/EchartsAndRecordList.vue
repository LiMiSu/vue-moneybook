<template>
  <div>
    <div class="top-wrapper">
      <MoneyType class="s-type" class-prefix="statistics" :data-source="intervalList" :value.sync="interval"/>
      <div class="nav-wrapper">
        <div class="around"></div>
        <div>
          <Year :chooseDate.sync="chooseYear" v-if="interval==='year'"></Year>
          <Month :chooseMonth.sync="chooseMonth" v-if="interval==='month'"></Month>
        </div>
        <div class="iconlist around">
          <Icon name="yuan" v-if="showLine" @click="showLine=!showLine"></Icon>
          <Icon name="line" v-else @click="showLine=!showLine"></Icon>

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
    <div class="data-wrapper" v-if="recordByTagTime.length>0">
      <div class="lineData list-wrapper" v-if="showLine">
        <div v-for="record in recordByTagTime" :key="record.id">
          <div class="list">
            <div class="left">
              <div class="iconWarpper">
                <Icon :name="record.icon"></Icon>
              </div>
              <div class="name">{{record.name}}</div>
            </div>
            <span class="amount">{{recordByTagTotalPercent(record.num)}}</span>
            <span class="amount">{{record.num}}</span>
          </div>
        </div>
      </div>
      <div class="circleData list-wrapper" v-else>
        <div v-for="result in recordByTagTime" :key="result.name">
          <div class="result-show" v-if="result.name===initShowTag">
            <div class="list">
              <div class="left">
                <div class="iconWarpper">
                  <Icon :name="result.icon"></Icon>
                </div>
                <div class="name">{{result.name}}</div>
              </div>
              <span class="amount">{{recordByTagTotalPercent(result.num)}}</span>
              <span class="amount">{{result.num}}</span>
            </div>
            <div class="list detail" v-for="item in result.recordList" :key="item.id">
              <div class="item">{{item.date}}</div>
              <div class="item">{{item.name}}</div>
              <div class="item">{{item.num}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="noResult" v-else-if="recordByTagTime.length===0">-{{interval === 'year' ? showYear+'年' :
      showMonth.slice(5)+'月'}}暂无{{showvalue}}-
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';
  import intervalList from '@/constants/intervalList';
  import MoneyType from '@/components/MoneyType.vue';
  import Year from '@/components/Statistics/Year.vue';
  import Month from '@/components/Statistics/Month.vue';
  import Echarts from '@/components/Statistics/Echarts.vue';
  import createDateilId from '@/lib/createDateilId';
  import dayjs from 'dayjs';
  @Component({
    components: {Echarts, Month, Year, MoneyType}
  })
  export default class EchartsAndRecordList extends Vue {
    @Prop() dayRecordList!: DayResult[];
    @Prop() showvalue!: string;
    @Prop() type!: string;
    intervalList=intervalList
    interval = 'month';
    initShowTag = '';
    showLine = true;
    chooseYear = this.$store.state.record.createdAt;
    chooseMonth = this.$store.state.record.createdAt;


    beforeCreate() {
      this.$store.commit('fetchRecords');
    }

    get monthRecordList() {
      this.$store.commit('createdMonthRecordList', {dayRecordList: this.dayRecordList, type: this.type});
      return this.$store.state.monthRecordList;
    }

    get yearRecordList() {
      this.$store.commit('createdYearRecordList', {monthRecordList: this.monthRecordList, type: this.type});
      if (this.type === '1') {
        return this.$store.state.yearRecordList;
      }
      return this.$store.state.yearRecordList.filter((item: YearResult) => item.items[0].items[0].items[0].type === this.type);
    }

    get showYear() {
      return dayjs(this.chooseYear).format('YYYY');

    }

    get showMonth() {
      return dayjs(this.chooseMonth).format('YYYY-M');
    }

    get monthTotal() {
      return this.monthRecordList.filter((item: MonthResult) => item.title === this.showMonth).reduce((sum: number, item: DayResult) => {return sum += item.total!;}, 0);
    }

    get yearTotal() {
      return this.yearRecordList.filter((item: YearResult) => item.title === this.showYear).reduce((sum: number, item: MonthResult) => {return sum += item.total!;}, 0);
    }


    get recordByTagOnMonth() {
      const result: RecordByTag[] = [];
      this.dayRecordList.map(item => {

        for (let i = 0; i < item.items.length; i++) {
          const id = createDateilId().toString();
          const current = {
            id,
            title: dayjs(item.title).format('YYYY-M'),
            icon: item.items[i].tag.tagicon,
            name: item.items[i].tag.name,
            num: item.items[i].amount,
            recordList: [{
              id,
              date: dayjs(item.items[i].createdAt).format('DD日'),
              name: item.items[i].tag.name,
              num: item.items[i].amount
            }]
          };
          result.push(current);
        }
        for (let i = 0; i < result.length; i++) {
          for (let f = i + 1; f < result.length; f++) {
            if (result[f].name === result[i].name && result[f].title === result[i].title) {
              result[i].recordList.push(result[f].recordList[0]);
              result[i].num += result[f].num;
              result.splice(f, 1);
              f--;
            }
          }
        }
      });

      return result;
    }

    get recordByTagOnYear() {
      const result: RecordByTag[] = [];
      this.dayRecordList.map(item => {

        for (let i = 0; i < item.items.length; i++) {
          const id = createDateilId().toString();
          const current = {
            id,
            title: dayjs(item.title).format('YYYY'),
            icon: item.items[i].tag.tagicon,
            name: item.items[i].tag.name,
            num: item.items[i].amount,
            recordList: [{
              id,
              date: dayjs(item.items[i].createdAt).format('M月DD日'),
              name: item.items[i].tag.name,
              num: item.items[i].amount
            }]
          };
          result.push(current);
        }
        for (let i = 0; i < result.length; i++) {
          for (let f = i + 1; f < result.length; f++) {
            if (result[f].name === result[i].name && result[f].title === result[i].title) {
              result[i].recordList.push(result[f].recordList[0]);
              result[i].num += result[f].num;
              result.splice(f, 1);
              f--;
            }
          }
        }
      });

      return result;
    }

    get recordByTagTime() {
      return this.interval === 'year' ?
        this.recordByTagOnYear.filter(item => dayjs(item.title).format('YYYY') === this.showYear)
        : this.recordByTagOnMonth.filter(item => dayjs(item.title).format('YYYY-M') === this.showMonth);
    }
    recordByTagTotalPercent(value: number) {
      return this.interval === 'year' ?
        parseFloat(Math.abs(value / this.yearTotal * 100).toFixed(2)) + '%'
        : parseFloat(Math.abs(value / this.monthTotal * 100).toFixed(2)) + '%';
    }

    get keyValueListOfMonth() {
      const today = this.chooseMonth;
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
      const today = this.chooseYear;
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


    //饼状


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
      this.initShowTag = value;
    }



  }
</script>

<style lang="scss" scoped>
  .top-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 3px 11px -9px #d9d9d9;
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
  }

  .data-wrapper{

    .lineData {

      .list {
        padding: 16px;
        display: flex;
        justify-content: space-between;

        .left {
          display: flex;
          max-width: 105px;

          .iconWarpper {
            display: flex;
            justify-content: center;
            align-items: center;
            background: #DE7873;
            color: white;
            margin-right: 5px;
            border-radius: 10px;
            width: 30px;
            height: 30px;

            .icon {
              width: 20px;
              height: 20px;
            }
          }

          .name {
            display: flex;
            justify-content: center;
            align-items: center;
            padding-left: 5px;
          }

        }
      }
    }
    .circleData {
      .head {
        height: 4vh;
        line-height: 4vh;
        padding: 2px 16px;
        color: #b5b5b5;
      }

      .list {
        display: flex;
        justify-content: space-between;
        padding: 16px;

        .left {
          display: flex;
          max-width: 105px;

          .iconWarpper {
            display: flex;
            justify-content: center;
            align-items: center;
            background: #DE7873;
            color: white;
            margin-right: 5px;
            border-radius: 10px;
            width: 30px;
            height: 30px;

            .icon {
              width: 20px;
              height: 20px;
            }
          }

          .name {
            display: flex;
            justify-content: center;
            align-items: center;
            padding-left: 5px;
          }

        }
      }

      .detail {
        .item {
          width: 33.33%;
        }

        .item:nth-child(2) {
          text-align: center;
        }

        .item:last-child {
          text-align: end;
          word-break: break-all
        }
      }
    }
  }
  .noResult {
    padding: 16px;
    text-align: center;
    color: #999;
  }




  .data-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;

    .list-wrapper {
      display: flex;
      flex-direction: column;
    }
  }
</style>