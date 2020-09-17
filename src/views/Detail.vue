<template>
  <NavStyle>
    <template #header>
      明细
    </template>
    <template #main>


      <MoneyType class-prefix="type" :data-source="typeList" :value.sync="type"/>
      <!--      <MoneyType class-prefix="interval" :data-source="intervalList" :value.sync="interval"/>-->
      <div class="statisticsList">
        <div v-if="yearRecordList.length>0">
          <div v-for="year in yearRecordList" :key="year.title">
            <h2 class="year-title"><span>{{year.title}}</span><span>支出: </span><span>支出：</span><span>合计：￥{{year.total}}</span>
            </h2>
            <div v-for="month in year.items" :key="month.title">
              <h3 class="month-title"><span>{{month.title}}</span><span>支出: </span><span>支出：</span><span>合计：￥{{month.total}}</span>
              </h3>
              <div v-for="day in month.items" :key="day.title">
                <h3 class="day-title" @click="showList(day.title)">{{beautify(day.title)}}<span>￥{{day.total}}</span>
                </h3>
                <!--                <div v-if="currentList!==day.title">-->
                <div v-for="(item,index) in day.items" :key="index"
                     class="record">
                  <span>{{item.tag.name}}</span>
                  <span class="notes">{{item.notes}}</span>
                  <span>￥{{item.amount}}</span>
                </div>
                <!--                </div>-->
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
  import typeList from '@/constants/typeList';
  import dayjs from 'dayjs';
  import Button from '@/components/Button.vue';
  import Echarts from '@/components/Echarts.vue';
  import intervalList from '@/constants/intervalList';

  @Component({
    components: {Button, Echarts, MoneyType},
  })
  export default class Detail extends Vue {
    type = '+';
    interval = 'day';
    intervalList = intervalList;
    typeList = typeList;
    currentList = '';

    beforeCreate() {
      this.$store.commit('fetchRecords');

    }

    showList(title: string) {
      if (this.currentList === title) {
        this.currentList = '';
      } else {
        this.currentList = title;
      }
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
      return this.$store.state.yearRecordList;
    }


    beautify(title: string) {
      const dayValue = dayjs(title);
      const now = dayjs();
      if (dayValue.isSame(now, 'day')) {
        return '今天';
      } else if (dayValue.isSame(now.subtract(1, 'day'), 'day')) {
        return '昨天';
      } else if (dayValue.isSame(now.subtract(2, 'day'), 'day')) {
        return '前天';
      } else if (dayValue.isSame(now, 'year')) {
        return dayValue.format('M月D日');
      } else {
        return dayValue.format('YYYY年M月D日');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .year-title, .month-title {
    width: 100%;
    min-height: 30px;
    display: flex;
    justify-content: space-between;
  }

  %item {
    padding: 0 16px;
    min-height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .statisticsList {
    overflow-y: auto;

    .day-title {
      @extend %item;
    }

    .record {
      @extend %item;
      background: white;

      .notes {
        margin-right: auto;
        margin-left: 16px;
        color: #999;
      }
    }

    .noResult {
      padding: 16px;
      text-align: center;
    }
  }


</style>
