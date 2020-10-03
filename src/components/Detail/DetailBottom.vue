<template>
  <div class="head">
    <div class="totalN">
      <span class="text">(单位：元)</span>
    </div>
    <div class="totalN" v-if="type==='1'">
      <span class="text">总支出：</span>
      <span class="num">{{allTotal('支出')}}</span>
    </div>
    <div class="totalN" v-if="type==='1'">
      <span class="t">总收入：</span>
      <span class="num">{{allTotal('收入')}}</span>
    </div>
    <div class="totalN" v-if="type==='1'">
      <span class="text">总结余：</span>
      <span class="num">{{allTotal('总计')}}</span>
    </div>
    <div class="totalN" v-else>
      <span class="text">总合计：{{type==='-'?allTotal('支出'):allTotal('收入')}}</span>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';

  @Component
  export default class DetailBottom extends Vue {
    @Prop() type!: string;
    beforeCreate() {
      this.$store.commit('fetchRecords');
    }
    allTotal(text: string) {
      const typeRecord1 = (this.$store.state.recordList as RecordItem[]).filter(item => {
        return item.type === '-';
      });
      const total1 = typeRecord1.reduce((sum, item) => {
        return sum + item.amount;
      }, 0);
      const typeRecord2 = (this.$store.state.recordList as RecordItem[]).filter(item => {
        return item.type === '+';
      });
      const total2 = typeRecord2.reduce((sum, item) => {
        return sum + item.amount;
      }, 0);
      if (text === '支出') {
        return parseFloat(total1.toFixed(2));
      } else if (text === '收入') {
        return parseFloat(total2.toFixed(2));
      } else if (text === '总计') {
        return parseFloat((total1 + total2).toFixed(2));
      }
    }
  }
</script>

<style lang="scss" scoped>

  .head {
    line-height: 4vh;
    padding: 5px 10px;
    color: #b5b5b5;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;


    .totalN {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      font-size: 12px;

      .num {
        word-break: break-all;
      }
    }
  }
</style>