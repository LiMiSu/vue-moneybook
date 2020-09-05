<template>
  <layout>
    <Tabs class-prefix="type" :data-source="typeList" :value.sync="type"/>
    <Tabs class-prefix="interval" :data-source="intervalList" :value.sync="interval"/>
    <ol>
      <li v-for="(group,index) in result" :key="index">
        <h3 class="title">{{titleChange(group.title)}}</h3>
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
  </layout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import Tabs from '@/components/Tabs.vue';
  import typeList from '@/constants/typeList';
  import intervalList from '@/constants/intervalList';

  @Component({
    components: {Tabs},
  })
  export default class Statistics extends Vue {
    type = '-';
    interval = 'day';
    intervalList = intervalList;
    typeList = typeList;

    get recordList() {
      return this.$store.state.recordList;
    }

    beforeCreate() {
      this.$store.commit('fetchRecords');
    }

    get result() {
      const {recordList} = this;

      type HashTableValue = { title: string; items: RecordItem[] }

      const hashTable: { [key: string]: HashTableValue } = {};

      for (let i = 0; i < recordList.length; i++) {
        const [data, time] = recordList[i].createdAt.split('T');
        hashTable[data] = hashTable[data] || {title: data, items: []};
        hashTable[data].items.push(recordList[i]);
      }
      return hashTable;
    }

    tagString(tags: Tag[]) {
      const nameArr=[]
      for (let i = 0; i < tags.length; i++) {
        nameArr.push(tags[i].name)
      }
      return nameArr.join(" ") || '未分类'
    }
    titleChange(title: string){
      console.log(title);
      return;
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep {
    .type-type {
      background-color: white;

      &.selected {
        background: #c4c4c4;

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
    .notes{
      margin-right: auto;
      margin-left: 16px;
      color: #999;
    }
  }
</style>