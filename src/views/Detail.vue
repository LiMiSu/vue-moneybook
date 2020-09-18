<template>
  <NavStyle>
    <template #header>
      明细
    </template>
    <template #main>
      <MoneyType @click.native="a" class-prefix="type" :data-source="detailList" :value.sync="type"/>
      <div class="statisticsList">
        <div v-if="yearRecordList.length>0">
          <h1 v-if="yearRecordList.length>=2" class="total">{{allTotal}}</h1>
          <div v-for="year in yearRecordList" :key="year.title">
            <h2 @click="year.show=!year.show" class="year-title">
              <span>{{year.title}}</span>
              <span v-if="type==='1'">+</span>
              <span v-if="type==='1'">-</span>
              <span>{{type==='+'?type:''}}{{year.total}}</span>
            </h2>
            <div v-if="year.show">
              <div v-for="month in year.items" :key="month.title">
                <h3 @click="month.show=!month.show" class="month-title">
                  <span>{{beautifyMonth(month.title)}}</span>
                  <span v-if="type==='1'">+</span>
                  <span v-if="type==='1'">-</span>
                  <span>{{type==='+'?type:''}}{{month.total}}</span>
                </h3>
                <div v-if="month.show">
                  <div v-for="day in month.items" :key="day.title">
                    <div class="day-title" @click="day.show=!day.show">
                      <span>{{beautifyDay(day.title)}}</span>
                      <span v-if="type==='1'">+</span>
                      <span v-if="type==='1'">-</span>
                      <span>{{type==='+'?type:''}}{{day.total}}</span>
                    </div>
                    <div v-if="day.show">
                      <div v-for="(item,index) in day.items" :key="index"
                           class="record">
                        <div class="left">
                          <Icon :name="item.tag.tagicon"></Icon>
                          <span class="name">{{item.tag.name}}</span>
                        </div>
                        <span class="notes">{{item.notes}}</span>
                        <span class="amount">{{showType(item)}}{{item.amount}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="noResult" v-else>目前没有相关记录</div>
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

  @Component({
    components: {Button, Echarts, MoneyType},
  })
  export default class Detail extends Vue {
    type = '-';
    detailList = detail;
    amount = 0;

    beforeCreate() {
      this.$store.commit('fetchRecords');
    }

    a() {
      console.log(1);
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

    get allTotal() {
      const total = (this.yearRecordList as YearResult[]).reduce((sum, group) => {
        return sum + group.total!;
      }, 0);
      return this.yearRecordList.length >= 2 ? this.type + total : '';
    }


    showType(item: RecordItem) {
      if (item.type==='+') {
        this.amount = item.amount;
        return item.type;
      } else {
        return '';
      }
    }


    beautifyDay(title: string) {
      const dayValue = dayjs(title);
      const now = dayjs();
      if (dayValue.isSame(now, 'day')) {
        return '今天';
      } else if (dayValue.isSame(now.subtract(1, 'day'), 'day')) {
        return '昨天';
      } else if (dayValue.isSame(now.subtract(2, 'day'), 'day')) {
        return '前天';
      } else {
        return dayValue.format('D / M');
      }
    }

    beautifyMonth(title: string) {
      return dayjs(title).format('M月');
    }
  }
</script>

<style lang="scss" scoped>
  %title {
    width: 100%;
    min-height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
  }

  .year-title {
    @extend %title;
    background: #DE7873;
  }

  .month-title {
    @extend %title;
    background: goldenrod;
  }

  .day-title {
    @extend %title;
    background: lightgreen;
  }

  %item {
    padding: 0 10px;
    min-height: 40px;
    display: flex;
    justify-content: space-between;
    /*align-items: center;*/
  }

  .statisticsList {
    overflow-y: auto;

    .day-title {
      @extend %item;
    }

    .total {
      @extend %title;
      background: darkviolet;
    }

    .record {
      @extend %item;
      background: white;
      padding-top: 10px;
      border-bottom: 1px solid rgb(224, 224, 224);

      .left {
        display: flex;
        /*align-items: center;*/
        max-width: 105px;

        .icon {
          width: 24px;
          height: 24px;
          margin-right: 5px;
          margin-bottom: 5px;
        }
      }

      .notes {
        flex: 1;
        margin: 0 16px;
        color: #999;
        font-size: 12px;
      }

      .amount {
        color: #999;
        /*font-size: 14px;*/
      }
    }

    .noResult {
      padding: 16px;
      text-align: center;
    }
  }


</style>
