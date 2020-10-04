<template>
  <div >
    <div v-for="year in yearRecordList" :key="year.title">
      <DetailItem :date.sync="year" :type.sync="type"></DetailItem>
      <div v-if="year.show">
        <div v-for="month in year.items" :key="month.title">
          <DetailItem :date.sync="month" :type.sync="type"></DetailItem>
          <div v-if="month.show">
            <div v-for="day in month.items" :key="day.title">
              <DetailItem :date.sync="day" :type.sync="type"></DetailItem>
              <div v-if="day.show">

                <div v-for="(item,index) in day.items" :key="index"
                     class="record" @click="recordDetail(item)">
                  <div class="left">
                    <div class="iconWarpper">
                      <Icon :name="item.tag.tagicon"></Icon>
                    </div>
                    <div class="name">{{item.tag.name}}</div>
                  </div>
                  <span class="notes">{{item.notes}}</span>
                  <span class="amount">{{showType(item)}}{{item.amount}}</span>
                  <Icon name="zuo" class="rewrite"></Icon>
                </div>
              </div>
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
  import DetailItem from '@/components/Detail/DetailItem.vue';

  @Component({
    components: {DetailItem}
  })
  export default class DetailList extends Vue {
    @Prop() yearRecordList!: YearResult[];
    @Prop() readonly type!: string;

    beforeCreate() {
      this.$store.commit('fetchRecords');
    }
    recordDetail(item: RecordItem) {
        this.$router.push('/addmoney/' + item.id);
    }
    showType(item: RecordItem) {
      if (item.type === '+') {
        return item.type;
      } else {
        return '';
      }
    }
  }
</script>

<style lang="scss" scoped>
  .record {
    padding: 16px;
    min-height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;

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

    .notes {
      flex: 1;
      margin: 0 16px;
      color: #999;
      font-size: 12px;
    }


    .rewrite {
      color: #999999;
      margin-left: 10px;
    }
  }
</style>