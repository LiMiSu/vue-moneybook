<template>
  <layout class-prefix="layout" class="a">

  </layout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  import NumberPad from '@/components/AddMoney/NumberPad.vue';
  import FormItem from '@/components/Input.vue';
  import Tags from '@/components/Tag/ShowTags.vue';
  import Button from '@/components/Button.vue';
  import Tabs from '@/components/MoneyType.vue';
  import Days from '@/components/Calender.vue';


  @Component({
    components: {Days, Tabs, Button, Tags, FormItem, NumberPad},

  })
  export default class Money extends Vue {


  }
</script>
<style lang="scss" scoped>

  .notes {
    padding: 12px 0;
  }
</style>