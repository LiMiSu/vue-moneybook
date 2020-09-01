<template>
  <div class="tags">
    <ul class="current">
      <li
        v-for="tag in dataSource"
        :key="tag.id"
        :class="{selected: value.indexOf(tag)>=0}"
        @click="toggle(tag)">
        {{ tag.name }}
      </li>
    </ul>
    <div class="new">
      <button @click="create">新增标签</button>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';

  @Component
  export default class Note extends Vue {
    @Prop() readonly dataSource: string[] | undefined;
    @Prop() readonly value!: string[];

    toggle(tag: string) {
      const index = this.value.indexOf(tag);
      if (index >= 0) {
        this.value.splice(index, 1);
      } else {
        this.value.push(tag);
      }
      this.$emit('update:value', this.value);
    }

    create() {
      const name = window.prompt('请输入标签名');
      if (name === null) {
        return;
      }
      if (name === '') {
        window.alert('标签名不能为空');
        return;
      }
      if (this.dataSource) {
        if (this.dataSource.indexOf(name!) >= 0) {
          window.alert('该标签已经存在');
          return;
        }
        this.$emit('update:dataSource', [...this.dataSource, {id: name, name: name}]);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tags {
    background: white;
    font-size: 14px;
    padding: 16px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .current {
      display: flex;
      flex-wrap: wrap;
      overflow: auto;

      li {
        $bg: #d9d9d9;
        background: $bg;
        padding: 0 16px;
        margin-right: 12px;
        margin-top: 4px;
        $h: 24px;
        border-radius: $h/2;
        height: $h;
        line-height: $h;

        &.selected {
          background: darken($bg, 50%);
          color: white;
        }
      }
    }

    .new {
      padding-top: 16px;

      button {
        background: transparent;
        border: none;
        color: #999;
        border-bottom: 1px solid;
        padding: 0 4px;
      }
    }
  }
</style>