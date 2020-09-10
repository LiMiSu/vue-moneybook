<template>
  <!--  日期组件-->
  <div class="date">
    <div class="date-input">
      <Icon name="date" class="icon-data"></Icon>
      <input
        type="text"
        :value="dataValue">
    </div>
    <div v-if="showBody" class="date-body">
      <div class="data-tri"></div>
      <div class="date-content">
        <div class="date-nav">
          <Icon name="left-nav" class="date-btn icon-left-nav"></Icon>
          <Icon name="zuo" class="date-btn icon-zuo"></Icon>
          <span>2020年</span>
          <Icon name="you" class="date-btn icon-you"></Icon>
          <Icon name="right-nav" class="date-btn icon-right-nav"></Icon>
        </div>
        <div class="data-list">
          <div class="date-weeks">
            <div v-for="week in weekDay" :key="week"
            >
              {{week}}
            </div>
          </div>
          <div class="date-days">
            <div v-for="day in 42" :key="day">
              {{day}}
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

  @Component
  export default class Days extends Vue {
    data = new Date();
    weekDay = ['日', '一', '二', '三', '四', '五', '六'];

    showBody = false;

    get dataValue() {
      const year = this.data.getFullYear();
      const month = this.data.getMonth();
      const day = this.data.getDate();
      return `${year}-${month + 1}-${day}`;
    }

    changeShow(value: boolean) {
      // this.showBody = value;
    }
  }
</script>

<style lang="scss" scoped>
  .date-input {
    height: 40px;
    line-height: 40px;
    border: 1px solid blue;
    padding: 0 30px;
    border-radius: 4px;
    position: relative;

    .icon-data {
      position: absolute;
      left: 5px;
      top: 3px;
      font-size: 30px;
    }
  }

  .date-body {
    border: 1px solid yellow;
    min-width: 50vw;
    min-height: 50vh;
    position: relative;

    .data-tri {
      position: absolute;
      top: -12px;
      left: 30px;
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-bottom-color: red;

      &::after {
        position: absolute;
        left: -6px;
        top: -6px;
        content: '';
        display: block;
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-bottom-color: white;
      }
    }

    .date-content {
      .date-nav {
        user-select: none;
        padding-top: 15px;
        padding-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        .date-btn {
          margin-left: 5px;
          margin-right: 5px;
          color: #000;
          font-size: 20px;
        }
      }

      .data-list {
        color: #606266;
        margin-left: 60px;
        margin-right: 60px;
        font-size: 14px;
        user-select: none;

        .date-weeks {
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-bottom: 1px solid #ebeef5;
          height: 40px;
        }

        .date-days {
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: wrap;

          div {
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            margin: 4px 6px;

            .is-today {
              color: #409eff;
              font-weight: 700;
            }

            .is-select {
              border-radius: 50%;
              background: #409eff;
              font-weight: 700;
              color: #fff;
            }

            .other-month {
              border-radius: 50%;
              color: #c0c4cc;
            }
          }
        }
      }
    }
  }


</style>