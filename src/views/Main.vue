<template>
  <NavStyle class-prefix="main">
    <template #header>
      记账
    </template>
    <template #main>
      <div class="main-wrapper">
        <Calender class-prefix="main"></Calender>
        <div class="record-list">
          <div v-if="dayRecordList.length>0">
            <div class="recordlist" v-for="record in dayRecordList" :key="record.id">
              <span><Icon :name="record.tag.tagicon"></Icon>{{record.tag.name}}</span><span>{{record.amount}}</span>
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


    get recordList() {
      return this.$store.state.recordList;
    }

    get dayRecordList() {
      return (this.recordList as RecordItem[]).filter(item => {
        return dayjs(item.createdAt).isSame(dayjs(this.$store.state.record.createdAt), 'day');
      });
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep .main-datebody {
    height: 220px;

    .date-nav {
      .date-btn {
        font-size: 24px;
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

        }
      }
    }
  }

  .main-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .record-list {
      overflow-y: auto;
      flex: 1;
    }
  }

  .recordlist {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 16px;

    .icon {
      width: 21px;
      height: 21px;
      margin-right: 5px;
    }
  }

  .noResult {
    display: flex;
    padding: 16px;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: #999;

    span {
      padding: 16px 0;
    }
  }

</style>