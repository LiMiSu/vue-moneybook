<template>
  <layout class-prefix="layout">
    <tags :data-source.sync="tages" :value.sync="record.tags"/>
    <note :value.sync="record.notes"/>
    <types :value.sync="record.type"/>
    <number-pad :value.sync="record.amount" @submit="saveRecord"/>
  </layout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop, Watch} from 'vue-property-decorator';

  import NumberPad from '@/components/Money/NumberPad.vue';
  import Types from '@/components/Money/Types.vue';
  import Note from '@/components/Money/Note.vue';
  import Tags from '@/components/Money/Tags.vue';
  import recordListModel from '@/models/recordListModel';
  import tagListModel from '@/models/tagListModel';


  const recordList = recordListModel.fetch();
  const tagList = tagListModel.fetch();


  @Component({
    components: {Tags, Note, Types, NumberPad},
  })
  export default class Money extends Vue {
    tages = tagList;
    recordList = recordList;
    record: RecordItem = {tags: [], notes: '', type: '-', amount: 0};


    saveRecord() {
      const recordDeep: RecordItem = recordListModel.clone(this.record);
      recordDeep.createDat = new Date();
      this.recordList.push(recordDeep);
    }

    @Watch('recordList')
    onRecordListChang() {
      recordListModel.save(this.recordList);
    }
  }
</script>
<style lang="scss">
  .layout-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
</style>