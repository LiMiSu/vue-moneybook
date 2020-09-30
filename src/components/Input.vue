<template>
  <div class="wrapper">
    <label class="formItem">
      <Icon v-if="fieldName==='备注'" name="notes" class="notes"></Icon>
      <span v-else class="name">{{fieldName}}</span>
      <input
        :type="type || 'text'"
        :value="tagName||value"
        :placeholder="placeholder"
        @input="$emit('update:value', $event.target.value)"
      >
    </label>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component,Prop} from 'vue-property-decorator';

  @Component
  export default class FormItem extends Vue {
    @Prop({default: ''}) readonly value!: string;
    @Prop({required: true}) fieldName!: string;
    @Prop() placeholder?: string
    @Prop({default: ''}) readonly tagName!: string;
    @Prop() type?: string;
  }
</script>

<style lang="scss" scoped>
  .formItem {
    font-size: 14px;
    display: flex;
    align-items: center;
.notes{
  width: 34px;
  height: 34px;
  margin-right: 6px;
}
    .name {
      padding: 0 16px 0 10px;
    }

    input {
      height: 40px;
      flex-grow: 1;
      min-width: 80px;
    }
  }
</style>