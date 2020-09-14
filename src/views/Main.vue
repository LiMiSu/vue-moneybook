<template>
  <NavStyle class-prefix="main">
    <template #header>
      <div class="header">汤姆记账</div>
    </template>
    <template #main>
      <div class="main-header">
        <div class="day">
          <div class="day-show" @click="$store.state.showBody=!$store.state.showBody">
            <div>{{year}}年</div>
            <div>{{month}}月</div>
          </div>
          <Calender v-if="$store.state.showBody" class-prefix="main"/>
        </div>
        <div class="result">
          <div class="sum">您{{month}}月<span>xxx钱{{}}</span></div>
          <div class="type">
            <div class="pay">
              <span>支出</span>
              <span>xxx钱</span>
            </div>
            <div class="in">
              <span>收入</span>
              <span>xxx钱</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </NavStyle>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import Calender from '@/components/Calender.vue';
  import DayBook from '@/components/AddMoney/DayBook.vue';


  @Component({
    components: {DayBook, Calender}
  })
  export default class Nav extends Vue {

    // beforeCreate() {
    //   this.$store.commit('fetchDayRecordList');
    // }
    get dayValue() {
      return new Date(this.$store.state.record.createdAt);
    }

    get year() {
      return this.dayValue.getFullYear();
    }

    get month() {
      return this.dayValue.getMonth() + 1;
    }

    // get count(){
    //   return this.$store.state.monthRecordList
    // }
  }
</script>
<style lang="scss" scoped>

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    min-height: 60px;
  }

  .main-header {
    display: flex;

    .day {
      height: 140px;

      ::v-deep {
        .main-datebody {

        }
      }
    }

    .result {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 140px;

      .sum {
        flex: 1;
        background:#DE7873;
      }

      .type {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>