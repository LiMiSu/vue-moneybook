<template>
  <!--  记账组件-->
  <layout class-prefix="layout">
    <template #main>
      <div v-if="$store.state.changeShow">
        <tags :value.sync="record.tags"/>
        <div class="notes">
          <FormItem :value.sync="record.notes" field-name="备注" placeholder="在这里输入备注"/>
        </div>
        <Days field-name="日期" placeholder="在这里输入日期"/>
        <Tabs class-prefix="type" :data-source="typeList" :value.sync="record.type"/>
        <number-pad  :value.sync="record.amount" @submit="saveRecord"/>
      </div>
    </template>

  </layout>
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
  ::v-deep .layout-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .notes {
    padding: 12px 0;
  }
</style>