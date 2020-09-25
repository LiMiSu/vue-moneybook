<template>
  <div class="year">
    <div @click="changYear('last')"><Icon name="leftdate"></Icon></div>
    <div>{{show}}</div>
    <div @click="changYear('next')"><Icon name="rigthdate"></Icon></div>
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
    chooseDate!: string;
    showData = {
      year: 0,
      month: 0,
      day: 0
    };

    get show() {
      return dayjs(this.chooseDate).format('YYYY');
    }

    getShowDate() {
      const year = parseFloat(dayjs(this.chooseDate).format('YYYY'));
      const month = parseFloat(dayjs(this.chooseDate).format('M'));
      const day = parseFloat(dayjs(this.chooseDate).format('D'));
      this.showData = {year, month, day};
    }

    created() {
      this.getShowDate();
    }

    changYear(type: string) {
      const moveYear = type === 'last' ? -1 : 1;
      this.showData.year += moveYear;
      this.$emit('update:chooseDate', dayjs().set('date',this.showData.day).set('month',this.showData.month-1).set('year',this.showData.year).toISOString());
    }
  }
</script>

<style lang="scss" scoped>
.year{
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