<template>
  <div class="date-body">
    <div class="date-nav">
      <Icon name="left-nav" class="date-btn icon-left-nav" @click="onChangYear('last')"></Icon>
      <Icon name="zuo" class="date-btn icon-zuo" @click="onChangMonth('last')"></Icon>
      <span>{{showData.year}}年{{showData.month+1}}月</span>
      <Icon name="you" class="date-btn icon-you" @click="onChangMonth('next')"></Icon>
      <Icon name="right-nav" class="date-btn icon-right-nav" @click="onChangYear('next')"></Icon>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import Input from '@/components/Input.vue';
  @Component({
    components: {Input}
  })
  export default class Days extends Vue {
    showData = {
      year: 0,
      month: 0,
      day: 0
    };

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
      this.getShowDate(new Date(this.$store.state.record.createdAt));
    }

    onChangMonth(type: string) {
      const moveMonth = type === 'last' ? -1 : 1;
      const {year, month, day} = this.showData;
      const changMonth = new Date(year, month, day);
      changMonth.setMonth(month + moveMonth);
      const {year: Year, month: Month, day: Day} = this.getYearMonthDay(changMonth);
      this.showData.year = Year;
      this.showData.month = Month;
      this.showData.day = Day;
    }

    onChangYear(type: string) {
      const moveYear = type === 'last' ? -1 : 1;
      this.showData.year += moveYear;
    }

  }
</script>

<style lang="scss" scoped>
  .date-body {
    border: 1px solid yellow;
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
  }
</style>