<template>
  <NavStyle class-prefix="main" class="a">
    <template #header>
     明细
    </template>
    <template #main>

    </template>
  </NavStyle>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  import NumberPad from '@/components/AddMoney/NumberPad.vue';
  import FormItem from '@/components/Input.vue';
  import Tags from '@/components/Tag/ShowTags.vue';
  import Button from '@/components/Button.vue';
  import Tabs from '@/components/MoneyType.vue';
  import Days from '@/components/Calender.vue';
  import MoneyType from '@/components/MoneyType.vue';
  import typeList from '@/constants/typeList';
  import Calender from '@/components/Calender.vue';
  import Input from '@/components/Input.vue';
  import clone from '@/lib/clone';
  import dayjs from 'dayjs';
  import DayDetail from '@/components/Main/DayDetail.vue';


  @Component({
    components: {DayDetail, Input, Calender, MoneyType, Days, Tabs, Button, Tags, FormItem, NumberPad},

  })
  export default class Detail extends Vue {
    type = '-';
    typeList = typeList;

    beforeCreate() {
      this.$store.commit('fetchRecords');
    }

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
  }
</script>
<style lang="scss" scoped>
  .shownav {
    display: flex;
    .showlist {
      flex: 1;
      height: 100px;
    }
  }

  .type {
    flex: 1;

    /*::v-deep {*/
    /*  .main-type {*/
    /*    background-color: #c4c4c4;*/

    /*    &.selected {*/
    /*      background: white;*/

    /*      &::after {*/
    /*        display: none;*/
    /*      }*/
    /*    }*/
    /*  }*/
    /*}*/
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
    overflow-y: auto;
    background: #DE7873;

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

