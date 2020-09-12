<template>
  <div class="addMoney-wrapper">

    <header class="header">
      <MoneyType class-prefix="type" :data-source="typeList" :value.sync="$store.state.record.type"/>
    </header>


    <main class="main">
      <ShowTags :value.sync="$store.state.record.tags"/>
      <router-view></router-view>
      <div class="notes">
        <Input :value.sync="$store.state.record.notes" field-name="备注" placeholder="在这里输入备注"/>
      </div>
    </main>


    <footer class="footer">
      <div v-if="$store.state.showBody" class="cover">
        <div class="top" @click="$store.state.showBody=!$store.state.showBody"></div>
        <div class="daychoose">
          <Calender class="chooseDay"></Calender>
          <div class="cancel" @click="$store.state.showBody=!$store.state.showBody">取消</div>
        </div>
      </div>
      <NumberPad :value.sync="$store.state.record.amount" @submit="saveRecord"></NumberPad>
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

  .main {
    display: flex;
    flex-direction: column;
    overflow: auto;
    flex: 1;
  }

  .footer {

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
      background: rgba(255, 255, 255, 0.5);

      .top {
        background: rgba(255, 255, 255, 0.5);
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