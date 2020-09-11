<template>
  <!--  日期组件-->
  <div class="date">
<!--        <div class="date-input">-->
<!--          <Icon name="date" class="icon-data"></Icon>-->
<!--          <input-->
<!--            type="text"-->
<!--            :value="inputDate"-->
<!--          >-->
<!--        </div>-->
    <div v-if="$store.state.showBody" class="date-body">
      <div class="data-tri"></div>
      <div class="date-content">

        <div class="date-nav">
          <Icon name="left-nav" class="date-btn icon-left-nav" @click="onChangYear('last')"></Icon>
          <Icon name="zuo" class="date-btn icon-zuo" @click="onChangMonth('last')"></Icon>
          <span>{{showData.year}}年{{showData.month+1}}月{{showData.day}}</span>
          <Icon name="you" class="date-btn icon-you" @click="onChangMonth('next')"></Icon>
          <Icon name="right-nav" class="date-btn icon-right-nav" @click="onChangYear('next')"></Icon>
        </div>

<!--        <div class="data-list">-->
<!--          <div class="date-weeks">-->
<!--            <div v-for="week in weekDay" :key="week"-->
<!--            >-->
<!--              {{week}}-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="date-days">-->
<!--            <div-->
<!--              v-for="day in showDays"-->
<!--              :key="day.getTime()"-->
<!--              :class="{-->
<!--                'other-month': !isThisMonthDay(day),-->
<!--                'is-select': isSelectDay(day),-->
<!--                'is-today': isToday(day)}"-->
<!--              @click="onSelectDay(day)"-->
<!--            >-->
<!--              {{day.getDate()}}-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

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
              :class="{
                'other-month': !isThisMonthDay(day),
                'is-select': isSelectDay(day),
                'is-today': isToday(day)}"
              @click="onSelectDay(day)"
            >
              {{day.getDate()}}
            </td>
          </tr>
        </table>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';

  @Component
  export default class Days extends Vue {
    @Prop(String)
    readonly value!: string;
    weekDay = ['日', '一', '二', '三', '四', '五', '六'];
    data = new Date(this.value);
    showData = { //初始值？
      year: 0,
      month: 0,
      day: 0
    };


    getYearMonthDay(date: any) {  //获取时间函数，时间初始化函数，拿到具体天
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      return {
        year,
        month,
        day
      };
    }

    getShowDate() { //拿到今天是哪天
      const {year, month, day} = this.getYearMonthDay(this.data);
      this.showData = {
        year,
        month,
        day
      };
    }

    created() { //让初识值等于今天
      console.log(this.data.toISOString());
      console.log(this.value);
      this.getShowDate();
    }

    get inputDate() {
      const {year, month, day} = this.getYearMonthDay(this.data);
      return `${year}-${month + 1}-${day}`;
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

    isThisMonthDay(date: Date) {
      const {year, month} = this.getYearMonthDay(date); //看看你这一天是啥
      const {year: showYear, month: showMonth} = this.showData; //再看看展示的是啥
      return year === showYear && month === showMonth;
    }

    isToday(date: Date) {
      const {year, month, day} = this.getYearMonthDay(date); //看看你这一天是啥
      const {year: todayYear, month: todayMonth, day: todaytDay} = this.getYearMonthDay(new Date(this.value));//今天
      return year === todayYear && month === todayMonth && day === todaytDay;
    }

    isSelectDay(date: Date) {
      const {year, month, day} = this.getYearMonthDay(date); //看看你这一天是啥
      const {year: selectYear, month: selectMonth, day: selectDay} = this.getYearMonthDay(new Date(this.inputDate));
      return year === selectYear && month === selectMonth && day === selectDay;
    }

    onSelectDay(date: Date) { //选择的日期变成点击的日期
      this.data = date;
      this.$store.state.showBody=false
      this.getShowDate();
      this.$emit('update:value', this.data.toISOString());
    }

    // onChangMonth(type: string) {  //自己手写
    //   const minMonth = 0;
    //   const maxMonth = 11;
    //   const moveMonth = type === 'last' ? -1 : 1;
    //   let {year, month} = this.showData;
    //   month += moveMonth;
    //   if (month < minMonth) {
    //     month = maxMonth;
    //     year--;
    //   } else if (month > maxMonth) {
    //     month = minMonth;
    //     year++;
    //   }
    //   this.showData.month = month;
    //   this.showData.year=year
    // }
    onChangMonth(type: string) { //日期对象方法setMonth
      const moveMonth = type === 'last' ? -1 : 1;
      const {year, month, day} = this.showData;
      const changMonth = new Date(year, month, day);
      changMonth.setMonth(month + moveMonth);
      const {year: Year, month: Month} = this.getYearMonthDay(changMonth);
      this.showData.year = Year;
      this.showData.month = Month;
    }

    onChangYear(type: string) {
      const moveYear = type === 'last' ? -1 : 1;
      this.showData.year += moveYear;
    }

  }
</script>

<style lang="scss" scoped>
  /*.date-input {*/
  /*  height: 40px;*/
  /*  line-height: 40px;*/
  /*  border: 1px solid blue;*/
  /*  padding: 0 30px;*/
  /*  border-radius: 4px;*/
  /*  position: relative;*/

    /*.icon-data {*/

    /*  left: 5px;*/
    /*  top: 3px;*/
    /*  font-size: 30px;*/
    /*}*/
  /*}*/

  .date-body {
    border: 1px solid yellow;
    min-width: 100vw;
    height: 250px;
    position: relative;
    overflow: hidden;

    .data-tri {
      position: absolute;
      top: -12px;
      left: 30px;
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-bottom-color: red;

      &::after {
        position: absolute;
        left: -6px;
        top: -6px;
        content: '';
        display: block;
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-bottom-color: white;
      }
    }

    .date-content {
      .date-nav {
        user-select: none;
        padding-top: 15px;
        padding-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        .date-btn {
          margin-left: 5px;
          margin-right: 5px;
          color: #000;
          font-size: 20px;
        }
      }

      .data-list {
        color: #606266;
        /*margin-left: 60px;*/
        /*margin-right: 60px;*/
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
            line-height: 30px;
            text-align: center;

            &.is-today {
              color: #409eff;
              font-weight: 700;
            }

            &.is-select {
              border-radius: 50%;
              background: #409eff;
              font-weight: 700;
              color: #fff;
            }

            &.other-month {
              border-radius: 50%;
              color: red;
            }
          }
        }
      }
    }
  }


</style>