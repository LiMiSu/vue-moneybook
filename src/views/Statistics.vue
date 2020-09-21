<template>
  <NavStyle>
    <template #header>
      统计
    </template>
    <template #main>
      <div>
        <MoneyType class-prefix="type" :data-source="typeList" :value.sync="type"/>
        <!--      <MoneyType class-prefix="interval" :data-source="intervalList" :value.sync="interval"/>-->
      </div>
      <div class="echarts-wrapper" ref="echartsscroll">
        <div class="echarts">
          <Echarts :option="option"/>
        </div>
      </div>
    </template>
  </NavStyle>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import MoneyType from '@/components/MoneyType.vue';
  import typeList from '@/constants/typeList';
  import Button from '@/components/Button.vue';
  import Echarts from '@/components/Echarts.vue';
  import intervalList from '@/constants/intervalList';
  import dayjs from 'dayjs';

  @Component({
    components: {Button, Echarts, MoneyType},
  })
  export default class Statistics extends Vue {
    type = '+';
    interval = 'day';
    intervalList = intervalList;
    typeList = typeList;


    beforeCreate() {
      this.$store.commit('fetchRecords');
    }

    get recordList() {
      return this.$store.state.recordList;
    }

    get dayRecordList() {
      this.$store.commit('createdDayRecordList', {recordList: this.recordList, type: this.type});
      return this.$store.state.dayRecordList;
    }

    get keyValueList() {
      const today = new Date();
      const array = [];
      for (let i = 0; i <= 29; i++) {
        const date = dayjs(today).subtract(i, 'day').format('YYYY-MM-DD');
        const found = (this.dayRecordList as DayResult[]).filter(item => dayjs(item.title).format('YYYY-MM-DD') === date);
        const value = found.reduce((sum, item) => {
          return sum + item.total!;
        }, 0);
        array.push({date: date, value: value ? value : 0});
      }
      array.sort((a, b) => {
        if (a.date > b.date) {
          return 1;
        } else if (a.date === b.date) {
          return 0;
        } else {
          return -1;
        }
      });
      return array;
    }

    get option() {
      const keys = this.keyValueList.map(item => item.date);
      const values = this.keyValueList.map(item => item.value);
      return {
        xAxis: {
          type: 'category',
          data: keys,
          axisLabel: {
            formatter: function (value: string, index: number) {
              return value.substr(5);
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: values,
          type: 'bar'
        }]
      };
    }
  }
</script>

<style lang="scss" scoped>
  .echarts-wrapper {
    overflow: auto;
  }

  /*.echarts {*/
  /*  width: 500%;*/
  /*}*/


</style>