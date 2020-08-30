<template>
  <div>
    <layout>
      <ol class="tags">
        <li v-for="tag in tags" :key="tag">
          <span>{{tag}}</span>
          <Icon name="right"/>
        </li>
      </ol>
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
  console.log(tagListModel.data);
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
      }
    }
  }

</script>
<style lang="scss" scoped>
  .tags {
    background: white;
    font-size: 16px;

    li {
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