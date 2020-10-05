<template>
  <div>
    <div class="metagList" @click="goAdd">
      <Icon name="manage" class="addTag"></Icon>管理
    </div>
    <div>
      <div class="choosetag">请选择{{$route.params.id?($store.state.currentRecord.type==='-'?'支出':'收入'):($store.state.record.type==='-'?'支出':'收入')}}标签：</div>
    </div>
    <div class="tags">
      <div class="tagList" v-for="tag in newTagList" :key="tag.id">
        <Icon class="tagIcon" :name=tag.tagicon :class="{selected: currentTag.id===tag.id}" @click="toggle(tag)"></Icon>
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
    created() {
      this.$store.state.go=0
      this.$store.commit('fetchTags');
      this.$store.commit('setCurrentRecord', this.$route.params.id);
      if (this.$route.params.id && this.$store.state.currentRecord.tag.tagicon) {
        this.$store.state.currentTag = this.$store.state.currentRecord.tag;
      } else {
        this.$store.state.currentTag=''
        this.$store.state.record.notes = '';
      }
    }

    beforeUpdate() {
      this.$store.state.record.notes = '';
      if (this.currentTag.type && this.$store.state.record.type === this.currentTag.type) {
        this.$emit('update:value', this.currentTag);
      } else if(!this.$route.params.id){
        this.currentTag = '';
        this.$emit('update:value', []);
      }
    }

    get tagList() {
      return this.$store.state.tagList;
    }

    get newTagList() {
      const {tagList} = this;
      if (this.$route.params.id) {
        return clone(tagList).filter((item: Tag) => item.type === this.$store.state.currentRecord.type);
      } else {
        return clone(tagList).filter((item: Tag) => item.type === this.$store.state.record.type);
      }
    }

    get currentTag() {
      return this.$store.state.currentTag;
    }

    set currentTag(tag) {
      this.$store.state.currentTag = tag;
    }


    toggle(tag: Tag) {
      if (this.currentTag === tag && !this.$route.params.id) {
        this.currentTag = '';
        this.$emit('update:value', []);
      } else {
        this.currentTag = tag;
        this.$route.params.id?this.$store.state.currentRecord.tag = tag:''
      }
    }

    goAdd() {
      console.log(9);
      this.$store.state.go++
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
        $h: 36px;
        border-radius: $h/4;
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