<template>
  <!--  新建标签组件-->
  <div>
    <Tabs :data-source="typeList"></Tabs>
    <div class="tags">
      <div class="tag"
           @click="tagList(tag.id)"
           v-for="tag in tags"
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
  import Days from '@/components/Days.vue';
  import Tabs from '@/components/Tabs.vue';
  import typeList from '@/constants/typeList';

  @Component({
    components: {Tabs, Days, Button},
    computed: {
      tags() {
        return this.$store.state.tagList;
      }
    }
  })
  export default class Labels extends mixins(TagHelper) {
    typeList = typeList;

    get key() {
      return this.$route.path + Math.random();
    }

    created() {
      this.$store.commit('fetchTags');
    }

    goAdd() {
      this.$router.push('/addtags');
    }

    tagList(id: string) {
      this.$router.push('/labels/edit/' + id);
    }

    beforeRouteUpdate(to: any, from: any, next: any) {
      const id = to.params.id; //to就是你要去的页面的信息
      this.tagList(id); //再执行一遍
      next();
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