<template>
  <layout class-prefix="layout">
    <tags :data-source="tages" :value.sync="record.tags"/>
    <div class="notes">
      <FormItem :value.sync="record.notes" field-name="备注" placeholder="在这里输入备注"/>
    </div>
    <types :value.sync="record.type"/>
    <number-pad :value.sync="record.amount" @submit="saveRecord"/>
  </layout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop, Watch} from 'vue-property-decorator';

  import NumberPad from '@/components/Money/NumberPad.vue';
  import Types from '@/components/Money/Types.vue';
  import FormItem from '@/components/Money/FormItem.vue';
  import Tags from '@/components/Money/Tags.vue';
  import recordListModel from '@/models/recordListModel';

  const recordList = recordListModel.fetch();

  @Component({
    components: {Tags, FormItem, Types, NumberPad},
  })
  export default class Money extends Vue {
    tages = window.tagList;
    recordList = recordList;
    record: RecordItem = {tags: [], notes: '', type: '-', amount: 0};

    saveRecord() {
     recordListModel.create(this.record)
    }

    @Watch('recordList')
    onRecordListChang() {
      recordListModel.save();
    }
  }
</script>
<style lang="scss">
  .layout-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .notes{
    padding: 12px 0;
  }
</style>