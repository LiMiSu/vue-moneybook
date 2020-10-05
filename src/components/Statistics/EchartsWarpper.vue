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
        <Icon name="yuan" v-if="$store.state.showLineEcharts" @click="$store.state.showLineEcharts=!$store.state.showLineEcharts"></Icon>
        <Icon name="line" v-else @click="$store.state.showLineEcharts=!$store.state.showLineEcharts"></Icon>
      </div>
    </div>
    <div v-if="recordByTagTime.length>0" class="echarts-item">
      <Echarts :option="lineOption" v-if="$store.state.showLineEcharts"/>
      <Echarts :option="circleOption" v-else/>
    </div>
    <div v-if="recordByTagTime.length>0" class="head">
      <div>{{interval === 'year' ? showYear : showMonth}}<span class="text-s">(单位：元)</span></div>
      <div class="total" v-if="$store.state.showLineEcharts"><span class="text-s">总计：</span><span class="num">{{interval === 'year' ? yearTotal : monthTotal}}</span>
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
  import echartsCircleOption from '@/constants/echartsCircleOption';
  import echartsLineOptionOption from '@/constants/echartslineOptionOption';
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
      return echartsLineOptionOption(monthKeys,monthValues,yearKeys,yearValues,interval,type)
    }

    get circleOption() {
      const monthTag = this.recordByTagTime.map(item => item.name);
      const monthRecord = this.recordByTagTime.map(item => {
        return {value: Math.abs(item.num), name: item.name};
      });
      return echartsCircleOption(monthTag, monthRecord,this.type)
    }



  }
</script>

<style lang="scss" scoped>
  .s-type {
    width: 40%;
    margin-top: 2px;
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
</style>