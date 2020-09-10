<template>
  <!--  导航样式组件-->
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
    justify-content: space-between;
    min-height: 100vh;
  }

  .main,.header{
    display: flex;
    flex-direction: column;
    overflow: auto;
  }
</style>