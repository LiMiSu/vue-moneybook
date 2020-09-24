<template>
  <div class="layout-wrapper">
    <header class="header">
      <Icon name="set" class="set" @click="say"></Icon>
      <div class="header"><slot name="header"></slot></div>
      <Icon name="me" class="me" @click="say"></Icon>
      <div class="say" v-if="sayValue">
        <div class="value">此功能尚未开发，敬请期待哟</div>
      </div>
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
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';

  @Component
  export default class NavStyle extends Vue {
    @Prop() classPrefix!: string;
    @Prop() value!: string;
    sayValue = false;
    say(){
      if(!this.sayValue){
        this.sayValue=!this.sayValue
        setTimeout(() =>{
          this.sayValue=!this.sayValue
        },1000)
      }
    }
  }
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

  .main {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    flex: 1;
  }

  .header, {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    height: 6vh;
    border-bottom: 1px solid rgb(243, 243, 243);

    .icon.set, .icon.me {
      width: 24px;
      height: 24px;
      margin: 0 16px;
    }

    .say {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(43,43,43, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      .value{
        background: rgba(243,243,243,0.8);
        text-align: center;
        padding: 0 6px;
        font-size: 14px;
        border-radius: 7px;
      }

    }
  }

  .footer {
  }
</style>