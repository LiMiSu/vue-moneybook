<template>
  <layout class-prefix="layout">
    {{record}}
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

  type Record = {
    tags: string[];
    notes: string;
    type: string;
    amount: number;
    createDat?: Date;
  }

  @Component({
    components: {Tags, Note, Types, NumberPad},
  })
  export default class Money extends Vue {
    tages = ['衣', '食', '住', '行'];
    recordList: Record[] = JSON.parse(window.localStorage.getItem('recordList') || '[]');
    record: Record = {tags: [], notes: '', type: '-', amount: 0};


    saveRecord() {
      const recordDeep: Record = JSON.parse(JSON.stringify(this.record));
      recordDeep.createDat = new Date();
      this.recordList.push(recordDeep);
    }

    @Watch('recordList')
    onRecordListChang() {
      localStorage.setItem('recordList', JSON.stringify(this.recordList));
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