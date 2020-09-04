<template>
  <layout>
    <Tabs class-prefix="type" :data-source="typeList" :value.sync="type"/>
    <Tabs class-prefix="interval" :data-source="intervalList" :value.sync="interval"/>
  </layout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Types from '@/components/Money/Types.vue';
  import {Component} from 'vue-property-decorator';
  import Tabs from '@/components/Tabs.vue';
  import typeList from '@/constants/typeList';
  import intervalList from '@/constants/intervalList';

  @Component({
    components: {Tabs, Types},
  })
  export default class Statistics extends Vue {
    type = '-';
    interval = 'day';
    intervalList = intervalList;
    typeList = typeList
  }
</script>

<style lang="scss" scoped>
  ::v-deep .type-type {
    background-color: white;

    &.selected {
      background: #c4c4c4;

      &::after {
        display: none;
      }
    }
  }

  ::v-deep .interval-type {
    background-color: white;

    &.selected {
      background: #c4c4c4;

      &::after {
        display: none;
      }
    }
  }
</style>