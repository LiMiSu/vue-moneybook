<template>
  <NavStyle>
    <template #header>
      <div @click="$store.state.showtype=!$store.state.showtype" class="nav">
        <span>统计</span><span class="value">({{showvalue}}</span>
        <Icon name="up" v-if="$store.state.showtype"></Icon>
        <Icon name="down" v-else></Icon>
        )
      </div>
    </template>
    <template #main>
      <div v-if="$store.state.showtype" class="type-wrapper">
        <MoneyType class-prefix="statistics-nav" :data-source="typeList" :value.sync="type"
                   :showvalue.sync="showvalue"/>
      </div>
      <div class="echarts-wrapper">
        <div class="echarts" v-if="dayRecordList.length>0">
          <MoneyType class-prefix="statistics" :data-source="intervalList" :value.sync="interval"/>
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
          <Echarts :option="lineOption" v-if="showLine"/>
          <Echarts :option="circleOption" :getText="getText" v-else/>


          <div class="data-wrapper" v-if="recordByTagTime.length>0">


            <div class="lineData" v-if="showLine">
              <div>{{interval === 'year' ? showYear : showMonth}}(本位币：CNY)</div>
              <div><span>总计</span><span>{{interval === 'year' ? yearTotal : monthTotal}}</span></div>
              <div v-for="record in recordByTagTime" :key="record.name">
                <div>
                  <Icon :name="record.icon"></Icon>
                  <span>{{record.name}}</span><span>{{recordByTagTotalPercent(record.num)}}</span><span>{{record.num}}</span>
                </div>
              </div>
            </div>

            <div class="circleData" v-else>
              <div class="result" v-for="result in RecordSameTagListResult" :key="result.name" >
                <div class="result-show" v-if="result.name===text">
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

          </div>
          <div class="noResult" v-else>-{{interval === 'year' ? showYear+'年' :
            showMonth.slice(5)+'月'}}暂无{{showvalue}}-
          </div>

        </div>
        <div class="noResult" v-else>- 暂无{{showvalue}}记录，去
          <router-link to="/addmoney"><span class="add">记一笔</span></router-link>
          吧~ -
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
  import Year from '@/components/Statistics/Year.vue';
  import Month from '@/components/Statistics/Month.vue';

  @Component({
    components: {Month, Year, Button, Echarts, MoneyType},
  })
  export default class Statistics extends Vue {
    type = '';
    showvalue = '';
    interval = 'month';
    intervalList = intervalList;
    typeList = typeList;
    text = '';
    chooseYear = this.$store.state.record.createdAt;
    chooseMonth = this.$store.state.record.createdAt;
    showLine = false;

    beforeCreate() {
      this.$store.commit('fetchRecords');
    }

    created() {
      this.initType(this.$store.state.recordList);
    }

    initType(data: RecordItem[]) {
      if (data[0] && data[0].type) {
        this.type = data[0].type;
        this.showvalue = this.type === '-' ? '支出' : '收入';
      } else {
        this.type = '-';
        this.showvalue = '支出';
      }
    }

    get recordList() {
      return this.$store.state.recordList;
    }

    get dayRecordList() {
      this.$store.commit('createdDayRecordList', {recordList: this.recordList, type: this.type});
      return (this.$store.state.dayRecordList as DayResult[]).filter(item => item.items[0].type === this.type);
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


    //线形
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

    get recordByTag() {

      const result: RecordByTag[] = [];
      this.dayRecordList.map(item => {

        for (let i = 0; i < item.items.length; i++) {

          const current = {
            title: item.title,
            icon: item.items[i].tag.tagicon,
            name: item.items[i].tag.name,
            num: item.items[i].amount
          };
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

    get recordByTagTime() {
      return this.interval === 'year' ?
        this.recordByTag.filter(item => dayjs(item.title).format('YYYY') === this.showYear)
        : this.recordByTag.filter(item => dayjs(item.title).format('YYYY-M') === this.showMonth);
    }

    recordByTagTotalPercent(value: number) {
      return this.interval === 'year' ?
        parseFloat((Math.abs(value) / this.yearTotal * 100).toFixed(2)) + '%'
        : parseFloat((Math.abs(value) / this.monthTotal * 100).toFixed(2)) + '%';
    }

    get keyValueListOfMonth() {
      const today = this.chooseMonth;
      const monthLength = dayjs(today).daysInMonth();
      const array = [];
      for (let i = 1; i <= monthLength; i++) {
        const date = dayjs(today).date(i).format('YYYY-M-D');
        const found = (this.dayRecordList as DayResult[]).filter(item => dayjs(item.title).format('YYYY-M-D') === date);
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
              return interval === 'year' ? value.substr(5) : value.substr(8);
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
            const time = interval === 'year' ? dayjs(value[0].name).format('M') + '月' : dayjs(value[0].name).format('D') + '日';
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

    get circleOption() {
      const tag = this.recordByTag.map(item => item.name);
      const record = this.recordByTag.map(item => {
        return {value: Math.abs(item.num), name: item.name};
      });
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          alwaysShowContent: true,
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          left: 10,
          data: tag,
          top: 'middle',
          // selectedMode: true
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


  }
</script>

<style lang="scss" scoped>
  .nav {
    display: flex;
    align-items: center;

    .value {
      margin: 0 3px 0 6px;
    }

    .icon {
      width: 11px;
      height: 12px;
      /*font-size: 16px;*/
    }
  }

  .type-wrapper {
    position: absolute;
    top: 6vh;
    left: 0;
    width: 100%;
    height: 94vh;
    background: rgba(205, 205, 205, 0.5);
  }

  ::v-deep .statistics-nav-tabs {
    flex-direction: column;
    align-items: center;
    background: #fff;

    .tabs-type {
      width: 100%;
    }
  }

  .nav-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 16px 16px 0 16px;

    .around {
      width: 50px;
      height: 100%;
    }

    .iconlist {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid red;

      .icon {
        width: 30px;
        height: 30px;
      }
    }

    /*::v-deep .statistics-tabs {*/
    /*  width: 40%;*/
    /*}*/
  }

  .echarts-wrapper {
    /*overflow: auto;*/
    /*height: 70vh;*/
  }

  .noResult {
    padding: 16px;
    text-align: center;
    color: #999;

    .add {
      color: blue;
    }
  }

  .echarts {
    width: 100%;
    height: 30vh;
  }


</style>