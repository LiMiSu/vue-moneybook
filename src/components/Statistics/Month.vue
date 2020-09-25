<template>
  <div class="month">
      <Icon name="leftdate" @click="onChangYear('last')"></Icon>
      <div>{{show}}</div>
      <Icon name="rigthdate" @click="onChangYear('next')"></Icon>
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
    chooseMonth!: string;
    showData = {
      year: 0,
      month: 0,
      day: 0
    };
    showChoose=false

    get show() {
      return dayjs(this.chooseMonth).format('YYYY-MM');
    }

    getShowDate() {
      const year = parseFloat(dayjs(this.chooseMonth).format('YYYY'));
      const month = parseFloat(dayjs(this.chooseMonth).format('MM'));
      const day = parseFloat(dayjs(this.chooseMonth).format('DD'));
      this.showData = {year, month, day};
    }

    created() {
      this.getShowDate();
    }

    onChangYear(type: string) {
      const moveYear = type === 'last' ? -1 : 1;
      this.showData.month += moveYear;
      if (this.showData.month > 12) {
        this.showData.month = 1;
        this.showData.year++
      }else if (this.showData.month<1){
        this.showData.month = 12;
        this.showData.year--
      }
      this.$emit('update:chooseMonth', new Date(`${this.showData.year}-${this.showData.month}-${this.showData.day}`).toISOString());
    }
  }
</script>

<style lang="scss" scoped>
.month{
  display: flex;
  justify-content: center;
  align-items: center;
  .icon{
    width: 16px;
    height: 13px;
    margin: 8px 3px;
    color: #b5b5b5;
  }
  div{
    margin: 3px 5px 0 5px;
  }
}
</style>