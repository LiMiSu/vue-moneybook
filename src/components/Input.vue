<template>
  <div>
    <label class="formItem">
      <span class="name">{{fieldName}}</span>
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
    padding-left: 16px;
    display: flex;
    align-items: center;

    .name {
      padding-right: 16px;
    }

    input {
      height: 40px;
      flex-grow: 1;
      padding-right: 16px;
    }
  }
</style>