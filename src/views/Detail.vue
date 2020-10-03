<template>
  <NavStyle>
    <template #header>
      <div @click="$store.state.showtype=!$store.state.showtype" class="nav-wrapper">
        <span>明细</span><span class="value">({{showvalue}}</span>
        <Icon name="up" v-if="$store.state.showtype"></Icon>
        <Icon name="down" v-else></Icon>
        )
      </div>
    </template>
    <template #main>
      <div v-if="$store.state.showtype" class="type-wrapper">
        <MoneyType class-prefix="detail" :data-source="detailList" :value.sync="type" :showvalue.sync="showvalue"/>
      </div>
      <div class="statisticsList">

        <div v-if="yearRecordList.length>0">

          <DetailList :yearRecordList.sync="yearRecordList" :type="type"></DetailList>

          <div class="head">
            <div class="totalN">
              <span class="text">(单位：元)</span>
            </div>
            <div class="totalN" v-if="type==='1'">
              <span class="text">总支出：</span>
              <span class="num">{{allTotal('支出')}}</span>
            </div>
            <div class="totalN" v-if="type==='1'">
              <span class="t">总收入：</span>
              <span class="num">{{allTotal('收入')}}</span>
            </div>
            <div class="totalN" v-if="type==='1'">
              <span class="text">总结余：</span>
              <span class="num">{{allTotal('总计')}}</span>
            </div>
            <div class="totalN" v-else>
              <span class="text">总合计：{{type==='-'?allTotal('支出'):allTotal('收入')}}</span>
            </div>
          </div>


        </div>
        <div class="noResult" v-else>- 暂无{{showvalue==='全部'?'记账':showvalue}}记录，去
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
  import dayjs from 'dayjs';
  import Button from '@/components/Button.vue';
  import Echarts from '@/components/Echarts.vue';
  import detail from '@/constants/detail';
  import DetailList from '@/components/Detail/DetailList.vue';

  @Component({
    components: {DetailList, Button, Echarts, MoneyType},
  })
  export default class Detail extends Vue {
    type = '1';
    detailList = detail;
    showvalue = '全部';

    beforeCreate() {
      this.$store.commit('fetchRecords');
    }


    get dayRecordList() {
      this.$store.commit('createdDayRecordList', {recordList: this.$store.state.recordList, type: this.type});
      return this.$store.state.dayRecordList;
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


    showType(item: RecordItem) {
      if (item.type === '+') {
        return item.type;
      } else {
        return '';
      }
    }


    beautifyDay(title: string) {
      return dayjs(title).format('DD');
    }

    beautifyMonth(title: string) {
      return dayjs(title).format('M');
    }

    allTotal(text: string) {
      const typeRecord1 = (this.$store.state.recordList as RecordItem[]).filter(item => {
        return item.type === '-';
      });
      const total1 = typeRecord1.reduce((sum, item) => {
        return sum + item.amount;
      }, 0);
      const typeRecord2 = (this.$store.state.recordList as RecordItem[]).filter(item => {
        return item.type === '+';
      });
      const total2 = typeRecord2.reduce((sum, item) => {
        return sum + item.amount;
      }, 0);
      if (text === '支出') {
        return total1;
      } else if (text === '收入') {
        return total2;
      } else if (text === '总计') {
        return total1 + total2;
      }
    }

    yearTotal(value: MonthResult, text: string) {
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

    dayTotal(value: MonthResult, text: string) {
      const typeRecord = (this.$store.state.recordList as RecordItem[]).filter(item => {
        return text === '支出' ?
          item.type === '-' && dayjs(item.createdAt).format('YYYY-M-DD') === value.title
          : item.type === '+' && dayjs(item.createdAt).format('YYYY-M-DD') === value.title;
      });
      return typeRecord.reduce((sum, item) => {
        return sum + item.amount;
      }, 0);
    }

    recordDetail(item: RecordItem) {
      this.$router.replace('/addmoney/' + item.id);
    }
  }
</script>

<style lang="scss" scoped>
  .nav-wrapper {
    display: flex;
    align-items: center;

    .value {
      margin: 0 3px 0 6px;
    }

    .icon {
      width: 11px;
      height: 12px;
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

  ::v-deep .detail-tabs {
    flex-direction: column;
    align-items: center;
    background: #fff;

    .tabs-type {
      width: 100%;
    }
  }


  .statisticsList {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;


    .noResult {
      padding: 16px;
      text-align: center;
      color: #999;

      .add {
        color: blue;

      }
    }
  }

  .head {
    line-height: 4vh;
    padding: 5px 10px;
    color: #b5b5b5;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;


    .totalN {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      font-size: 12px;

      .num {
        word-break: break-all;
      }
    }
  }

</style>
