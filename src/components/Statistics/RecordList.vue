<template>
  <div>
    <div class="lineData list-wrapper" v-if="showLine">
      <div v-for="record in recordByTagTime" :key="record.id">
        <div class="list">
          <div class="left">
            <div class="iconWarpper">
              <Icon :name="record.icon"></Icon>
            </div>
            <div class="name">{{record.name}}</div>
          </div>
          <span class="amount">{{recordByTagTotalPercent(record.num)}}</span>
          <span class="amount">{{showNum(record.num)}}</span>
        </div>
      </div>
    </div>
    <div class="circleData list-wrapper" v-else>
      <div v-for="result in recordByTagTime" :key="result.id">
        <div class="result-show" v-if="result.name===initShowTag">
          <div class="list">
            <div class="left">
              <div class="iconWarpper">
                <Icon :name="result.icon"></Icon>
              </div>
              <div class="name">{{result.name}}</div>
            </div>
            <span class="amount">{{recordByTagTotalPercent(result.num)}}</span>
            <span class="amount">{{showNum(result.num)}}</span>
          </div>
          <div class="list detail" v-for="item in result.recordList" :key="item.id">
            <div class="item">{{item.date}}</div>
            <div class="item">{{item.name}}</div>
            <div class="item">{{item.num}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';

  @Component
  export default class RecordList extends Vue {
    @Prop() recordByTagTime!: RecordByTag[];
    @Prop() showLine!: boolean;
    @Prop() type!: string;
    @Prop() dayRecordList!: DayResult[];
    @Prop() monthTotal!: number;
    @Prop() yearTotal!: number;
    @Prop() initShowTag!: string;

    beforeCreate() {
      this.$store.commit('fetchRecords');
    }
    get interval() {
      return this.$store.state.interval;
    }

    showNum(value: number){
      return parseFloat(value.toFixed(2))
    }

    recordByTagTotalPercent(value: number) {
      return this.interval === 'year' ?
        parseFloat(Math.abs(value / this.yearTotal * 100).toFixed(2)) + '%'
        : parseFloat(Math.abs(value / this.monthTotal * 100).toFixed(2)) + '%';
    }
  }
</script>

<style lang="scss" scoped>
  .lineData {

    .list {
      padding: 16px;
      display: flex;
      justify-content: space-between;

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
          padding-left: 5px;
        }

      }
    }
  }
  .circleData {
    .list {
      display: flex;
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
          padding-left: 5px;
        }

      }
    }

    .detail {
      .item {
        width: 33.33%;
      }

      .item:nth-child(2) {
        text-align: center;
      }

      .item:last-child {
        text-align: end;
        word-break: break-all
      }
    }
  }
</style>