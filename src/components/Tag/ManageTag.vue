<template>
  <div class="manege-tag">
    <header>
      <div class="addheader">
        <Icon name="left" class="left" @click="goBack"></Icon>
        <div class="header">编辑与新增</div>
        <span class="icon off"></span>
      </div>
    </header>

    <main class="main">
      <div class="text-nav">点击新增{{this.$store.state.record.type==='-'?'支出':'收入'}}标签：</div>
      <div class="add">
        <div class="tagList" @click="goAdd">
          <Icon name="add" class="addTag" :class="{selected: $store.state.showAdd}"></Icon>
          <span class="text">新增</span>
        </div>
      </div>
      <div class="text-nav">点击编辑{{this.$store.state.record.type==='-'?'支出':'收入'}}标签：</div>
      <div class="tags">
        <div class="tagList" v-for="tag in newTagList" :key="tag.id" @click="tagChang(tag)">
          <Icon :name=tag.tagicon class="tagIcon" :class="{selected: currenttag===tag}" ></Icon>
          <span class="text" :class="[tag.name.length===4?'small':'']">{{tag.name}}</span>
        </div>
      </div>
    </main>

    <footer>
      <!--      <router-view :key="key"></router-view>-->
    </footer>
  </div>
</template>

<script lang="ts">
  import {Component} from 'vue-property-decorator';
  import {mixins} from 'vue-class-component';
  import Button from '@/components/Button.vue';
  import TagHelper from '@/mixins/TagHelper';
  import Days from '@/components/Calender.vue';
  import clone from '@/lib/clone';

  @Component({
    components: {Days, Button},
  })
  export default class Labels extends mixins(TagHelper) {
    currenttag = '';


    created() {
      this.$store.commit('fetchTags');
      this.$store.state.showAdd = false;
      this.$store.commit('fetchGo')
    }

    get tagList() {
      return this.$store.state.tagList;
    }

    get newTagList() {
      const {tagList} = this;
      return clone(tagList).filter((item: Tag) => item.type === this.$store.state.record.type);

    }

    goAdd() {
      this.currenttag = '';
      this.$store.state.showAdd = !this.$store.state.showAdd;
      if (this.$store.state.showAdd) {
        this.$store.commit('setGo',1)
        this.$router.push('/addrewrite');
      } else {
        // this.$router.push('/managetag');
      }
    }

    tagChang(tag: any) {
      this.$store.state.showAdd = false;
      if (this.currenttag === tag) {
        // this.currenttag = '';
        // this.$router.push('/managetag');
      } else {
        this.$store.commit('setGo',1)
        this.currenttag = tag;
        this.$router.push('/addrewrite/' + tag.id);
      }
    }

    goBack() {
      this.$router.go(-(this.$store.state.go + 1));
    }
  }

</script>
<style lang="scss" scoped>
  .manege-tag {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .addheader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    height: 6vh;
    border-bottom: 1px solid rgb(243, 243, 243);
    background: #fff;

    .header {
      background: #fff;
    }

    .icon.left, .icon.off {
      width: 24px;
      height: 24px;
      margin: 0 16px;
    }
  }

  .main {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    flex: 1;

    .tags {
      font-size: 14px;
      padding: 16px;
      display: flex;
      flex-wrap: wrap;
    }

    .tagList {
      width: 20%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .text{
        padding: 16px 0;
        background: #fff;
        margin-bottom: 20px;
      }
    }

    .tagIcon, .addTag {
      $h: 32px;
      border-radius: $h/12;
      height: $h;
      width: $h;
      line-height: $h;
      text-align: center;

      .icon {
        background: transparent;
      }
    }

    .selected {
      background: #DE7873;
      color: white;
    }

    .add {
      padding: 16px;
    }

    .small {
      font-size: 12px;
    }

    .text-nav {
      background: rgb(243, 243, 243);
      box-shadow: 0 3px 11px -9px #999;
      padding: 10px 16px 0 16px;
    }
  }

  footer {

  }
</style>