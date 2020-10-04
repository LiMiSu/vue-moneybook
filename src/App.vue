<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  @Component
  export default class App extends Vue {

  }
</script>
<style lang="scss">
  @import "~@/assets/style/reset.scss";
  @import "~@/assets/style/helper.scss";


  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: $font-heiti;
    color: #000000;
    font-size: 14px;
  }


  /*@media (min-width: 500px){*/
  /*#app{*/
  /*  max-width:500px;*/
  /*  margin: 0 auto;*/
  /*}*/
  /*}*/
</style>
