<template>
  <!--  新建标签组件-->
  <layout>
    <template #header>
      <Tabs :data-source="typeList" ></Tabs>
    </template>

    <template #main>


      <div class="tags">
        <router-link class="tag"
                     :to="`/labels/edit/${tag.id}`"
                     v-for="tag in tags"
                     :key="tag.id">
          <span>{{tag.name}}</span>
          <Icon name="right"/>
        </router-link>
      </div>


      <div class="createTag-wrapper">
        <Button @click.native="createTag">新建标签</Button>
      </div>
    </template>
  </layout>
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

    created() {
      this.$store.commit('fetchTags');
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
    font-size: 16px;

    .tag {
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 16px;
      padding-right: 16px;
      border-bottom: 1px solid #e6e6e6;

      svg {
        width: 16px;
        height: 16px;
        color: #666;
      }
    }
  }

  .createTag-wrapper {
    text-align: center;
    line-height: 40px;
    padding: 16px;
    margin-top: 44-16px;
  }
</style>