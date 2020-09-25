<template>
  <div class="year">
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

    onChangYear(type: string) {
      const moveYear = type === 'last' ? -1 : 1;
      this.showData.year += moveYear;
      this.$emit('update:chooseDate', new Date(`${this.showData.year}-${this.showData.month}-${this.showData.day}`).toISOString());
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