<template>
  <div class="manege-tag">
    <header>
      <div class="addheader">
        <Icon name="left" class="left" @click="goBack"></Icon>
        <div class="header">
          编辑与新增
        </div>
        <span class="icon off"></span>
      </div>
    </header>

    <main class="main">
      <div class="text">点击新增类目：</div>
      <div class="add">
        <div class="tagList" @click="goAdd">
          <Icon name="add" class="addTag" :class="{selected: $store.state.showAdd}"></Icon>
          新增
        </div>
      </div>
      <div class="text">点击编辑类目：</div>
      <div class="tags">
        <div class="tagList"
             v-for="tag in newTagList"
             :key="tag.id">
          <Icon
            class="tagIcon"
            :class="{selected: selectedLists.indexOf(tag)>=0}"
            @click="tagChang(tag)"
            :name=tag.tagicon
          ></Icon>
          <span :class="[tag.name.length===4?'small':'']">{{tag.name}}</span>
        </div>
      </div>
    </main>

    <footer>
      <router-view :key="key"></router-view>
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
    selectedLists: string[] = [];

    created() {
      this.$store.commit('fetchTags');
      this.$router.replace('/managetag');
    }


    get tagList() {
      return this.$store.state.tagList;
    }

    get newTagList() {
      const {tagList} = this;
      return clone(tagList).filter((item: Tag) => item.type === this.$store.state.record.type);

    }

    get key() {
      return this.$route.path + Math.random();
    }

    goAdd() {
      this.$store.state.showAdd = !this.$store.state.showAdd;
      if (this.$store.state.showAdd) {
        this.$router.replace('/addtags');
      } else {
        this.$router.replace('/managetag');
      }
    }

    tagChang(tag: any) {
      const index = this.selectedLists.indexOf(tag);
      if (index >= 0 && this.selectedLists.length === 1) {
        this.selectedLists.splice(0, 1);
      } else {
        this.$set(this.selectedLists, 0, tag);
      }
      console.log(this.selectedLists);
    }

    goBack() {
      this.$router.replace('/addmoney');
    }
  }
  // if (this.selectedLists.indexOf(tag)>=0){
  //   this.$router.push('/managetag/rewrite/' + tag.id);
  // }
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
    }

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

    .text {
      padding: 0 16px;
      background: #d9d9d9;
    }
  }

  footer {

  }
</style>