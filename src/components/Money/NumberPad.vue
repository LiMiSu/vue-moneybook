<template>
  <div>
    <div class="inputNumber">{{output}}</div>
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
    isOver = false;

    get recordList() {
      return this.$store.state.recordList;
    }

    get isCount() {
      //判断是否输入了加减乘除号
      return this.output.indexOf('÷') >= 0 || this.output.indexOf('×') >= 0 || this.output.indexOf('+') >= 0 || this.output.indexOf('-') >= 0||this.output.charAt(this.output.length-1)==='.';
    }

    inputContent(event: MouseEvent) {
      const button = (event.target as HTMLButtonElement);
      const input = button.textContent!;
      if (this.isOver) {
        if ('÷×+-'.indexOf(input) >= 0){
          this.output +=input;
        }else {
          this.output = '';
        }
        this.isOver = false;
      }
      if (this.output.length === 16) {
        alert('输入太多屏幕都放不下啦');
        return;
      }

      if (this.output === '0') {
        if ('0123456789'.indexOf(input) >= 0) {
          this.output = input;
        } else {
          this.output += input;
        }
        return;
      }

      if (this.output.indexOf('.') >= 0 && input === '.') {
        return;
      }

      //已经输入过加减乘除号就不能在重复输入
      if (this.isCount&&this.output.charAt(this.output.length-1)!=='.') {
        if ('÷×+-'.indexOf(input) >= 0) {
          return;
        }
      }

      //当在【.】后面直接输入加减乘除号时，点后加0或者把点取消
      //逛其他平台的计算器这个是不解决啊
      if (this.output.charAt(this.output.length - 1) === '.') {
        if ('÷×+-'.indexOf(input) >= 0) {
          // this.output += 0; //这个0.的时候不好看
          this.output=this.output.slice(0,this.output.length-1)
          if (this.output === '0.0') {
            this.output = '0';
          }
        }
      }

      //在加减乘除号后面输入【.】时
      if ('÷×+-'.indexOf(this.output.charAt(this.output.length - 1)) >= 0) {
        if (input === '.') {
          this.output += 0; //这个试出来的
        }
      }
      this.output += input;
    }

    remove() {
      if (this.output.length === 1) {
        this.output = '0';
      } else {
        this.output = this.output.slice(0, -1);
      }
    }

    clear() {
      this.output = '0';
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
      this.isOver = true;
      if (this.output.indexOf('÷') >= 0) {
        this.division();
      } else if (this.output.indexOf('×') >= 0) {
        this.times();
      } else if (this.output.indexOf('+') >= 0) {
        this.add();
      } else if (this.output.indexOf('-') >= 0) {
        this.minus();
      }else if (this.output.indexOf('.') >= 0){
        this.output=this.output.slice(0,this.output.length-1)
      }
    }


    ok() {
      this.$emit('update:value', parseFloat(this.output));//把输入的字符串变成数字记入账单
      this.$emit('submit', parseFloat(this.output));
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