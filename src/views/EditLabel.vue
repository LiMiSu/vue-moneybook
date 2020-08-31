<template>
  <Layout>
    <div class="navBar">
      <Icon class="leftIcon" name="left" @click="goBack"/>
      <span class="title">编辑标签</span>
      <span class="rightIcon"></span>
    </div>
    <div class="form-wrapper">
      <form-item
        :value.sync="tag.name"
        @change="updateTag"
        field-name="标签名"
        placeholder="请输入标签名"/>
    </div>
    <div class="button-wrapper">
      <Button @click="removeTag">删除标签</Button>
    </div>
  </Layout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import tagListModel from '@/models/tagListModel';
  import FormItem from '@/components/Money/FormItem.vue';
  import Button from '@/components/Button.vue';

  @Component({
    components: {Button, FormItem}
  })

  export default class EditLabel extends Vue {
    tag?: Tag = undefined;

    created() {
      const id = this.$route.params.id;
      tagListModel.fetch();
      const tags = tagListModel.data;
      const tag = tags.filter(t => t.id === id)[0];
      if (tag) {
        this.tag = tag;
      } else {
        this.$router.replace('/404');
      }
    }

    updateTag() {
      if (this.tag) {
        const changeMessage = tagListModel.update(this.tag.id, this.tag.name);
        if (changeMessage) {
          window.alert('更改成功');
        } else {
          window.alert('更新失败');
        }
      }
    }

    removeTag() {
      if (this.tag) {
        const removeMessage = tagListModel.remove(this.tag.id);
        if (removeMessage) {
          window.alert('删除成功');
        } else {
          window.alert('删除失败');
        }

      }
    }

    goBack() {
      this.$router.back();
    }
  }

</script>

<style lang="scss" scoped>
  .navBar {
    text-align: center;
    font-size: 16px;
    padding: 12px 16px;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .leftIcon {
      width: 16px;
      height: 16px;
      color: #666;
    }

    .rightIcon {
      width: 16px;
      height: 16px;
    }

    .title {

    }
  }

  .form-wrapper {
    background: white;
    margin-top: 8px;
  }

  .button-wrapper {
    text-align: center;
    padding: 16px;
    margin-top: 44-16px;
  }
</style>