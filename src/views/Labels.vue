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
        <Button @click.native="createTag">新建标签</Button>
      </div>
    </layout>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {mixins} from 'vue-class-component';
  import Button from '@/components/Button.vue';
  import TagHelper from '@/mixins/TagHelper';

  @Component({
    components: {Button},
    computed: {
      tags() {
        return this.$store.state.tagList;
      }
    }
  })
  export default class Labels extends mixins(TagHelper) {
    created() {
      this.$store.commit('fetchTags');
    }

    createTag() {
      const name = window.prompt('请输入标签名');
      if (name) {
        this.$store.commit('createTag',name);
          window.alert('标签添加成功');
      }else if (name === '') {
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