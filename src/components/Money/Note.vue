<template>
  <div>
    <label class="note">
      <span class="name">备注</span>
      <input
        type="text"
        placeholder="在这里输入备注"
        @input="$emit('update:value', $event.target.value)"
      >
    </label>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch,Prop} from 'vue-property-decorator';

  @Component
  export default class Note extends Vue {
    @Prop() readonly value!: string

  }
</script>

<style lang="scss" scoped>
  .note {
    background: #f5f5f5;
    font-size: 14px;
    padding-left: 16px;
    display: flex;
    align-items: center;

    .name {
      padding-right: 16px;
    }

    input {
      background: #f5f5f5;
      height: 64px;
      flex-grow: 1;
      padding-right: 16px;
    }
  }
</style>