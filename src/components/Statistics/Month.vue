<template>
  <div class="month">
    <div @click="changMonth('last')">
      <Icon name="leftdate"></Icon>
    </div>
    <div>{{show}}</div>
    <div @click="changMonth('next')">
      <Icon name="rigthdate"></Icon>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';
  import dayjs from 'dayjs';
  import Button from '@/components/Button.vue';

  @Component({
    components: {Button}
  })
  export default class Year extends Vue {
    @Prop(String)
    chooseMonth: string | undefined;
    showData = {
      year: 0,
      month: 0,
      day: 0
    };

    get show() {
      return dayjs(this.chooseMonth).format('YYYY-M');
    }

    getShowDate() {
      if (this.chooseMonth) {
        const year = parseFloat(dayjs(this.chooseMonth).format('YYYY'));
        const month = parseFloat(dayjs(this.chooseMonth).format('M'));
        const day = parseFloat(dayjs(this.chooseMonth).format('DD'));
        this.showData = {year, month, day};
      }
    }

    created() {
      this.getShowDate();
    }

    changMonth(type: string) {
      type === 'last' ? this.showData.month -= 1 : this.showData.month += 1;
      if (this.showData.month > 12) {
        this.showData.month = 1;
        this.showData.year++;
      } else if (this.showData.month < 1) {
        this.showData.month = 12;
        this.showData.year--;
      }
      this.$emit('update:chooseMonth', dayjs().set('date',this.showData.day).set('month',this.showData.month-1).set('year',this.showData.year).toISOString());
    }
  }
</script>

<style lang="scss" scoped>
  .month {
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
      width: 16px;
      height: 13px;
      margin: 8px 3px;
      color: #b5b5b5;
    }

    div {
      margin: 3px 5px 0 5px;
    }
  }
</style>