<template>
  <layout class-prefix="layout">
    <tags :data-source.sync="tages"/>
    <note/>
    <types/>
    <number-pad/>
  </layout>
</template>

<script lang="js">
  import NumberPad from '@/components/Money/NumberPad.vue';
  import Types from '@/components/Money/Types.vue';
  import Note from '@/components/Money/Note.vue';
  import Tags from '@/components/Money/Tags.vue';

  export default {
    name: 'Money',
    components: {Tags, Note, Types, NumberPad},
    data() {
      return {
        tages: ['衣', '食', '住', '行']
      };
    }
  };
</script>
<style lang="scss">
  .layout-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
</style>