<template>
  <layout>
    <Tabs class-prefix="type" :data-source="typeList" :value.sync="type"/>
    <!--    <Tabs class-prefix="interval" :data-source="intervalList" :value.sync="interval"/>-->
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
    <Echarts :option="option"/>
  </layout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import Tabs from '@/components/Tabs.vue';
  import typeList from '@/constants/typeList';
  import dayjs from 'dayjs';
  import clone from '@/lib/clone';
  import Button from '@/components/Button.vue';
  import Echarts from '@/components/Echarts.vue';

  @Component({
    components: {Button, Echarts, Tabs},
  })
  export default class Statistics extends Vue {
    type = '-';
    // interval = 'day';
    // intervalList = intervalList;
    typeList = typeList;

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

    get recordList() {
      return this.$store.state.recordList;
    }

    beforeCreate() {
      this.$store.commit('fetchRecords');
    }

    get groupedList() {
      const {recordList} = this;
      const newRecordList = clone(recordList)
        .filter((item: RecordItem) => item.type === this.type)
        .sort((a: RecordItem, b: RecordItem) =>
          dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
        );

      if (newRecordList.length === 0) {
        return [];
      }
      type Result = { title: string; total?: number; items: RecordItem[] }[]
      const result: Result = [{title: dayjs(newRecordList[0].createdAt).format('YYYY-M-D'), items: [newRecordList[0]]}];
      for (let i = 1; i < newRecordList.length; i++) {
        const current = newRecordList[i];
        const last = result[result.length - 1];
        if (dayjs(last.title).isSame(dayjs(current.createdAt), 'day')) {
          last.items.push(current);
        } else {
          result.push({title: dayjs(current.createdAt).format('YYYY-M-D'), items: [current]});
        }
      }
      result.forEach(group => {
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
  }
</script>

<style lang="scss" scoped>
  .noResult {
    padding: 16px;
    text-align: center;
  }

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
      height: 48px;

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


</style>