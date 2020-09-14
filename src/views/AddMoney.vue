<template>
  <div class="addMoney-wrapper">
    <header class="addheader">
      <Icon name="left" class="left"></Icon>
      <div class="header">
        记一笔
      </div>
      <span class="icon off"></span>
    </header>


    <main class="addmain">
      <MoneyType class-prefix="add" :data-source="typeList" :value.sync="$store.state.record.type"/>
      <div class="message date">
        <div class="text"><span>日期</span></div>
        <div class="input"><label>
          <input type="text">
        </label></div>
      </div>
      <div class="message tag">
        <div class="text"><span>标签</span></div>
        <div class="input"><label>
          <input type="text">
        </label></div>
      </div>
      <div class="message amount">
        <div class="text"><span>金额</span></div>
        <div class="input"><label>
          <input type="text">
        </label></div>
      </div>
      <div class="notes">
        <div class="text">
          <span>备注</span>
        </div>
        <div class="input">
          <label>
          <textarea></textarea>
        </label>
        </div>
      </div>
      <div class="yes">
        <div class="text"><span>确定</span></div>
      </div>

<!--      <ShowTags :value.sync="$store.state.record.tags"/>-->
<!--      class="input"-->
<!--      <router-view></router-view>-->
<!--      <div class="notes">-->
<!--        <label>-->
<!--          <Input :value.sync="$store.state.record.notes" field-name="备注" placeholder="在这里输入备注"/>-->
<!--        </label>-->
<!--      </div>-->
<!--      <div v-if="$store.state.showBody" class="cover">-->
<!--        <div class="top" @click="$store.state.showBody=!$store.state.showBody"></div>-->
<!--        <div class="daychoose">-->
<!--          <Calender class="chooseDay"></Calender>-->
<!--          <div class="cancel" @click="$store.state.showBody=!$store.state.showBody">取消</div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <NumberPad :value.sync="$store.state.record.amount" @submit="saveRecord"></NumberPad>-->
    </main>


    <footer class="addfooter">

    </footer>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  import NumberPad from '@/components/AddMoney/NumberPad.vue';
  import Input from '@/components/Input.vue';
  import ShowTags from '@/components/Tag/ShowTags.vue';
  import Button from '@/components/Button.vue';
  import typeList from '@/constants/typeList';
  import MoneyType from '@/components/MoneyType.vue';
  import Calender from '@/components/Calender.vue';

  @Component({
    components: {Calender, MoneyType, Button, ShowTags, Input, NumberPad},
  })
  export default class Money extends Vue {
    typeList = typeList;

    created() {
      this.$store.commit('fetchRecords');
    }

    saveRecord() {
      this.$store.commit('createRecord', this.$store.state.record);
      this.$store.state.record.notes = '';
    }
  }
</script>

<style lang="scss" scoped>
  .addMoney-wrapper {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .addmain {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    flex: 1;

    .message {
      border-bottom: 1px dotted rgb(222, 225, 230);
      display: flex;
      justify-content: space-between;
      padding: 0 22px;

      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 10vh;
      }

      .input {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 10vh;

        input{
          border: 1px solid rgb(230, 230, 230);
          border-radius: 4px;
          padding: 3px 16px;
          background: #ffffff;
        }
      }
    }
    .notes{
      padding: 0 22px;
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 5vh;
      }
      textarea{
        border: 1px solid rgb(230, 230, 230);
        border-radius: 4px;
        padding: 3px 16px;
        background: #ffffff;
        resize: none;
        width: 100%;
      }
    }
  }

  .addheader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    height: 6vh;
    border-bottom: 1px solid rgb(243, 243, 243);

    .icon.left, .icon.off {
      width: 24px;
      height: 24px;
      margin: 0 16px;
    }
  }

  .addfooter {

    .cover {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      /*铺满整个视口，背景半透明*/
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(255, 255, 255, 0.4);

      .top {
        background: rgba(255, 255, 255, 0.2);
        flex: 1;
      }

      .daychoose {
        position: relative;

        .cancel {
          position: absolute;
          right: 8px;
          top: 9px;
          width: 55px;
          height: 30px;
          text-align: center;
          line-height: 30px;
        }
      }

    }
  }


</style>