<template>
  <div class="addtag">
    <div class="navBar">
      <Icon class="leftIcon" name="left" @click="goBack"/>
      <span class="title">新增标签</span>
      <span class="rightIcon"></span>
    </div>
    <div class="form-wrapper">


      <label>
        <Input
          :value.sync="value"
          field-name="标签名"
          placeholder="标签名不要超过4个字哦"
        />
      </label>

      <div class="icon-choose">
        <div v-for="tag in addTagList" :key="tag.icon" class="wrapper">
          <Icon
            @click="tagChang(tag.icon)"
            :name="tag.icon"
            :class="{selected: currenttag===tag.icon}"
          ></Icon>
        </div>
      </div>


    </div>
    <div class="button-wrapper">
      <Button @click.native="back">取消</Button>
      <Button @click.native="createTag">添加</Button>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import Button from '@/components/Button.vue';
  import addTag from '@/constants/addTag';
  import Input from '@/components/Input.vue';

  @Component({
    components: {Input, Button}
  })
  export default class AddTags extends Vue {
    value = '';
    icon = '';
    currenttag = '';

    get addTagList() {
      return addTag.filter(item => item.type === this.$store.state.record.type);
    }

    tagChang(tag: any) {
      if (this.currenttag === tag) {
        this.currenttag = '';
        this.icon = '';
      } else {
        this.currenttag = tag;
        this.icon = tag;
      }
    }

    createTag() {

      if (this.value) {
        if (!this.icon){
          window.alert('请选泽一个标签')
          return;
        }
        if (this.value.length>4){
          window.alert('标签名不要超过4个字哦')
          return;
        }
        this.$store.commit('createTag', {name: this.value, tagicon: this.icon, type: this.$store.state.record.type});
        if (!this.$store.state.isHave) {
          window.alert('已存在');
          this.$router.replace('/managetag');
          this.$store.state.showAdd = false;
          return;
        }
        window.alert('成功');
        this.$router.replace('/managetag');
        this.$store.state.showAdd = false;
      } else if (this.value === '') {
        window.alert('标签名不能为空');
      }
    }

    goBack() {
      this.$router.replace('/managetag');
    }

    back() {
      this.$router.replace('/managetag');
    }
  }
</script>

<style lang="scss" scoped>
  .addtag {
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
    /*background: palevioletred;*/
    margin-top: 8px;

    .icon-choose {
      display: flex;
      padding: 16px 0 16px 16px;


      .icon {
        margin-right: 16px;
        padding: 2px 4px;
        $bg: #d9d9d9;
        background: $bg;
        $h: 36px;
        border-radius: $h/2;
        height: 36px;
        width: 45px;
        line-height: $h;
        text-align: center;

        &.selected {
          background: #DE7873;
          color: white;
        }
      }
    }


    input {
      padding: 10px;
      width: 100%;
      border: 1px solid rgb(217, 217, 217);
    }
  }

  .button-wrapper {
    text-align: center;
    padding: 16px;
    margin-top: 44-16px;
  }
</style>