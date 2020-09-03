<template>
  <layout class-prefix="layout">
    {{count}}
    <button @click="$store.commit('increment', 1)">+1</button>
    <tags :value.sync="record.tags"/>
    <div class="notes">
      <FormItem :value.sync="record.notes" field-name="备注" placeholder="在这里输入备注"/>
    </div>
    <types :value.sync="record.type"/>
    <number-pad :value.sync="record.amount" @submit="saveRecord"/>
  </layout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  import NumberPad from '@/components/Money/NumberPad.vue';
  import Types from '@/components/Money/Types.vue';
  import FormItem from '@/components/Money/FormItem.vue';
  import Tags from '@/components/Money/Tags.vue';
  import oldStore from '@/store/index2';
  import Button from '@/components/Button.vue';


  @Component({
    components: {Button, Tags, FormItem, Types, NumberPad},
    computed: {
      count() {
        return this.$store.state.count;
      }
    }
  })
  export default class Money extends Vue {
    record: RecordItem = {tags: [], notes: '', type: '-', amount: 0};

    saveRecord() {
      oldStore.createRecord(this.record);
    }
  }
</script>
<style lang="scss">
  .layout-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .notes {
    padding: 12px 0;
  }
</style>