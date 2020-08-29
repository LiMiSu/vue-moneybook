<template>
  <layout class-prefix="layout">
    {{record}}
    <tags :data-source.sync="tages" :value.sync="record.tags"/>
    <note :value.sync="record.notes"/>
    <types :value.sync="record.type"/>
    <number-pad :value.sync="record.amount"/>
  </layout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';

  import NumberPad from '@/components/Money/NumberPad.vue';
  import Types from '@/components/Money/Types.vue';
  import Note from '@/components/Money/Note.vue';
  import Tags from '@/components/Money/Tags.vue';

  type Record = {
    tags: string[];
    notes: string;
    type: string;
    amount: number;
  }

  @Component({
    components: {Tags, Note, Types, NumberPad},
  })
  export default class Money extends Vue {
    tages = ['衣', '食', '住', '行'];
    record: Record = {tags: [], notes: '', type: '-', amount: 0};
  }
</script>
<style lang="scss">
  .layout-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
</style>