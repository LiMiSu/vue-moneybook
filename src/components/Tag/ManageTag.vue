<template>
  <div>
    <div class="tags">
      <div class="tag"
           @click="tagChang(tag.id)"
           v-for="tag in newTagList"
           :key="tag.id">
        <Icon :name=tag.tagicon></Icon>
        <span>{{tag.name}}</span>
      </div>
      <div class="addTag" @click="goAdd">
        <Icon name="add"></Icon>
        新增
      </div>
    </div>
    <router-view :key="key"></router-view>
  </div>

</template>

<script lang="ts">
  import {Component} from 'vue-property-decorator';
  import {mixins} from 'vue-class-component';
  import Button from '@/components/Button.vue';
  import TagHelper from '@/mixins/TagHelper';
  import Days from '@/components/Calender.vue';
  import MoneyType from '@/components/MoneyType.vue';
  import clone from '@/lib/clone';

  @Component({
    components: {MoneyType, Days, Button},
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
  .tags {
    background: white;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    .tag {
      min-height: 44px;
      padding-left: 16px;
      padding-right: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }

    .addTag {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }

    svg.icon {
      width: 33px;
      height: 33px;
    }

  }

</style>