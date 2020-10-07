<template>
  <div class="rewrite">
    <div class="navBar">
      <Icon class="leftIcon" name="left" @click="goBack"/>
      <span class="title" v-if="$route.params.id">编辑{{this.$store.state.record.type==='-'?'支出':'收入'}}标签</span>
      <span class="title" v-else>新增{{this.$store.state.record.type==='-'?'支出':'收入'}}标签</span>
      <span class="rightIcon"></span>
    </div>
    <Succeed v-if="$store.state.isSucceed"></Succeed>
    <Fail v-if="$store.state.isFail"></Fail>
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
  import Succeed from '@/components/Succeed.vue';
  import Fail from '@/components/Fail.vue';
  import createId from '@/lib/createId';

  @Component({
    components: {Fail, Succeed, Button, Input},
  })

  export default class EditLabel extends Vue {
    value = '';
    valueDat!: string;
    currenttag = '';
    icon = '';
    id = createId().toString();


    get rewriteTagList() {
      return addTag.filter(item => item.type === this.$store.state.record.type);
    }

    get currentTag() {
      return this.$store.state.currentTag;
    }

    beforeCreate() {
      this.$store.commit('fetchTags');
    }

    created() {
      this.$store.commit('fetchGo');
      if (this.$route.params.id) {
        const id = this.$route.params.id;
        this.$store.commit('fetchTags');
        this.$store.commit('setCurrentTag', id);
        if ((this.$store.state.tagList as Tag[]).map(item => item.id).indexOf(this.$route.params.id) < 0) {
          this.$router.replace('/404');
        } else {
          this.valueDat = this.currentTag.name;
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
        if (!this.icon && this.valueDat === this.currentTag.name) {
          this.$store.state.isFail = '没修改任何信息';
          return;
        } else if (this.icon && this.valueDat) {
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
      this.$store.commit('setGo', -1);
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
          this.$store.state.isFail = '请选泽一个标签';
          return;
        }
        if (this.value.length > 4) {

          return;
        }
        this.$store.commit('createTag', {name: this.value, tagicon: this.icon, type: this.$store.state.record.type});
        if (!this.$store.state.isHave) {
          this.$store.state.isFail = '已存在';
          this.$store.state.showAdd = false;
          return;
        }
        this.$store.state.isSucceed = '新增标签成功！';
        this.$store.state.showAdd = false;
        this.$store.commit('setGo', -1);
      } else if (this.value === '') {
        this.$store.state.isFail = '标签名不能为空';
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
    border-bottom: 1px solid rgb(243, 243, 243);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;

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
      background: #fff;
      font-weight: bold;
    }
  }

  .form-wrapper {
    margin-top: 8px;

    .icon-choose {
      display: flex;
      padding: 16px 0 16px 16px;

      .icon {
        margin-right: 16px;
        padding: 2px 4px;
        $bg: rgb(243, 243, 243);
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