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
      <button @click="create">新增标签</button>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import store from '@/store/tagStore';

  @Component({
    computed: {
      tagList() {
        return store.tagList;
      }
    }
  })
  export default class Note extends Vue {
    selectedLists: string[] = [];

    toggle(tag: string) {
      const index = this.selectedLists.indexOf(tag);
      if (index >= 0) {
        this.selectedLists.splice(index, 1);
      } else {
        this.selectedLists.push(tag);
      }
      this.$emit('update:value', this.selectedLists);
    }

    create() {
      store.createTag(name);
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