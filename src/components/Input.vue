<template>
  <div class="wrapper">
    {{inputValue}}
    <label class="formItem">
      <Icon v-if="fieldName==='备注'" name="notes" class="notes"></Icon>
      <span v-else class="name">{{fieldName}}</span>

      <input
        :type="type || 'text'"
        :value="tagName||value"
        :placeholder="placeholder"
        @input="updateNotes($event.target.value)"
      >
    </label>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';

  @Component
  export default class FormItem extends Vue {
    @Prop({default: ''}) readonly value!: string;
    @Prop({required: true}) fieldName!: string;
    @Prop() placeholder?: string;
    @Prop({default: ''}) readonly tagName!: string;
    @Prop() type?: string;
    inputValue = this.value.toString();

    updateNotes(value: string) {

      if (this.fieldName !== '备注') {
        if (value.length > 4) {
          value = value.substring(0, 4);
          this.$store.state.isFail = '超过4个字符';

          this.$emit('update:value', value);
          // console.log(this.value);
          return;
        }
      }

      this.$emit('update:value', value);

    }
  }
</script>

<style lang="scss" scoped>
  .formItem {
    font-size: 14px;
    display: flex;
    align-items: center;

    .notes {
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