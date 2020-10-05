function echartsCircleOption(monthTag: string[],monthRecord: Record<string, any>[], type: string) {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(100,100,100,0.4)',
      extraCssText: 'z-index: 5',
      position: 'right',
      confine:true
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      left: 10,
      top: 'middle',
      selectedMode: false,
    },
    series: [
      {
        name: type === '-' ? '支出' : '收入',
        type: 'pie',
        radius: ['50%', '89%'],
        minAngle: 30,
        label: {
          show: true,
          position: 'inner',
          fontSize: '10',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '10',
            fontWeight: 'bold',
          }
        },
        labelLine: {
          show: false
        },
        data: monthRecord,
      }
    ]
  }
}

export default echartsCircleOption