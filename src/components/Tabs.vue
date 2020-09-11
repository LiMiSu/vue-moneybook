<template>
<!--  标签展示选择组件-->
  <ul class="tabs" :class="{[classPrefix+'-tabs']:classPrefix}">
    <li
      v-for="tab in dataSource"
      :key="tab.value"
      class="tabs-type"
      :class="liClass(tab)"
      @click="select(tab)"
    >{{ tab.text }}
    </li>
  </ul>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';

  type DataSourceItem = { text: string; value: string }

  @Component
  export default class Tabs extends Vue {
    @Prop({required: true, type: Array})
    dataSource!: DataSourceItem[];
    @Prop(String)
    readonly value!: string;
    @Prop(String)
    classPrefix?: string;

    // created() {
    // }
    liClass(tab: DataSourceItem) {
      return {
        [this.classPrefix + '-type']: this.classPrefix, selected: tab.value === this.value
      };
    }

    select(tab: DataSourceItem) {
      this.$emit('update:value', tab.value);
    }
  }
</script>

<style lang="scss" scoped>
  .tabs {
    background: #c4c4c4;
    display: flex;
    font-size: 24px;

    &-type {
      width: 50%;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      &.selected::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: #333;
      }
    }
  }
</style>