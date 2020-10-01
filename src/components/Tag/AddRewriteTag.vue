<template>
  <div class="rewrite">
    <div class="navBar">
      <Icon class="leftIcon" name="left" @click="goBack"/>
      <span class="title" v-if="$route.params.id">编辑标签</span>
      <span class="title" v-else>新增标签</span>
      <span class="rightIcon"></span>
    </div>
    <div class="form-wrapper">
      <label v-if="$route.params.id">
        <Input
          :tagName="currentTag.name"
          :value.sync="valueDat"
          field-name="标签名"
          placeholder="1-4个字符"
        />
      </label>
      <label v-else>
        <Input
          :value.sync="value"
          field-name="标签名"
          placeholder="1-4个字符"
        />
      </label>
      <div class="icon-choose">
        <div v-for="tag in rewriteTagList" :key="tag.icon" class="wrapper">
          <Icon
            @click="tagChang(tag.icon)"
            :name="tag.icon"
            :class="{selected: currenttag===tag.icon}"
          ></Icon>
        </div>
      </div>
    </div>
    <div class="button-wrapper" v-if="$route.params.id">
      <Button @click="removeTag">删除</Button>
      <Button @click.native="updateTag">更改</Button>
    </div>
    <div class="button-wrapper" v-else>
      <Button @click.native="back">取消</Button>
      <Button @click.native="createTag">添加</Button>
    </div>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import Input from '@/components/Input.vue';
  import Button from '@/components/Button.vue';
  import addTag from '@/constants/addTag';
  import {NavigationGuardNext, Route} from 'vue-router';

  @Component({
    components: {Button, Input},
  })

  export default class EditLabel extends Vue {
    value = '';
    valueDat!: string;
    currenttag = '';
    icon = '';

    get rewriteTagList() {
      return addTag.filter(item => item.type === this.$store.state.record.type);
    }

    get currentTag() {
      return this.$store.state.currentTag;
    }

    created() {
      if (this.$route.params.id) {
        const id = this.$route.params.id;
        this.$store.commit('fetchTags');
        this.$store.commit('setCurrentTag', id);
        this.valueDat = this.currentTag.name;
        if (!this.currentTag) {
          this.$router.replace('/404');
        }
      }
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

    updateTag() {
      if (this.currentTag) {
        if (this.icon && this.valueDat !== this.currentTag.name) {
          this.currentTag.tagicon = this.icon;
        }
        this.$store.commit('updateTag', {
          id: this.currentTag.id,
          name: this.valueDat,
          tagicon: this.currentTag.tagicon || this.icon
        });
      }
    }

    removeTag() {
      if (this.currentTag) {
        this.$store.commit('removeTag', this.currentTag.id);
      }
    }

    goBack() {
      this.$store.state.showAdd = false;
      this.$router.replace('/managetag');
    }


    createTag() {

      if (this.value) {
        if (!this.icon) {
          window.alert('请选泽一个标签');
          return;
        }
        if (this.value.length > 4) {
          window.alert('标签名不要超过4个字哦');
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

    back() {
      this.$store.state.showAdd = false;
      this.$router.replace('/managetag');
    }

  }

</script>

<style lang="scss" scoped>
  .navBar {
    text-align: center;
    font-size: 16px;
    padding: 12px 16px;
    background: rgb(243,243,243);
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
  }

  .button-wrapper {
    text-align: center;
    padding: 16px;
    margin-top: 44-16px;
  }
</style>