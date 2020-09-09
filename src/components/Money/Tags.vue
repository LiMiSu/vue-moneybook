<template>
  <div class="tags">
    <ul class="current">
      <li
        v-for="tag in tagList"
        :key="tag.id"
        :class="{selected: selectedLists.indexOf(tag)>=0}"
        @click="toggle(tag)">
        {{ tag.name }}
      </li>
    </ul>
    <div class="new">
      <button @click="createTag">新增标签</button>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {mixins} from 'vue-class-component';
  import TagHelper from '@/mixins/TagHelper';

  @Component({
    computed: {
      tagList() {
        return this.$store.state.tagList;
      }
    }
  })
  export default class Note extends mixins(TagHelper) {
    selectedLists: string[] = [];

    created() {
      const tagList = this.$store.commit('fetchTags');
      this.toggle(this.$store.state.tagList[0]);
    }

    toggle(tag: string) {
      this.selectedLists.push(tag);
      const index = this.selectedLists.indexOf(tag);
      if (index >= 0 && this.selectedLists.length > 1) {
        this.selectedLists.splice(0, 1);
      }
      this.$emit('update:value', this.selectedLists);
    }

    createTag() {
      const name = window.prompt('请输入标签名');
      if (name) {
        this.$store.commit('createTag', name);
        if (!this.$store.state.isHave) {
          window.alert('该标签已存在');
          return;
        }
        window.alert('标签添加成功');
      } else if (name === '') {
        window.alert('标签名不能为空');
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