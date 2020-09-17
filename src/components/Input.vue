<template>
  <div class="wrapper">
    <label class="formItem">
      <Icon name="notes" class="notes"></Icon>
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
  margin-right: 16px;
}
    /*.name {*/
    /*
    /*}*/

    input {
      height: 40px;
      flex-grow: 1;
      /*background: #ffffff;*/
    }
  }
</style>