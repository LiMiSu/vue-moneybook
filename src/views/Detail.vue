<template>
  <NavStyle>
    <template #header>
      明细
    </template>
    <template #main>


      <MoneyType class-prefix="type" :data-source="typeList" :value.sync="type"/>
      <!--      <MoneyType class-prefix="interval" :data-source="intervalList" :value.sync="interval"/>-->
      <div class="statisticsList">

        <div >
          <h2 class="year-title"><span>2020</span><span>支出: ￥-300</span><span>支出：￥+888</span><span>合计：￥+888</span></h2>
          <div >
            <h3 class="month-title"><span>9月</span><span>支出: ￥-300</span><span>支出：￥+888</span><span>合计：￥+888</span></h3>
            <div v-if="dayRecordList.length>0">
              <div v-for="(group,index) in dayRecordList" :key="index">
                <h3 class="day-title" @click="showList(group.title)">{{beautify(group.title)}}<span>￥{{group.total}}</span>
                </h3>
                <div v-if="currentList!==group.title">
                  <div v-for="item in group.items" :key="item.id"
                       class="record">
                    <span>{{tagString(item.tags)}}</span>
                    <span class="notes">{{item.notes}}</span>
                    <span>￥{{item.amount}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="noResult" v-else>目前没有相关记录</div>

          </div>
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
  import dayjs from 'dayjs';
  import Button from '@/components/Button.vue';
  import Echarts from '@/components/Echarts.vue';
  import intervalList from '@/constants/intervalList';

  @Component({
    components: {Button, Echarts, MoneyType},
  })
  export default class Detail extends Vue {
    type = '+';
    interval = 'day';
    intervalList = intervalList;
    typeList = typeList;
    currentList = '';

    beforeCreate() {
      this.$store.commit('fetchRecords');
    }

    showList(title: string) {
      if (this.currentList === title) {
        this.currentList = '';
      } else {
        this.currentList = title;
      }
    }

    get dayRecordList() {
      this.$store.commit('createdDayRecordList', {recordList: this.$store.state.recordList, type: this.type});
      return this.$store.state.dayRecordList;
    }

    tagString(tags: Tag[]) {
      const nameArr = [];
      for (let i = 0; i < tags.length; i++) {
        nameArr.push(tags[i].name);
      }
      return nameArr.join(' ') || '未分类';
    }

    beautify(title: string) {
      const dayValue = dayjs(title);
      const now = dayjs();
      if (dayValue.isSame(now, 'day')) {
        return '今天';
      } else if (dayValue.isSame(now.subtract(1, 'day'), 'day')) {
        return '昨天';
      } else if (dayValue.isSame(now.subtract(2, 'day'), 'day')) {
        return '前天';
      } else if (dayValue.isSame(now, 'year')) {
        return dayValue.format('M月D日');
      } else {
        return dayValue.format('YYYY年M月D日');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .year-title, .month-title{
    width: 100%;
    min-height: 30px;
    display: flex;
    justify-content: space-between;
  }

  %item {
    padding: 0 16px;
    min-height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .statisticsList {
    overflow-y: auto;

    .day-title {
      @extend %item;
    }

    .record {
      @extend %item;
      background: white;

      .notes {
        margin-right: auto;
        margin-left: 16px;
        color: #999;
      }
    }

    .noResult {
      padding: 16px;
      text-align: center;
    }
  }


</style>
