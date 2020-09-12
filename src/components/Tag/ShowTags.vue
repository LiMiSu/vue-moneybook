<template>
  <div class="tags">
    <div class="tagList"
         v-for="tag in newTagList"
         :key="tag.id">
      <div class="tagIcon"
           :class="{selected: selectedLists.indexOf(tag)>=0}"
           @click="toggle(tag)">
        <Icon :name=tag.tagicon></Icon>
      </div>
      <span>{{tag.name}}</span>
    </div>
    <div class="addTag" @click="goAdd">
      <Icon name="add"></Icon>
      管理
    </div>
  </div>
</template>

<script lang="ts">
  import {Component} from 'vue-property-decorator';
  import {mixins} from 'vue-class-component';
  import TagHelper from '@/mixins/TagHelper';
  import clone from '@/lib/clone';

  @Component
  export default class Note extends mixins(TagHelper) {
    type = '-';
    selectedLists: string[] = [];

    created() {
      this.$store.commit('fetchTags');
      this.toggle(this.$store.state.tagList[0]);
    }


    // [
    //   {"id":"10","name":"衣","tagicon":"date","type":"-"},
    //   {"id":"11","name":"食","tagicon":"date","type":"-"},
    //   {"id":"12","name":"住","tagicon":"label","type":"-"},
    //   {"id":"13","name":"行","tagicon":"money","type":"-"},
    // ]


    //渲染的数据要改装一下，分类
    get tagList() {
      return this.$store.state.tagList;
    }

    get newTagList() {
      const {tagList} = this;
      return clone(tagList).filter((item: Tag) => item.type === this.$store.state.record.type);

    }

    toggle(tag: string) {
      this.selectedLists.push(tag);
      const index = this.selectedLists.indexOf(tag);
      if (index >= 0 && this.selectedLists.length > 1) {
        this.selectedLists.splice(0, 1);
      }
      this.$emit('update:value', this.selectedLists);
    }

    goAdd() {
      this.$router.push('/managetag');
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
    flex-wrap: wrap;

    .tagIcon, .addTag {
      $bg: #d9d9d9;
      background: $bg;
      $h: 36px;
      border-radius: $h/2;
      height: 36px;
      width: 45px;
      line-height: $h;
      text-align: center;

      .icon {
        background: transparent;
      }

      &.selected {
        background: darken($bg, 50%);
        color: white;
      }
    }

    svg.icon {
      width: 33px;
      height: 33px;
    }
  }
</style>