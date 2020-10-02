<template>
  <div class="dayBook" @click="$store.state.showBody=!$store.state.showBody">
    <div class="left"></div>
    {{dayValue}}
    <div class="right"></div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import dayjs from 'dayjs';

  @Component
  export default class DayBook extends Vue {
    get dayValue() {
      if (this.$route.params.id) {
        return dayjs(this.$store.state.currentRecord.createdAt).isSame(dayjs(new Date()), 'year') ?
          dayjs(this.$store.state.currentRecord.createdAt).format('M-D')
          : dayjs(this.$store.state.currentRecord.createdAt).format('YYYY-M-D');

      } else {
        return dayjs(this.$store.state.record.createdAt).isSame(dayjs(new Date()), 'year') ?
          dayjs(this.$store.state.record.createdAt).format('M-D')
          : dayjs(this.$store.state.record.createdAt).format('YYYY-M-D');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dayBook {
    border: 1px solid #5a5a5a;
    border-radius: 3px 3px 3px 3px;
    background: white;
    position: relative;
    font-size: 12px;
    line-height: 22px;
    text-align: center;
    padding: 1px 5px;

    .left {
      position: absolute;
      left: 5px;
      top: -5px;
      width: 0;
      height: 10px;
      border: 1px solid #5a5a5a;
    }

    .right {
      position: absolute;
      right: 5px;
      top: -5px;
      width: 0;
      height: 10px;
      border: 1px solid #5a5a5a;
    }
  }
</style>