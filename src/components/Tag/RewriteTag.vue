<template>
  <div class="rewrite">
    <div class="navBar">
      <Icon class="leftIcon" name="left" @click="goBack"/>
      <span class="title">编辑标签</span>
      <span class="rightIcon"></span>
    </div>
    <div class="form-wrapper">


      <label>
        <Input
          :tagName="currentTag.name"
          :value.sync="valueDat"
          field-name="标签名"
          placeholder="标签名不要超过4个字哦"
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
    <div class="button-wrapper">
      <Button @click="removeTag">删除</Button>
      <Button @click.native="updateTag">更改</Button>
    </div>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import Input from '@/components/Input.vue';
  import Button from '@/components/Button.vue';
  import addTag from '@/constants/addTag';

  @Component({
    components: {Button, Input},
  })

  export default class EditLabel extends Vue {
    valueDat!: string;
    currenttag = '';
    icon=''
    get rewriteTagList() {
      return addTag.filter(item => item.type === this.$store.state.record.type);
    }
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
        if(this.icon&&this.valueDat!==this.currentTag.name){
          this.currentTag.tagicon=this.icon
        }
        this.$store.commit('updateTag', {id: this.currentTag.id, name: this.valueDat, tagicon: this.currentTag.tagicon||this.icon});
      }
    }

    removeTag() {
      if (this.currentTag) {
        this.$store.commit('removeTag', this.currentTag.id);
      }
    }

    goBack() {
      this.$router.replace('/managetag');
    }
  }

</script>

<style lang="scss" scoped>
  .rewrite {
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
      .icon{
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