<template>
  <div class="tabs" :class="{[classPrefix+'-tabs']:classPrefix}">
    <div class="tabs-type"
         v-for="tab in dataSource"
         :key="tab.value"
         :class="liClass(tab)"
         @click="select(tab)"
    >
      <span>{{tab.text}}</span>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';



  @Component
  export default class Tabs extends Vue {
    @Prop({required: true, type: Array})
    dataSource!: DataSourceItem[];

    @Prop(String)
    readonly value!: string;
    // value: $store.state.record.type  也就是'+'/'-'

    @Prop(String)
    classPrefix?: string;
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
    background: rgb(243,243,243);
    color: #767676;
    display: flex;
    /*font-size: 24px;*/
    &-type {
      width: 50%;
      min-height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      /*position: relative;*/

      &.selected{
        background: rgb(246,234,212);
        color: black;
      }
      .icon{
        width: 24px;
        height: 24px;
      }
      /*&.selected::after {*/
      /*  content: '';*/
      /*  position: absolute;*/
      /*  bottom: 0;*/
      /*  left: 0;*/
      /*  width: 100%;*/
      /*  height: 4px;*/
      /*  background: #333;*/
      /*}*/
    }
  }
</style>