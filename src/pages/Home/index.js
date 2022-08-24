import './index.scss'
import ECharts from '@/components/Echarts'

// 如何在react获取dom？  useRef
// 在什么地方获取dom节点？  useEffect  

function Home() {

    return (
        <div>
            {/* 渲染ECharts 组件 */}
            <ECharts
                title='主流框架使用满意度'
                xData={['react', 'vue', 'angular']}
                yData={[30, 40, 50]}
                style={{ width: '500px', height: '400px' }}
            />
            <ECharts title='主流框架使用满意度2'
                xData={['react', 'vue', 'angular']}
                yData={[60, 50, 40]}
                style={{ width: '300px', height: '200px' }}
            />
        </div>
    )
}

export default Home