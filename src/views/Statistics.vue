<template>
  <NavStyle>
    <template #header>
      <div @click="$store.state.showtype=!$store.state.showtype" class="nav">
        <span>统计</span><span class="value">({{showvalue}}</span>
        <Icon name="up" v-if="$store.state.showtype"></Icon>
        <Icon name="down" v-else></Icon>
        )
      </div>
    </template>
    <template #main>
      <div v-if="$store.state.showtype" class="type-wrapper">
        <MoneyType class-prefix="statistics-nav" :data-source="typeList" :value.sync="type"
                   :showvalue.sync="showvalue"/>
      </div>
      <div class="echarts-wrapper">
        <EchartsAndRecordList class="echarts" v-if="dayRecordList.length>0" :dayRecordList.sync="dayRecordList"
                              :showvalue.sync="showvalue" :type.sync="type"></EchartsAndRecordList>
        <div class="noResult" v-else>- 暂无{{showvalue}}记录，去
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
  import typeList from '@/constants/typeList';
  import Button from '@/components/Button.vue';
  import Echarts from '@/components/Statistics/Echarts.vue';
  import Year from '@/components/Statistics/Year.vue';
  import Month from '@/components/Statistics/Month.vue';
  import EchartsAndRecordList from '@/components/Statistics/EchartsAndRecordList.vue';

  @Component({
    components: {EchartsAndRecordList, Month, Year, Button, Echarts, MoneyType},
  })
  export default class Statistics extends Vue {
    type = '';
    showvalue = '';
    typeList = typeList;

    beforeCreate() {
      this.$store.commit('fetchRecords');
    }

    created() {
      this.initType(this.$store.state.recordList);
    }

    initType(data: RecordItem[]) {
      if (data[0] && data[0].type) {
        this.type = data[0].type;
        this.showvalue = this.type === '-' ? '支出' : '收入';
      } else {
        this.type = '-';
        this.showvalue = '支出';
      }
    }

    get recordList() {
      return this.$store.state.recordList;
    }

    get dayRecordList() {
      this.$store.commit('createdDayRecordList', {recordList: this.recordList, type: this.type});
      return (this.$store.state.dayRecordList as DayResult[]).filter(item => item.items[0].type === this.type);
    }
  }
</script>

<style lang="scss" scoped>
  .nav {
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

  ::v-deep .statistics-nav-tabs {
    flex-direction: column;
    align-items: center;
    background: #fff;

    .tabs-type {
      width: 100%;
    }
  }

  .echarts-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .echarts {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }

  .noResult {
    padding: 16px;
    text-align: center;
    color: #999;

    .add {
      color: blue;
    }
  }

  .echarts {
    width: 100%;
    /*height: 30vh;*/
  }


</style>