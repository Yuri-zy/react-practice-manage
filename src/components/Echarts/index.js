// 封装echarts图表组件
import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

function ECharts({ title, xData, yData, style }) {
    const domRef = useRef()
    const chartInit = () => {
        // 基于准备好的dom，初始化echarts实例
        // const myChart = echarts.init(document.getElementById('main'));
        const myChart = echarts.init(domRef.current);
        // 绘制图表
        myChart.setOption({
            title: {
                text: title
            },
            tooltip: {},
            xAxis: {
                data: xData
            },
            yAxis: {},
            series: [
                {
                    name: '销量',
                    type: 'bar',
                    data: yData
                }
            ]
        });
    }

    // 执行echarts初始化函数
    useEffect(() => {
        chartInit()
    }, [])

    return (
        <div>
            {/* 准备一个挂载节点 */}
            <div ref={domRef} style={style}></div>
        </div>
    )
}

export default ECharts