<template>
  <div>
    <EchartsWarpper class="top-wrapper" ref="aaa"
                    :recordByTagTime.sync="recordByTagTime"
                    :monthTotal.sync="monthTotal"
                    :yearTotal.sync="yearTotal"
                    :showYear.sync="showYear"
                    :showMonth.sync="showMonth"
                    :type.sync="type"
                    :dayRecordList.sync="dayRecordList"
                    :monthRecordList.sync="dayRecordList"
    ></EchartsWarpper>
    <RecordList class="data-wrapper" v-if="recordByTagTime.length>0"
                :recordByTagTime.sync="recordByTagTime"
                :type.sync="type"
                :dayRecordList.sync="dayRecordList"
                :monthTotal.sync="monthTotal"
                :yearTotal.sync="yearTotal"
    ></RecordList>
    <div class="noResult" v-else-if="recordByTagTime.length===0">-{{interval === 'year' ? showYear+'年' :
      showMonth.slice(5)+'月'}}暂无{{showvalue}}-
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';
  import MoneyType from '@/components/MoneyType.vue';
  import Year from '@/components/Statistics/Year.vue';
  import Month from '@/components/Statistics/Month.vue';
  import Echarts from '@/components/Statistics/Echarts.vue';
  import createDateilId from '@/lib/createDateilId';
  import dayjs from 'dayjs';
  import RecordList from '@/components/Statistics/RecordList.vue';
  import EchartsWarpper from '@/components/Statistics/EchartsWarpper.vue';

  @Component({
    components: {EchartsWarpper, RecordList, Echarts, Month, Year, MoneyType}
  })
  export default class EchartsAndRecordList extends Vue {
    @Prop() dayRecordList!: DayResult[];
    @Prop() showvalue!: string;
    @Prop() type!: string;

    beforeCreate() {
      this.$store.commit('fetchRecords');
    }

    get interval() {
      return this.$store.state.interval;
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
      return dayjs(this.$store.state.chooseYear).format('YYYY');
    }

    get showMonth() {
      return dayjs(this.$store.state.chooseMonth).format('YYYY-M');
    }

    get monthTotal() {
      const total = this.monthRecordList.filter((item: MonthResult) => item.title === this.showMonth).reduce((sum: number, item: DayResult) => {return sum += item.total!;}, 0);
      return parseFloat(total.toFixed(2));
    }

    get yearTotal() {
      const total = this.yearRecordList.filter((item: YearResult) => item.title === this.showYear).reduce((sum: number, item: MonthResult) => {return sum += item.total!;}, 0);
      return parseFloat(total.toFixed(2));
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
      result.map(item=>{
        item.recordList.sort((a,b)=>{
          return a.num - b.num
        })
      })
      result.sort((a, b) => {
        return a.num - b.num;
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
      result.map(item=>{
        item.recordList.sort((a,b)=>{
          return a.num - b.num
        })
      })
      result.sort((a, b) => {
        return a.num - b.num;
      });
      return result;
    }


    get recordByTagTime() {


      return this.interval === 'year' ?
        this.recordByTagOnYear.filter(item => dayjs(item.title).format('YYYY') === this.showYear)
        : this.recordByTagOnMonth.filter(item => dayjs(item.title).format('YYYY-M') === this.showMonth);
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