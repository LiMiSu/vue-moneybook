function echartsCircleOption(monthTag: string[],monthRecord: Record<string, any>[], type: string) {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      alwaysShowContent: false,
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      left: 10,
      data: monthTag,
      top: 'middle',
      selectedMode: false,
    },
    series: [
      {
        name: type === '-' ? '支出金额' : '收入金额',
        type: 'pie',
        radius: ['50%', '70%'],

        // avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold'
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