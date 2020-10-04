<template>
  <NavStyle>
    <template #header>
      <div @click="$store.state.showtype=!$store.state.showtype" class="nav-wrapper">
        <span>明细</span><span class="value">({{showvalue}}</span>
        <Icon name="up" v-if="$store.state.showtype"></Icon>
        <Icon name="down" v-else></Icon>
        )
      </div>
    </template>
    <template #main>
      <div v-if="$store.state.showtype" class="type-wrapper">
        <MoneyType class-prefix="detail" :data-source="detailList" :value.sync="type" :showvalue.sync="showvalue"/>
      </div>
      <div class="statisticsList">
        <div v-if="yearRecordList.length>0">
          <DetailList :yearRecordList.sync="yearRecordList" :type="type"></DetailList>
          <DetailBottom :type="type"></DetailBottom>
        </div>
        <div class="noResult" v-else>- 暂无{{showvalue==='全部'?'记账':showvalue}}记录，去
          <router-link to="/addmoney"><span class="add">记一笔</span></router-link>
          吧~ -
        </div>
      </div>
    </template>
  </NavStyle>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import MoneyType from '@/components/MoneyType.vue';
  import Button from '@/components/Button.vue';
  import Echarts from '@/components/Statistics/Echarts.vue';
  import detail from '@/constants/detail';
  import DetailList from '@/components/Detail/DetailList.vue';
  import DetailBottom from '@/components/Detail/DetailBottom.vue';

  @Component({
    components: {DetailBottom, DetailList, Button, Echarts, MoneyType},
  })
  export default class Detail extends Vue {
    type = '1';
    detailList = detail;
    showvalue = '全部';


    beforeCreate() {
      this.$store.commit('fetchRecords');
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
      if (this.type === '1') {
        return this.$store.state.yearRecordList;
      }
      return this.$store.state.yearRecordList.filter((item: YearResult) => item.items[0].items[0].items[0].type === this.type);
    }


  }
</script>

<style lang="scss" scoped>
  .nav-wrapper {
    display: flex;
    align-items: center;

    .value {
      margin: 0 3px 0 6px;
    }

    .icon {
      width: 11px;
      height: 12px;
    }
  }

  .type-wrapper {
    position: absolute;
    top: 6vh;
    left: 0;
    width: 100%;
    height: 94vh;
    background: rgba(205, 205, 205, 0.5);
  }

  ::v-deep .detail-tabs {
    flex-direction: column;
    align-items: center;
    background: #fff;

    .tabs-type {
      width: 100%;
    }
  }


  .statisticsList {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;


    .noResult {
      padding: 16px;
      text-align: center;
      color: #999;

      .add {
        color: blue;

      }
    }
  }
</style>
