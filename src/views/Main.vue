<template>
  <NavStyle class-prefix="main">
    <template #header>
      记账
    </template>
    <template #main>
      <div class="main-wrapper">
        <Calender class-prefix="main"></Calender>
        <div v-if="dayRecordList.length>0" class="head">
          <div class="top"><span class="date">{{date}}</span><span class="text">(单位：元)</span></div>
          <div class="list"><span class="text">支出：</span><span class="num">{{dayTotal('支出')}}</span></div>
          <div class="list"><span class="text">收入：</span><span class="num">{{'+'+dayTotal('收入')}}</span></div>
          <div class="list"><span class="text">结余：</span><span class="num">{{dayTotal('结余')}}</span></div>
        </div>
        <div class="record-list">
          <div v-if="dayRecordList.length>0">
            <div class="recordlist" v-for="record in dayRecordList" :key="record.id">
              <div class="left">
                <div class="iconWarpper">
                  <Icon :name="record.tag.tagicon"></Icon>
                </div>
                <div class="name">{{record.tag.name}}</div>
              </div>
              <span class="notes">{{record.notes}}</span>
              <span class="amount">{{record.amount}}</span>
            </div>
            <div class="noResult">恭喜您养成了记账好习惯！再去记一笔吧~</div>
          </div>
          <div class="noResult" v-else><span>--这天暂无记账，点击 <Icon name="add"></Icon> 去记一笔吧--</span></div>
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
  import dayjs from 'dayjs';


  @Component({
    components: {DayBook, Calender}
  })
  export default class Nav extends Vue {


    beforeCreate() {
      this.$store.commit('fetchRecords');
      this.$store.state.record.createdAt = new Date().toISOString();
    }

    get date() {
      return dayjs(this.$store.state.record.createdAt).format('M-DD');
    }

    get recordList() {
      return this.$store.state.recordList;
    }

    get dayRecordList() {
      return (this.recordList as RecordItem[]).filter(item => {
        return dayjs(item.createdAt).isSame(dayjs(this.$store.state.record.createdAt), 'day');
      });
    }


    dayTotal(value: string) {
      if (value === '支出') {
        return this.dayRecordList.filter(item => item.type === '-').reduce((sum, item) => {
          return sum + item.amount;
        }, 0);
      } else if (value === '收入') {
        return this.dayRecordList.filter(item => item.type === '+').reduce((sum, item) => {
          return sum + item.amount;
        }, 0);
      } else if (value === '结余') {
        return this.dayRecordList.reduce((sum, item) => {
          return sum + item.amount;
        }, 0);
      }

    }
  }
</script>
<style lang="scss" scoped>
  .head {
    background: #ffffff;
    box-shadow: 0 3px 11px -9px #d9d9d9;
    line-height: 4vh;
    padding: 5px 16px 0 16px;
    color: #b5b5b5;
    width: 98vw;
    display: flex;
    margin-top: 5px;
    z-index: 1;
    justify-content: space-between;

    .top {
      min-width: 110px;
    }

    .date {
      margin-right: 5px;
    }

    .list {
      display: flex;
      flex-wrap: wrap;
      margin-left: 5px;
      min-width: 37px;
      font-size: 12px;

      .num {
        word-break: break-all
      }
    }

    .text {
      font-size: 12px;
    }
  }

  ::v-deep .main-datebody {
    width: 98vw;
    height: 220px;
    background: rgb(243, 243, 243);
    box-shadow: 0 16px 20px -16px #d9d9d9;
    margin-top: 2px;
    border-radius: 10px;

    .date-nav {
      .date-btn {
        font-size: 20px;
      }
    }

    .data-list {

      .date-weeks {
        height: 24px;

        th {
          line-height: 24px;
        }
      }

      .date-days {

        td {
          height: 24px;
          line-height: 24px;
          position: relative;
          /*background: #DE7873;*/

          &.is-have ::after {
            content: "";
            position: absolute;
            top: 10%;
            right: 14%;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #DE7873;
          }

          &.is-select {
            background: rgb(243, 243, 243);
            font-weight: 700;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;

            .day-day {
              border-radius: 15px;
              width: 8vw;
              background: #DE7873;
              text-align: center;
              line-height: 24px;
            }
          }
        }
      }
    }
  }

  .main-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;

    .record-list {
      overflow-y: auto;
      width: 100vw;
      flex: 1;
      .notes {
        flex: 1;
        margin: 0 16px;
        color: #999;
        font-size: 12px;
      }

    }
  }

  .recordlist {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;

    .left {
      display: flex;
      max-width: 105px;

      .iconWarpper {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #DE7873;
        color: white;
        margin-right: 5px;
        border-radius: 10px;
        width: 30px;
        height: 30px;

        .icon {
          width: 20px;
          height: 20px;
        }
      }

      .name {
        display: flex;
        justify-content: center;
        align-items: center;
      }

    }
  }

  .noResult {
    display: flex;
    padding: 12px;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: #999;

    span {
      padding: 16px 0;
    }
  }

</style>