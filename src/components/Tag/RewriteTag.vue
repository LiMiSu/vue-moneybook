<template>
  <div>
    <div class="navBar">
      <Icon class="leftIcon" name="left" @click="goBack"/>
      <span class="title">编辑标签</span>
      <span class="rightIcon"></span>
    </div>
    <div class="form-wrapper">
      <form-item
        :tagName="currentTag.name"
        :value.sync="valueDat"
        field-name="标签名"
        placeholder="请输入标签名"/>
    </div>
    <div class="button-wrapper">
      <Button @click="removeTag">删除标签</Button>
      <Button @click.native="updateTag">确认更改</Button>
    </div>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import FormItem from '@/components/Input.vue';
  import Button from '@/components/Button.vue';

  @Component({
    components: {Button, FormItem},
  })

  export default class EditLabel extends Vue {

    valueDat!: string;

    get currentTag() {
      return this.$store.state.currentTag;
    }

    created() {
      const id = this.$route.params.id;
      this.$store.commit('fetchTags');
      this.$store.commit('setCurrentTag', id);
      this.valueDat = this.currentTag.name;
      if (!this.currentTag) {
        this.$router.replace('/404');
      }
    }

    updateTag() {
      if (this.currentTag) {
        this.$store.commit('updateTag', {id: this.currentTag.id, name: this.valueDat});
      }
    }

    removeTag() {
      if (this.currentTag) {
        this.$store.commit('removeTag', this.currentTag.id);
      }
    }
    goBack(){
      this.$router.replace('/managetag')
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