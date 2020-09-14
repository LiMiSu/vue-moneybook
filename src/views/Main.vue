<template>
  <NavStyle class-prefix="main">
    <template #header>
      记账
    </template>
    <template #main>
      <div class="main-header">
        <div class="day-result">
          <div class="day" @click="$store.state.showBody=!$store.state.showBody">
            <div class="day-year">{{year}}</div>
            <div class="day-month">{{month}}月</div>
          </div>
          <div class="result">
            <span></span>
            <span>-￥3000</span>
          </div>
        </div>
        <div class="type">
          <div class="in">
            <span class="in-text">
              <Icon name="money"></Icon>+
            </span>
            <span class="in-money">￥900</span>
          </div>
          <div class="pay">
            <span class="pay-text">
              <Icon name="money"></Icon>-
            </span>
            <span class="pay-money">￥200</span>
          </div>
        </div>
      </div>
      <div class="main-body">
        <router-link to='/addmoney'>去记一笔吧！</router-link>



<!--        <div class="message date">-->
<!--          <div class="text"><span>日期</span></div>-->
<!--          <div class="input"><label>-->
<!--            <input type="text">-->
<!--          </label></div>-->
<!--        </div>-->
<!--        <div class="message tag">-->
<!--          <div class="text"><span>标签</span></div>-->
<!--          <div class="input"><label>-->
<!--            <input type="text">-->
<!--          </label></div>-->
<!--        </div>-->
<!--        <div class="message amount">-->
<!--          <div class="text"><span>金额</span></div>-->
<!--          <div class="input"><label>-->
<!--            <input type="text">-->
<!--          </label></div>-->
<!--        </div>-->
<!--        <div class="notes">-->
<!--          <div class="text">-->
<!--            <span>备注</span>-->
<!--          </div>-->
<!--          <div class="input">-->
<!--            <label>-->
<!--              <textarea></textarea>-->
<!--            </label>-->
<!--          </div>-->
<!--        </div>-->





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
  .main-header {
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    .day-result {
      display: flex;

      .day {
        width: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 30px;

        .day-year, .day-month {
          padding: 10px;
        }

        ::v-deep {
          .main-datebody {

          }
        }
      }

      .result {
        /*background: #DE7873;*/
        height: 100px;
        flex: 1;
        font-size: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        /*color: rgb(250, 250, 250);*/
      }
    }


    .type {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;

      %payin {
        height: 30px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .pay {
        width: 50%;
        @extend %payin;

        .pay-money {
          color: #DE7873;
        }
      }

      .in {
        width: 50%;
        @extend %payin;

        .in-money {
          color: rgb(43, 162, 69);

        }
      ;
      }

      .icon {
        width: 24px;
        height: 24px;
      }
    }
  }

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
</style>