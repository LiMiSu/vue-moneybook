<template>
  <div class="layout-wrapper">
    <header class="header">
      <slot name="header"></slot>
    </header>
    <main class="main" :class=" classPrefix && `${classPrefix}-content` ">
      <slot name="main"></slot>
    </main>
    <footer class="footer">
      <Nav/>
    </footer>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'Layout',
    props: ['classPrefix', 'value'],
  };
</script>

<style lang="scss">
  .layout-wrapper {
    display: flex;
    flex-direction: column;
    /*justify-content: space-between;*/
    /*min-height: 100vh;*/

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .main{
    display: flex;
    flex-direction: column;
    overflow: auto;
    flex: 1;
    /*flex-grow: 1;*/
  }
  .header,.footer{
    /*flex: 0 0 0;*/
  /*  同学为什么要设置这个？不设置目前看来没什么影响*/
  }
</style>