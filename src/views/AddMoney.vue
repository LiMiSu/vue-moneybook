<template>
  <div class="addMoney-wrapper">
    <header>
      <div class="addheader">
        <div class="icon left" @click="goBack">
          <Icon name="left"></Icon>
        </div>
        <div class="header">
          {{$route.params.id?'编辑账单':'记一笔'}}
        </div>
        <span class="icon off" @click="deleteRecord($route.params.id)" v-if="$route.params.id">删除</span>
        <span class="icon empty" v-else></span>
      </div>
      <div class="type">
        <MoneyType class-prefix="add" :data-source="typeList"
                   :value.sync="$route.params.id?$store.state.currentRecord.type:$store.state.record.type"/>
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
              <span class="item">{{currentTag.name}}</span>
            </div>
            <label>
              <Input :value.sync="showNotes"
                     field-name="备注" placeholder="写点备注..." class="item"/>
            </label>
          </div>
          <DayBook v-if="!$store.state.showBody" class="book"></DayBook>
        </div>
        <NumberPad :value.sync="thisRecordAmount"
                   @submit="saveRecord"></NumberPad>
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
      if (this.$route.params.id) {
        if ((this.$store.state.recordList as RecordItem[]).map(item=>item.id).indexOf(this.$route.params.id)<0){
          this.$router.replace('/404');
          return
        }else {
          this.$store.commit('setCurrentRecord', this.$route.params.id);
        }
      } else {
        this.$store.state.record.notes = '';
      }
    }

    get currentTag() {
      if (this.$store.state.currentTag) {
        return this.$store.state.currentTag;
      } else {
        return '无';
      }
    }

    get showNotes() {
      if (this.$route.params.id) {
        return this.$store.state.currentRecord.notes;
      } else {
        return this.$store.state.record.notes;
      }
    }

    set showNotes(value) {
      if (this.$route.params.id) {
        this.$store.state.currentRecord.notes = value;
      } else {
        this.$store.state.record.notes = value;
      }
    }

    get thisRecordAmount() {
      if (this.$route.params.id) {
        return this.$store.state.currentRecord.amount;
      } else {
        return this.$store.state.record.amount;
      }
    }

    set thisRecordAmount(value: number) {
      if (this.$route.params.id) {
        this.$store.state.currentRecord.amount = value;
      } else {
        this.$store.state.record.amount = value;
      }
    }

    saveRecord() {
      this.$store.commit('createRecord', this.$store.state.record);
      this.$store.state.record.notes = '';
    }

    goBack() {
      if (this.$route.params.id) {
        this.$router.replace('/detail');
      } else {
        this.$router.replace('/main');
      }
    }

    deleteRecord(id: string) {
      const record = (this.$store.state.recordList as RecordItem[]).filter(item => item.id === id)[0];
      const index=this.$store.state.recordList.indexOf(record)
      this.$store.state.recordList.splice(index,1)
      this.$store.commit('saveRecords');
      window.alert('成功');
      this.$router.replace('/detail');
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

    .icon.left, .icon.off,.icon.empty {
      width: 42px;
      height: 24px;
      margin: 0 16px;

      line-height: 24px;
    }
    .icon.left{
      text-align: left;
    }

    .icon.off {
      text-align: center;
      background: #DE7873;
      color: white;
      border-radius: 6px;
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
        background: #fff;

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
      background: rgb(243, 243, 243);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      padding: 10px 16px;
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