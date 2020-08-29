<template>
  <layout class-prefix="layout">
    <tags :data-source.sync="tages" :value.sync="record.tags"/>
    <note :value.sync="record.notes"/>
    <types :value.sync="record.type"/>
    <number-pad :value.sync="record.amount" @submit="saveRecord"/>
    {{recordList}}
  </layout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop, Watch} from 'vue-property-decorator';

  import NumberPad from '@/components/Money/NumberPad.vue';
  import Types from '@/components/Money/Types.vue';
  import Note from '@/components/Money/Note.vue';
  import Tags from '@/components/Money/Tags.vue';
  import model from '@/model';


  const recordList = model.fetch();
  @Component({
    components: {Tags, Note, Types, NumberPad},
  })
  export default class Money extends Vue {
    tages = ['衣', '食', '住', '行'];
    recordList = recordList;
    record: RecordItem = {tags: [], notes: '', type: '-', amount: 0};


    saveRecord() {
      const recordDeep: RecordItem = model.clone(this.record)
      recordDeep.createDat = new Date();
      this.recordList.push(recordDeep);
    }

    @Watch('recordList')
    onRecordListChang() {
      model.save(this.recordList)
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