<template>
  <div class="addMoney">
    <div class="content">
      <div><Days field-name="日期" placeholder="在这里输入日期"/></div>
      <div><tags :value.sync="record.tags"/></div>
      <div class="notes"><FormItem :value.sync="record.notes" field-name="备注" placeholder="在这里输入备注"/></div>
    </div>
    <div>

      <div><Tabs class-prefix="type" :data-source="typeList" :value.sync="record.type"/></div>
      <div><number-pad :value.sync="record.amount" @submit="saveRecord"/></div>
    </div>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  import NumberPad from '@/components/Money/NumberPad.vue';
  import FormItem from '@/components/Money/FormItem.vue';
  import Tags from '@/components/Money/Tags.vue';
  import Button from '@/components/Button.vue';
  import typeList from '@/constants/typeList';
  import Tabs from '@/components/Tabs.vue';
  import dayjs from 'dayjs';
  import Days from '@/components/Days.vue';


  @Component({
    components: {Days, Tabs, Button, Tags, FormItem, NumberPad},

  })
  export default class Money extends Vue {
    record: RecordItem = {tags: [], notes: '', type: '-', amount: 0, createdAt: new Date().toISOString()};
    typeList = typeList;

    created() {
      this.$store.commit('fetchRecords');

    }

    saveRecord() {
      this.$store.commit('createRecord', this.record);
      this.record.notes = '';
    }

  }
</script>

<style lang="scss" scoped>
.addMoney{
  /*display: flex;*/
  /*height: 100vh;*/
  /*width: 100vw;*/
  /*flex-direction: column;*/
  /*justify-content: space-between;*/
  /*flex: 1;*/
  display: flex;
  flex-direction: column;
  /*justify-content: space-between;*/
  /*min-height: 100vh;*/

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
  .content{
    display: flex;
    flex-direction: column;
    overflow: auto;
    flex: 1;
    /*flex-grow: 1;*/
  }
</style>