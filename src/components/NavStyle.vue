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
    name: 'NavStyle',
    props: ['classPrefix', 'value'],
  };
</script>

<style lang="scss">
  .layout-wrapper {
    display: flex;
    flex-direction: column;
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
  }
  .header,{
    display: flex;
    flex-direction: column;
  }
  .footer{
  }
</style>