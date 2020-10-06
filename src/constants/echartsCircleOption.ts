function echartsCircleOption(monthTag: string[],monthRecord: Record<string, any>[], type: string) {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(100,100,100,0.4)',
      extraCssText: 'z-index: 5',
      position: 'right',
      confine:true,
      alwaysShowContent: true
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
        radius: ['60%', '89%'],
        minAngle: 30,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
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