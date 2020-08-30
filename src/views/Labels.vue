<template>
  <div>
    <layout>
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
        <button class="createTag" @click="createTag">新建标签</button>
      </div>
    </layout>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch, Prop} from 'vue-property-decorator';
  import tagListModel from '@/models/tagListModel';

  tagListModel.fetch();
  @Component
  export default class Note extends Vue {
    tags = tagListModel.data;

    createTag() {
      const name = window.prompt('请输入标签名');
      if (name) {
        const message = tagListModel.create(name);
        if (message === 'duplicated') {
          window.alert('该标签已存在');
        }else if (message==='success'){
          window.alert('标签添加成功')
        }
      }else {
        window.alert('标签名不能为空')
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

  .createTag {
    background: #767676;
    color: white;
    border: none;
    border-radius: 4px;
    height: 40px;
    padding: 0 16px;

    &-wrapper {
      text-align: center;
      line-height: 40px;
      padding: 16px;
      margin-top: 44-16px;
    }
  }
</style>