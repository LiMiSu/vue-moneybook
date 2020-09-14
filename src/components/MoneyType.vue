<template>
  <div class="tabs" :class="{[classPrefix+'-tabs']:classPrefix}">
    <div class="tabs-type"
         v-for="tab in dataSource"
         :key="tab.value"
         :class="liClass(tab)"
         @click="select(tab)"
    >
      <Icon :name="tab.text">
      </Icon>
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
    background: rgb(197,179,142);
    display: flex;
    /*font-size: 24px;*/
    &-type {
      width: 50%;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      /*position: relative;*/

      &.selected{
        background: rgb(246,234,212);
      }
      .icon{
        width: 30px;
        height: 30px;
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