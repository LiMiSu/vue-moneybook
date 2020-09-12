<template>
  <div class="addMoney">


    <div class="content">
      <tags :value.sync="$store.state.record.tags"/>
      <router-view></router-view>
      <div class="notes">
        <FormItem :value.sync="$store.state.record.notes" field-name="备注" placeholder="在这里输入备注"/>
      </div>
    </div>


    <div>
      <Tabs class-prefix="type" :data-source="typeList" :value.sync="$store.state.record.type"/>
      <Days class="chooseDay"></Days>
      <number-pad :value.sync="$store.state.record.amount" @submit="saveRecord"></number-pad>
    </div>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  import NumberPad from '@/components/AddMoney/NumberPad.vue';
  import FormItem from '@/components/Input.vue';
  import Tags from '@/components/Tag/ShowTags.vue';
  import Button from '@/components/Button.vue';
  import typeList from '@/constants/typeList';
  import Tabs from '@/components/MoneyType.vue';
  import Days from '@/components/Calender.vue';

  @Component({
    components: {Days, Tabs, Button, Tags, FormItem, NumberPad},
  })
  export default class Money extends Vue {
    typeList = typeList;

    created() {
      this.$store.commit('fetchRecords');
    }

    saveRecord() {
      this.$store.commit('createRecord', this.$store.state.record);
      this.$store.state.record.notes = '';
    }
  }
</script>

<style lang="scss" scoped>
  .addMoney {
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

  .content {
    display: flex;
    flex-direction: column;
    overflow: auto;
    flex: 1;
    /*flex-grow: 1;*/
  }

  .chooseDay {
    position: absolute;
    left: 0;
    bottom: 0;

  }
</style>