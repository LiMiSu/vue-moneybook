<template>
  <div class="date-body" :class="{[classPrefix+'-datebody']:classPrefix}">
    <div class="date-nav">
      <Icon name="yearleft" class="date-btn icon-left-nav" @click="onChangYear('last')"></Icon>
      <Icon name="monthleft" class="date-btn icon-zuo" @click="onChangMonth('last')"></Icon>
      <span @click="today">{{showData.year}}年{{showData.month+1}}月{{showData.day}}日</span>
      <Icon name="monthright" class="date-btn icon-you" @click="onChangMonth('next')"></Icon>
      <Icon name="yearrigth" class="date-btn icon-right-nav" @click="onChangYear('next')"></Icon>
      <div class="ontoday" :class="{[classPrefix+'-ontoday']:classPrefix}" @click="today"><span>今天</span></div>
    </div>

    <table class="data-list">
      <tr class="date-weeks">
        <th v-for="week in weekDay" :key="week"
        >
          {{week}}
        </th>
      </tr>
      <tr class="date-days">
        <td
          v-for="day in showDays"
          :key="day.getTime()"
          :class="{'is-have': isHaveRecordDay(day),
                'other-month': !isThisMonthDay(day),
                'is-select': isSelectDay(day),
                'is-today': isToday(day)}"
          @click="onSelectDay(day)"
        >
          <div class="day-day">{{day.getDate()}}</div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';
  import dayjs from 'dayjs';

  @Component
  export default class Days extends Vue {
    @Prop(String)
    classPrefix?: string;
    weekDay = ['日', '一', '二', '三', '四', '五', '六'];
    showData = { //初始值？
      year: 0,
      month: 0,
      day: 0
    };

    beforeCreate() {
      this.$store.commit('fetchRecords');
    }

    get recordList() {
      return this.$store.state.recordList;
    }

    isHaveRecordDay(day: string) {
      const result = (this.recordList as RecordItem[]).filter(item => {
        return dayjs(item.createdAt).isSame(dayjs(day), 'day');
      });
      return result.length > 0 ? dayjs(result[0].createdAt).isSame(dayjs(day), 'day') : false;
    }


    today() {
      this.onSelectDay((dayjs(new Date()).add(-8 * 3600 * 1000, 'millisecond') as any).$d);
      this.getShowDate(new Date());
    }

    getYearMonthDay(date: Date) {  //获取时间函数，时间初始化函数，拿到具体天
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      return {
        year,
        month,
        day
      };
    }

    getShowDate(date: Date) { //拿到今天是哪天
      const {year, month, day} = this.getYearMonthDay(date);
      this.showData = {
        year,
        month,
        day
      };
    }

    created() { //让初识值等于今天
      this.$store.commit('setCurrentRecord', this.$route.params.id);
      if (this.$route.params.id) {
        this.$store.state.record.createdAt = this.$store.state.currentRecord.createdAt;
        this.getShowDate(new Date(this.$store.state.record.createdAt));
      } else {
        this.getShowDate(new Date(this.$store.state.record.createdAt));
      }
    }


    get showDays() {  //日历展示这个月
      const days = [];
      const monthFirstDay = new Date(this.showData.year, this.showData.month, 1);
      //  拿到1月1号是周几，然后往后错开几天
      const firstDayWeek = monthFirstDay.getDay();
      const showStartDay = +monthFirstDay - firstDayWeek * 24 * 60 * 60 * 1000;
      for (let i = 0; i < 42; i++) {
        days.push(new Date(showStartDay + i * 24 * 60 * 60 * 1000));
      }
      return days;
    }


    onSelectDay(date: Date) { //选择的日期变成点击的日期

      if (this.$route.params.id) {
        this.$store.state.currentRecord.createdAt = new Date(+date + 8 * 3600 * 1000).toISOString();
      } else {
        this.$store.state.record.createdAt = new Date(+date + 8 * 3600 * 1000).toISOString();
      }
      this.$store.state.showBody = false;
      this.getShowDate(date);
    }

    isThisMonthDay(date: Date) {
      const {year, month} = this.getYearMonthDay(date); //看看你这一天是啥
      const {year: showYear, month: showMonth} = this.showData; //再看看展示的是啥
      return year === showYear && month === showMonth;
    }

    isToday(date: Date) {
      // const {year, month, day} = this.getYearMonthDay(date); //看看你这一天是啥
      // const {year: todayYear, month: todayMonth, day: todaytDay} = this.getYearMonthDay(new Date(this.$store.state.record.createdAt));//今天
      // return year === todayYear && month === todayMonth && day === todaytDay;
      if (dayjs(date).isSame(new Date(), 'day')) {
        return true;
      }
    }

    isSelectDay(date: Date) {
      const {year, month, day} = this.getYearMonthDay(date); //看看你这一天是啥
      const {year: selectYear, month: selectMonth, day: selectDay} = this.getYearMonthDay(new Date(this.$store.state.record.createdAt));
      return year === selectYear && month === selectMonth && day === selectDay;
    }


    onChangMonth(type: string) { //日期对象方法setMonth
      const moveMonth = type === 'last' ? -1 : 1;
      const {year, month, day} = this.showData;
      const changMonth = new Date(year, month, day);
      changMonth.setMonth(month + moveMonth);
      const {year: Year, month: Month, day: Day} = this.getYearMonthDay(changMonth);
      this.showData.year = Year;
      this.showData.month = Month;
      this.showData.day = Day;
      this.$store.state.record.createdAt = dayjs().set('date', this.showData.day).set('month', this.showData.month).set('year', this.showData.year).toISOString();
    }

    onChangYear(type: string) {
      const moveYear = type === 'last' ? -1 : 1;
      this.showData.year += moveYear;
      this.$store.state.record.createdAt = dayjs().set('date', this.showData.day).set('month', this.showData.month).set('year', this.showData.year).toISOString();
    }

  }
</script>

<style lang="scss" scoped>

  .date-body {
    width: 100vw;
    height: 330px;
    position: relative;
    overflow: hidden;


    .date-nav {
      user-select: none;
      padding-top: 15px;
      padding-bottom: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      .ontoday {
        position: absolute;
        right: 0;
        top: 0;
        width: 15%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #DE7873;
      }
      .date-btn {
        margin-left: 5px;
        margin-right: 5px;
        color: #b5b5b5;
        font-size: 20px;
      }
    }



    .data-list {
      color: #606266;
      font-size: 14px;
      user-select: none;

      .date-weeks {
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-bottom: 1px solid #ebeef5;
        height: 40px;

        th {
          width: 13.2vw;
          text-align: center;
          line-height: 40px;
        }
      }

      .date-days {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;

        td {
          width: 13.2vw;
          height: 40px;
          line-height: 40px;
          text-align: center;

          &.is-today {
            color: #DE7873;
            font-weight: 700;
          }

          &.is-select {
            border-radius: 50%;
            background: #DE7873;
            font-weight: 700;
            color: #fff;
          }

          &.other-month {
            border-radius: 50%;
            color: #b5b5b5;
          }
        }
      }
    }
  }
</style>