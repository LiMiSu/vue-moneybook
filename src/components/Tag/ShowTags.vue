<template>
  <div>
    <div class="metagList" @click="goAdd">
      <Icon name="manage" class="addTag"></Icon>
      管理
    </div>
    <div>
      <div class="choosetag">请选择{{this.$store.state.record.type==='-'?'支出':'收入'}}类目：</div>
    </div>
    <div class="tags">
      <div class="tagList"
           v-for="tag in newTagList"
           :key="tag.id">
        <Icon class="tagIcon" :name=tag.tagicon
              :class="{selected: selectedLists.indexOf(tag)>=0}"
              @click="toggle(tag)">
        </Icon>
        <span :class="[tag.name.length===4?'small':'']">{{tag.name}}</span>
      </div>
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
    selectedLists: string[] = [];

    created() {
      this.$store.commit('fetchTags');
    }
    get tagList() {
      return this.$store.state.tagList;
    }

    get newTagList() {
      const {tagList} = this;
      return clone(tagList).filter((item: Tag) => item.type === this.$store.state.record.type);
    }


    toggle(tag: string) {
      const index = this.selectedLists.indexOf(tag);
      if (index >= 0 && this.selectedLists.length === 1) {
        this.selectedLists.splice(0, 1);
      }else {
        this.$set(this.selectedLists, 0, tag);
      }
      this.$emit('update:value', this.selectedLists);
    }

    goAdd() {
      this.$router.push('/managetag');
    }
  }
</script>

<style lang="scss" scoped>
  .choosetag {
    padding: 10px 16px 0 16px;
  }

  .tags {
    font-size: 14px;
    padding: 16px;
    display: flex;
    flex-wrap: wrap;

    .tagList {
      width: 20%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .tagIcon {
        $bg: rgb(246, 234, 212);
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
          background: #DE7873;
          color: white;
        }
      }

      .small {
        font-size: 12px;
      }
    }


    svg.icon {
      width: 33px;
      height: 33px;
    }
  }

  .metagList {
    font-size: 14px;
    margin-left: 16px;
    margin-top: 10px;
    width: 20%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .addTag {
      $bg: rgb(246, 234, 212);
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
        background: #DE7873;
        color: white;
      }
    }
  }
</style>