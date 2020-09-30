<template>
  <div class="addMoney-wrapper">
    <header>
      <div class="addheader">
        <Icon name="left" class="left" @click="goBack"></Icon>
        <div class="header">
          记一笔
        </div>
        <span class="icon off"></span>
      </div>
      <div class="type">
        <MoneyType class-prefix="add" :data-source="typeList" :value.sync="$store.state.record.type"/>
      </div>
    </header>
    <main class="addmain">

      <ShowTags :value.sync="$store.state.record.tag"/>
    </main>
    <footer class="addfooter">

      <div v-if="$store.state.showBody" class="cover">
        <div class="top" @click="$store.state.showBody=!$store.state.showBody"></div>
        <div class="daychoose">
          <Calender class="chooseDay"></Calender>
          <div class="cancel" @click="$store.state.showBody=!$store.state.showBody">
            <Icon name="x"></Icon>
          </div>
        </div>
      </div>
      <div v-if="$store.state.currentTag">
        <div class="notes">
          <div class="left">
            <div class="icon-tag">
              <Icon :name="$store.state.currentTag.tagicon" class="item"></Icon>
              <span class="item">{{$store.state.currentTag.name}}</span>
            </div>
            <label>
              <Input :value.sync="$store.state.record.notes" field-name="备注" placeholder="写点备注..." class="item"/>
            </label>
          </div>
          <DayBook v-if="!$store.state.showBody" class="book"></DayBook>
        </div>
        <NumberPad :value.sync="$store.state.record.amount" @submit="saveRecord"></NumberPad>
      </div>
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
  import DayBook from '@/components/AddMoney/DayBook.vue';

  @Component({
    components: {DayBook, Calender, MoneyType, Button, ShowTags, Input, NumberPad},
  })
  export default class Money extends Vue {
    typeList = typeList;

    created() {
      this.$store.commit('fetchRecords');
      this.$store.state.currentTag = '';
    }


    saveRecord() {
      this.$store.commit('createRecord', this.$store.state.record);
      this.$store.state.record.notes = '';
    }

    goBack() {
      this.$router.replace('/main');
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

  .addmain {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    flex: 1;


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
          right: 2px;
          top: 11px;
          width: 55px;
          height: 30px;
          text-align: center;
          line-height: 30px;
        }
      }

    }


    .notes {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      padding: 10px 16px;
      background: rgb(246, 234, 212);
      border-bottom: 1px solid #d9d9d9;
      width: 100%;
      .left {
        display: flex;
        align-items: center;

      }

      label {
        width: 42vw;
        flex: 1;
      }

      .icon-tag {
        display: flex;
        align-items: center;
        /*flex-wrap: wrap;*/
        width: 27vw;
        .icon {
          margin-right: 5px;
        }
      }



      .book {

      }
    }
  }


</style>