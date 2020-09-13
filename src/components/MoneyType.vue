<template>
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



  @Component
  export default class Tabs extends Vue {
    @Prop({required: true, type: Array})
    dataSource!: DataSourceItem[];
    // dataSource：
            // [{
            //   text: '收入';
            //   value: '+'
            // },
            // {
            //   text: '支出';
            //   value: '-'
            // }]
            //

    @Prop(String)
    readonly value!: string;
    // value: $store.state.record.type  也就是'+'/'-'

    @Prop(String)
    classPrefix?: string;
    // classPrefix?: 父組件传过来的一个 ‘type‘ 常量，不是变量
    //给组件设置一个前缀的吧:class="{[classPrefix+'-tabs']:classPrefix}"
    //加前缀是为了在统计页面中或者其他页面deep设置样式

    //其实就是class的封装：:class="[{[classPrefix+'-tabs']:classPrefix},{selected: tab.value === this.value}]"
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