import dayjs from 'dayjs';

function echartsLineOptionOption(monthKeys: string[],
                                 monthValues: number[] ,
                                 yearKeys: string[],
                                 yearValues: number[],
                                 interval: string,
                                 type: string) {
  return {
    xAxis: {
      type: 'category',
      data: interval === 'year' ? yearKeys : monthKeys,
      axisLabel: {
        formatter: function (value: string) {
          return interval === 'year' ? value.substr(5) : value.substr(8);
        },
        fontSize: 10,
        color: '#999999'
      },
      axisLine: {
        color: '#999999'
      },
      splitLine: {
        show: true,
        interval: 0,
      },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value: string) {
          if (value.toString().length === 5) {
            value = +value / 10000 + '万';
          } else if (value.toString().length === 6) {
            value = +value / 100000 + '十万';
          } else if (value.toString().length === 7) {
            value = +value / 1000000 + '百万';
          } else if (value.toString().length === 8) {
            value = +value / 10000000 + '千万';
          } else if (value.toString().length === 9) {
            value = +value / 100000000 + '亿';
          } else if (value.toString().length === 10) {
            value = +value / 1000000000 + '十亿';
          } else if (value.toString().length === 11) {
            value = +value / 10000000000 + '百亿';
          } else if (value.toString().length === 12) {
            value = +value / 100000000000 + '千亿';
          } else if (value.toString().length >= 13) {
            value = '...亿';
          }
          return value;
        },
        axisLine: {
          color: '#999999'
        },
        color: '#999999',
        fontSize: 10,
        width: '40%',
      },
      axisTick: {
        show: false
      }
    },
    grid: {
      left: '12%',
      right: '10%',
      top: '10px'
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        animation: true,
        label: {
          color: '#fff',
        },
        lineStyle: {
          type: 'solid',
          width: 1,
          color: '#ccc',
        }
      },
      formatter: function (value: any) {
        const time = interval === 'year' ? dayjs(value[0].name).format('M') + '月' : dayjs(value[0].name).format('DD') + '日';
        const amount = type === '-' ? '支出：' + `${value[0].value}` + '元' : '收入：' + `${value[0].value}` + '元';
        return `${time}<br />${amount}`;
      },
    },
    series: [{
      data: interval === 'year' ? yearValues : monthValues,
      type: 'line',
      areaStyle: {},
      smooth: true,
      symbolSize: 5,
      symbol: 'none',
      lineStyle: {
        // color: 'blue',
      },
    }]
  };
}

export default echartsLineOptionOption