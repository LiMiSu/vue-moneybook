<template>
  <div>
    <div><Icon name="zuo"></Icon></div>
    <label>
      <input type="text"  v-model="value">
    </label>
    <Icon name="add" @click.native="createTag"></Icon>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  @Component
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
        this.$router.back()
      } else if (this.value === '') {
        window.alert('标签名不能为空');
      }
    }
  }
</script>

<style lang="scss" scoped>
input{
  border: 1px solid red;
}
</style>