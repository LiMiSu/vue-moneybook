<template>
  <div class="addtag">
    <div class="navBar">
      <Icon class="leftIcon" name="left" @click="goBack"/>
      <span class="title">新增标签</span>
      <span class="rightIcon"></span>
    </div>
    <div class="form-wrapper">
      <label>
        <input type="text"  v-model="value" placeholder="请输入标签名">
      </label>
    </div>
    <div class="button-wrapper">
      <Button @click.native="back">取消</Button>
      <Button @click.native="createTag">确认</Button>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import Button from '@/components/Button.vue';
  @Component({
    components: {Button}
  })
  export default class AddTags extends Vue {
    value=''
    icon=''
    createTag() {
      if (this.value) {
        this.$store.commit('createTag', {name:this.value, tagicon: this.icon, type: this.$store.state.record.type});
        if (!this.$store.state.isHave) {
          window.alert('该标签已存在');
          return;
        }
        window.alert('标签添加成功');
        this.$router.replace('/managetag')
      } else if (this.value === '') {
        window.alert('标签名不能为空');
      }
    }
    goBack(){
      this.$router.replace('/managetag')
    }
    back(){
      this.$router.replace('/managetag')
    }
  }
</script>

<style lang="scss" scoped>
  .addtag{
    background: papayawhip;
  }
  .navBar {
    text-align: center;
    font-size: 16px;
    padding: 12px 16px;
    background: palevioletred;
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
    background: palevioletred;
    margin-top: 8px;
    input{
      padding: 10px;
      width: 100%;
      border: 1px solid rgb(217,217,217);
    }
  }

  .button-wrapper {
    text-align: center;
    padding: 16px;
    margin-top: 44-16px;
  }
</style>