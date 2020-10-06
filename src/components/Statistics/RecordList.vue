<template>
  <div>
    <div class="lineData list-wrapper" v-if="$store.state.showLineEcharts">
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
        <div class="result-show" v-if="result.name===$store.state.circleShowDate">
          <div class="list detail" v-for="item in filterSameDay(result.recordList)" :key="item.date">
            <div class="sum">
              <div>{{showDay(item.date)}}</div>
              <span>合计：</span>
              <span>{{item.num}}</span>
              <span class="percent">{{totalPercent(result,item.num)}}</span>
            </div>
            <div v-for="i in item.items" :key="i.id" class="list-list">
              <div class="left">
                <div class="iconWarpper">
                  <Icon :name="i.icon"></Icon>
                </div>
                <div class="name">{{i.name}}</div>
              </div>
              <div class="item">{{i.num}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';
  import dayjs from 'dayjs';
  import clone from '@/lib/clone';

  @Component
  export default class RecordList extends Vue {
    @Prop() recordByTagTime!: RecordByTag[];
    @Prop() type!: string;
    @Prop() dayRecordList!: DayResult[];
    @Prop() monthTotal!: number;
    @Prop() yearTotal!: number;

    beforeCreate() {
      this.$store.commit('fetchRecords');
    }

    get interval() {
      return this.$store.state.interval;
    }

    showDay(value: string) {

      return this.interval === 'month'?dayjs(value).format('DD日'):dayjs(value).format('M月');
    }

    showNum(value: number) {
      return parseFloat(value.toFixed(2));
    }

    totalPercent(value: any, date: number) {
      return parseFloat(Math.abs(date / value.num * 100).toFixed(2)) + '%';
    }

    filterSameDay(value: RecordSameTagList[]) {
      const result = [
        {
          date: value[0].date,
          num: value[0].num,
          items: [value[0]]
        }
      ];

      for (let i = 0; i < value.length; i++) {
        result.push(
          {
            date: value[i].date,
            num: value[i].num,
            items: [value[i]]
          }
        );
        for (let i = 0; i < result.length; i++) {
          for (let f = i + 1; f < result.length; f++) {
            if (this.interval === 'month'){
              if (result[f].date===result[i].date) {

                result[i].items.push(result[f].items[0]);
                if (result[i].items[0].id===result[i].items[1].id){
                  result[i].items.splice(0,1)
                  result[i].num-=result[i].items[0].num
                }
                result[i].num += result[f].num;
                result.splice(f, 1);
                f--;
              }
            }else if (this.interval === 'year'){

              if (dayjs(result[f].date).isSame(result[i].date, 'month')) {
                result[i].items.push(result[f].items[0]);
                if (result[i].items[0].id===result[i].items[1].id){
                  result[i].items.splice(0,1)
                  result[i].num-=result[i].items[0].num
                }
                result[i].date=dayjs(result[i].date).format('YYYY-M')
                result[i].num += result[f].num;
                result.splice(f, 1);
                f--;
              }
            }

          }
        }
      }
      return result;
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
      flex-direction: column;

      padding: 16px;
.sum{
  display: flex;
  color: #b5b5b5;
  font-size: 12px;
  align-items: flex-end;
  div{
    margin-right: 16px;
  }
  .percent{
    margin-left: 16px;
  }
}
      .list-list {
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