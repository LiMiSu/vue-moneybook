<template>
  <layout>
    <template #header>
      <MoneyType class-prefix="type" :data-source="typeList" :value.sync="type"/>
<!--      <MoneyType class-prefix="interval" :data-source="intervalList" :value.sync="interval"/>-->
    </template>
    <template #main>
      <Echarts :option="option"/>
      <div class="statisticsList">
        <ol v-if="groupedList.length>0">
          <li v-for="(group,index) in groupedList" :key="index">
            <h3 class="title">{{beautify(group.title)}}<span>￥{{group.total}}</span></h3>
            <ol>
              <li v-for="item in group.items" :key="item.id"
                  class="record">
                <span>{{tagString(item.tags)}}</span>
                <span class="notes">{{item.notes}}</span>
                <span>￥{{item.amount}}</span>
              </li>
            </ol>
          </li>
        </ol>
        <div class="noResult" v-else>目前没有相关记录</div>
      </div>
    </template>
  </layout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import MoneyType from '@/components/MoneyType.vue';
  import typeList from '@/constants/typeList';
  import dayjs from 'dayjs';
  import clone from '@/lib/clone';
  import Button from '@/components/Button.vue';
  import Echarts from '@/components/Echarts.vue';
  import intervalList from '@/constants/intervalList';

  @Component({
    components: {Button, Echarts,MoneyType},
  })
  export default class Statistics extends Vue {
    type = '-';
    interval = 'day';
    intervalList = intervalList;
    typeList = typeList;

    beforeCreate() {
      this.$store.commit('fetchRecords');
    }
    // [
    //   {"tags":[{"id":"1","name":"衣","tagicon":"date"}],   "notes":"","type":"-","amount":8,   "createdAt":"2020-09-11T23:36:23.663Z"},
    //   {"tags":[{"id":"1","name":"衣","tagicon":"date"}],   "notes":"","type":"-","amount":9,   "createdAt":"2020-09-11T23:36:23.663Z"},
    //   {"tags":[{"id":"1","name":"衣","tagicon":"date"}],   "notes":"","type":"-","amount":5,   "createdAt":"2020-09-11T23:40:11.700Z"},
    //   {"tags":[{"id":"3","name":"住","tagicon":"label"}],  "notes":"","type":"+","amount":58,  "createdAt":"2020-09-11T23:40:11.700Z"},
    //   {"tags":[{"id":"3","name":"住","tagicon":"label"}],  "notes":"","type":"+","amount":9,   "createdAt":"2020-09-11T23:40:11.700Z"},
    //   {"tags":[{"id":"1","name":"衣","tagicon":"date"}],   "notes":"","type":"-","amount":88,  "createdAt":"2020-09-21T16:00:00.000Z"}
    // ]

    get recordList() {
      return this.$store.state.recordList;
    }

    get groupedList() { //计算出渲染数据
      const {recordList} = this;
      const newRecordList = clone(recordList)  //根据时间排序
        .filter((item: RecordItem) => item.type === this.type)
        .sort((a: RecordItem, b: RecordItem) =>
          dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
        );

      if (newRecordList.length === 0) {
        return [];
      }
      type Result = { title: string; total?: number; items: RecordItem[] }[]
      const result: Result = [{title: dayjs(newRecordList[0].createdAt).format('YYYY-M-D'), items: [newRecordList[0]]}]; //先拿一个参照物
      for (let i = 1; i < newRecordList.length; i++) {
        const current = newRecordList[i];
        const last = result[result.length - 1];
        if (dayjs(last.title).isSame(dayjs(current.createdAt), 'day')) {  //是同一天就直接放，不是同一天就新建，对比：你跟我这一天的最后一项相比较
          last.items.push(current);
        } else {
          result.push({title: dayjs(current.createdAt).format('YYYY-M-D'), items: [current]});
        }
      }
      result.forEach(group => { //计算总和
        group.total = group.items.reduce((sum, item) => {
          return sum + item.amount;
        }, 0);
      });
      return result;
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
          type: 'line',
          symbol: 'triangle',
          symbolSize: 20,
          lineStyle: {
            color: 'green',
            width: 4,
            type: 'dashed'
          },
          itemStyle: {
            borderWidth: 3,
            borderColor: 'yellow',
            color: 'blue'
          }
        }]
      };
    }
  }
</script>

<style lang="scss" scoped>

  ::v-deep {
    .type-type {
      background-color: #c4c4c4;

      &.selected {
        background: white;

        &::after {
          display: none;
        }
      }
    }

    .interval-type {
      background-color: white;
      height: 30px;

      &.selected {
        background: #c4c4c4;

        &::after {
          display: none;
        }
      }
    }
  }


  /*相同样式*/
  %item {
    padding: 0 16px;
    min-height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .statisticsList {
    overflow: auto;
    background: fuchsia;
    .title {
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