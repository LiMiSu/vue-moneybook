<template>
  <div @click="date.show=!date.show" class="title-wrapper">
    <div :class="{[dateSting+'-title']:dateSting}">
      <span :class="dateSting">{{titleString}}<span class="text">{{textString}}</span></span>
      <div class="list" v-if="type==='1'"><span class="text">支出：</span><span
        class="num">{{doSom(date,'支出')}}</span></div>
      <div class="list" v-if="type==='1'"><span class="text">收入：</span><span
        class="num">{{doSom(date,'收入')}}</span></div>
      <div class="list"><span class="text" v-if="type==='1'">结余：</span><span class="text" v-else>合计：</span><span
        class="num">{{date.total}}</span></div>
    </div>
    <Icon name="xia" v-if="date.show"></Icon>
    <Icon name="shang" v-else></Icon>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';
  import dayjs from 'dayjs';

  @Component
  export default class DetailItem extends Vue {
    @Prop() readonly date!: YearResult | DayResult | MonthResult;
    @Prop() readonly type!: string;

    beforeCreate() {
      this.$store.commit('fetchRecords');
    }


    get textString() {
      if (this.date.string === 'year') {
        return '年';
      } else if (this.date.string === 'month') {
        return '月';
      } else if (this.date.string === 'day') {
        return '日';
      } else {
        return '';
      }
    }

    get dateSting() {
      if (this.date.string === 'year') {
        return 'year';
      } else if (this.date.string === 'month') {
        return 'month';
      } else if (this.date.string === 'day') {
        return 'day';
      } else {
        return '';
      }
    }

    get titleString() {
      if (this.date.string === 'year') {
        return this.date.title;
      } else if (this.date.string === 'month') {
        return this.beautifyMonth(this.date.title);
      } else if (this.date.string === 'day') {
        return this.beautifyDay(this.date.title);
      } else {
        return '';
      }
    }

    doSom(value: any, text: string) {
      if (this.date.string === 'year') {
        return this.yearTotal(value, text);
      } else if (this.date.string === 'month') {
        return this.monthTotal(value, text);
      } else if (this.date.string === 'day') {
        return this.dayTotal(value, text);
      } else {
        return;
      }
    }

    yearTotal(value: YearResult, text: string) {
      const typeRecord = (this.$store.state.recordList as RecordItem[]).filter(item => {
        return text === '支出' ?
          item.type === '-' && dayjs(item.createdAt).format('YYYY') === value.title
          : item.type === '+' && dayjs(item.createdAt).format('YYYY') === value.title;
      });
      return typeRecord.reduce((sum, item) => {
        return sum + item.amount;
      }, 0);
    }

    monthTotal(value: MonthResult, text: string) {
      const typeRecord = (this.$store.state.recordList as RecordItem[]).filter(item => {
        return text === '支出' ?
          item.type === '-' && dayjs(item.createdAt).format('YYYY-M') === value.title
          : item.type === '+' && dayjs(item.createdAt).format('YYYY-M') === value.title;
      });
      return typeRecord.reduce((sum, item) => {
        return sum + item.amount;
      }, 0);
    }

    dayTotal(value: DayResult, text: string) {
      const typeRecord = (this.$store.state.recordList as RecordItem[]).filter(item => {
        return text === '支出' ?
          item.type === '-' && dayjs(item.createdAt).format('YYYY-M-DD') === value.title
          : item.type === '+' && dayjs(item.createdAt).format('YYYY-M-DD') === value.title;
      });
      return typeRecord.reduce((sum, item) => {
        return sum + item.amount;
      }, 0);
    }

    beautifyDay(title: string) {
      return dayjs(title).format('DD');
    }

    beautifyMonth(title: string) {
      return dayjs(title).format('M');
    }


  }
</script>

<style lang="scss" scoped>
  %title {
    width: 100%;
    min-height: 16px;
    display: flex;
    align-items: center;
    padding: 3px;
    font-size: 14px;
  }

  .title-wrapper {
    width: 98vw;
    background: rgb(243, 243, 243);
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 10vh;
    padding-right: 16px;
    box-shadow: 0 3px 11px -9px #999;
    margin: 5px 0;


    .year-title, .month-title, .day-title {
      @extend %title;
      flex: 1;
      justify-content: space-between;


      .year, .month, .day {
        min-width: 25vw;
        text-align: center;
        font-size: 22px;
        border-right: 1px solid #b5b5b5;

        .text {
          font-size: 16px;
          margin-left: 2px;
        }
      }

      .day {
        font-size: 16px;

        .text {
          font-size: 14px;
        }
      }

      .list {
        display: flex;
        flex-wrap: wrap;
        margin-left: 10px;
        color: #999;
        font-size: 12px;

        .text {
          margin-left: 2px;
        }

        .num {
          word-break: break-all;
        }
      }
    }

    .icon {
      color: #999999;
    }
  }

  .title-wrapper:first-child {
    margin-top: 0;
  }

  .month-title {
    @extend %title;
    justify-content: center;
  }

  .day-title {
    @extend %title;
    justify-content: space-between;

  }
</style>