<template>
  <div>
    <div class="inputNumber" :class="[{first:one},{second:two}]">{{output}}</div>
    <div class="numberPad">
      <button @click="inputContent">÷</button>
      <button @click="inputContent">×</button>
      <button @click="inputContent">+</button>
      <button @click="inputContent">-</button>
      <button @click="inputContent">7</button>
      <button @click="inputContent">8</button>
      <button @click="inputContent">9</button>
      <button @click="remove">删除</button>
      <button @click="inputContent">4</button>
      <button @click="inputContent">5</button>
      <button @click="inputContent">6</button>
      <button @click="clear">清空</button>
      <button @click="inputContent">1</button>
      <button @click="inputContent">2</button>
      <button @click="inputContent">3</button>
      <button @click="equal" class="equal"
              v-if="isCount">=
      </button>
      <button @click="ok" class="ok"
              v-else>ok
      </button>
      <button @click="inputContent" class="zero">0</button>
      <button @click="inputContent">.</button>
    </div>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';

  @Component
  export default class NumberPad extends Vue {
    @Prop() readonly value!: number;
    output = this.value.toString();
    isOver = true;
    one = false;
    two = false;


    get recordList() {
      return this.$store.state.recordList;
    }

    get dotLast() {
      return this.output.charAt(this.output.length - 1) === '.';
    }

    get operatorLast() {
      return this.output.charAt(this.output.length - 1) === '÷' || this.output.charAt(this.output.length - 1) === '×' || this.output.charAt(this.output.length - 1) === '+' || this.output.charAt(this.output.length - 1) === '-';
    }

    get isHaveOperator() {
      return this.output.indexOf('÷') >= 0 || this.output.indexOf('+') >= 0 || this.output.indexOf('×') >= 0 || this.output.indexOf('-') >= 0;
    }

    get isCount() {
      return this.isHaveOperator || this.dotLast;
    }

    inputContent(event: MouseEvent) {
      const button = (event.target as HTMLButtonElement);
      const input = button.textContent!;

      if (this.output.length === 12) {
        this.one = true;
      } else if (this.output.length === 16) {
        this.two = true;
      } else if (this.output.length === 22) {
        window.alert('输入金额过长');
        return;
      }  //输入过长

      if (this.output === '0') {
        if ('0123456789'.indexOf(input) >= 0) {
          this.output = input;
        } else {
          this.output += input;
        }
        return;
      }     //0时输入

      if (this.isHaveOperator) {
        if (this.operatorLast && '÷×+-'.indexOf(input) >= 0) {
          this.output = this.output.slice(0, this.output.length - 1) + input;
          return;
        } else if ('÷×+-'.indexOf(input) >= 0) {
          this.count();
        }
      }  //输入运算符：最后一个替换


      if (this.output.indexOf('.') >= 0 && input === '.') {
        if (this.isHaveOperator) {
          if (this.output.split('.').length === 3) {
            return;
          }
        } else {
          return;
        }
      }   //符号两边只能有一个小数点

      if (this.dotLast && '÷×+-'.indexOf(input) >= 0) {
        this.output += 0;
        if (this.output === '0.0') {
          this.output = '0';
        }
      }    //当在【.】后面直接输入加减乘除号时，点后加0或者把点取消

      if (this.operatorLast && input === '.') {
        this.output += 0; //这个试出来的
      }   // //在加减乘除号后面输入【.】时

      if (!this.isOver) {
        this.output = '';
        this.isOver = true;
      }

      this.output += input;
    }

    remove() {
      if (this.output.length === 1) {
        this.output = '0';
      } else {
        this.output = this.output.slice(0, -1);
      }
      if (this.output.length < 16) {
        this.two = false;
      }
      if (this.output.length < 12) {
        this.one = false;
      }
    }

    clear() {
      this.output = '0';
      this.one = false;
      this.two = false;
    }

    division() {
      let [a, b] = this.output.split('÷');
      a = a || '0';  //输入【4÷】结果NaN的bug
      b = b || '1';
      const result = (parseFloat(a) / parseFloat(b)).toFixed(2);
      this.output = '' + parseFloat(result);
    }

    times() {
      let [a, b] = this.output.split('×');
      a = a || '0';
      b = b || '1';
      const result = (parseFloat(a) * parseFloat(b)).toFixed(2);
      this.output = '' + parseFloat(result);
    }

    add() {
      let [a, b] = this.output.split('+');
      a = a || '0';
      b = b || '0';
      const result = (parseFloat(a) + parseFloat(b)).toFixed(2);
      this.output = '' + parseFloat(result);
    }

    minus() {
      let [a, b] = this.output.split('-');
      a = a || '0';
      b = b || '0';
      const result = (parseFloat(a) - parseFloat(b)).toFixed(2);
      this.output = '' + parseFloat(result);
    }

    equal() {
      this.count();
      if (this.dotLast) {
        this.output = this.output.slice(0, this.output.length - 1);
      }
      this.isOver = false;
    }

    count() {
      if (this.output.indexOf('÷') >= 0) {
        this.division();
      } else if (this.output.indexOf('×') >= 0) {
        this.times();
      } else if (this.output.indexOf('+') >= 0) {
        this.add();
      } else if (this.output.indexOf('-') >= 0) {
        this.minus();
      }
    }


    ok() {
      const moneyValue = parseFloat(parseFloat(this.output).toFixed(2));
      this.$emit('update:value', moneyValue);//把输入的字符串变成数字记入账单
      this.$emit('submit', moneyValue);
      this.output = '0';
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/helper.scss";

  %addMoneyStyle {
    background: rgb(8, 11, 15);
    color: rgb(255, 255, 255);
    font-size: 22px;
    font-weight: bold;
  }

  .inputNumber {
    @extend %innerShadow;
    @extend %addMoneyStyle;
    font-size: 36px;
    font-family: Consolas, monospace;
    padding: 7px;
    height: 72px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    word-break: break-all;
    overflow: hidden;

    &.first {
      font-size: 30px;
    }

    &.second {
      font-size: 24px;
    }
  }

  .numberPad {
    @extend %clearFix;

    button {
      @extend %addMoneyStyle;
      width: 25%;
      height: 60px;
      float: left;
      border: 1px solid #999999;

      &.ok,
      &.equal {
        height: 60*2px;
        float: right;
      }

      &.zero {
        width: 25*2%;
      }

      /*$bg: rgb(8,11,15);*/

      /*      &:nth-child(1) {
              background: $bg;
            }

            &:nth-child(2), &:nth-child(5) {
              background: darken($bg, 4%);
            }

            &:nth-child(3), &:nth-child(6), &:nth-child(9) {
              background: darken($bg, 4*2%);
            }

            &:nth-child(4), &:nth-child(7), &:nth-child(10) {
              background: darken($bg, 4*3%);
            }

            &:nth-child(8), &:nth-child(11), &:nth-child(13) {
              background: darken($bg, 4*4%);
            }

            &:nth-child(14) {
              background: darken($bg, 4*5%);
            }

            &:nth-child(12) {
              background: darken($bg, 4*6%);
            }*/
    }
  }
</style>