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

  @Component({
    components: {Button, Echarts, MoneyType},
  })
  export default class Statistics extends Vue {
    type = '+';
    interval = 'day';
    intervalList = intervalList;
    typeList = typeList;

    mounted() {
      (this.$refs.echartsscroll as HTMLDivElement).scrollLeft = 99999;
    }

    get option() {
      return {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [120, 200, 150, 80, 70, 110, 130],
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