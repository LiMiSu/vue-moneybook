<template>
  <div class="manege-tag">
    <header>
      <div>编辑与新增</div>
    </header>

    <main class="main">
      <div class="tags">
        <div class="tagList"
             @click="tagChang(tag.id)"
             v-for="tag in newTagList"
             :key="tag.id">
          <Icon :name=tag.tagicon class="tagIcon"></Icon>
          <span :class="[tag.name.length===4?'small':'']">{{tag.name}}</span>
        </div>
        <div class="addTag tagList" @click="goAdd">
          <Icon name="add"></Icon>
          新增
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
    created() {
      this.$store.commit('fetchTags');
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

    get key() {
      return this.$route.path + Math.random();
    }

    goAdd() {
      this.$router.replace('/addtags');
    }

    tagChang(id: string) {
      this.$router.replace('/managetag/rewrite/' + id);
    }
  }

</script>
<style lang="scss" scoped>
  .manege-tag{
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  header {
    display: flex;
    flex-direction: column;
    height: 52px;
    text-align: center;
    font-size: 20px;
    line-height: 50px;
  }

  .main{
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    flex: 1;
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

        .small {
          font-size: 12px;
        }
      }
    }
  }





</style>