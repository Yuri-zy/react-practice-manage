import { Link, useNavigate } from "react-router-dom"
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import 'moment/locale/zh-cn'
import locale from "antd/es/date-picker/locale/zh_CN"
import img404 from '@/assets/error.png'
import './index.scss'
import { useEffect, useState } from "react"
import { http } from "@/utils"
import { useStore } from "@/store"
import { observer } from "mobx-react-lite"

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
    // 在channel.Store.js 中重构了
    // // 频道列表管理
    // const [channelList, setChannelList] = useState([])

    // // useEffect的依赖项非常必要，不注意容易出现循环执行
    // // 在里面写会引起组件重新渲染的逻辑，重新渲染会导致useEffect再次执行
    // useEffect(() => {
    //     const loadChannelList = async () => {
    //         const res = await http.get('/channels')
    //         setChannelList(res.data.channels)
    //     }
    //     loadChannelList()
    // }, [])

    const { channelStore } = useStore()

    // 文章列表管理 统一管理数据
    const [articleData, setArticleData] = useState({
        // 文章列表
        list: [],
        // 文章数量
        count: 0
    })

    // 文章参数管理
    const [params, setParams] = useState({
        page: 1,
        per_page: 10
    })

    // 如果异步请求函数需要依赖一些数据的变化儿重新执行
    // 推荐写到内部
    // 涉及到异步请求的函数 都放到useEffect内部
    // useEffect的条件执行实现方式：
    // 给useEffect传递第二个参数，它是effect所依赖的值数组，当数组不为空时，数组内的数据发生变化effect才会更新
    useEffect(() => {
        const loadList = async () => {
            const res = await http.get('/mp/articles', { params })
            // console.log(res)
            const { results, total_count } = res.data
            setArticleData({
                list: results,
                count: total_count
            })
        }
        loadList()
    }, [params])

    const onFinish = (values) => {
        console.log(values);
        const { channel_id, date, status } = values
        // 数据处理
        const _params = {}
        if (channel_id) {
            _params.channel_id = channel_id
        }
        if (date) {
            _params.begin_pubdate = date[0].format('YYYY-MM-DD')
            _params.end_pubdate = date[1].format("YYYY-MM-DD")
        }
        if (status !== -1) {
            _params.status = status
        }

        // 修改params数据, 引起接口的重新发送
        setParams({
            ...params,
            ..._params
        })

    }

    const pageChange = (page) => {
        setParams({
            ...params,
            page
        })
    }

    // const formatStatus = (type) => {
    //     const TYPES = {
    //         1: <Tag color="red">审核失败</Tag>,
    //         2: <Tag color="green">审核成功</Tag>
    //     }
    // }

    // 删除文章
    const delArticle = async (data) => {
        console.log(data)
        await http.delete(`/mp/articles/${data.id}`)
        // 刷新列表
        setParams({
            ...params,
            page: 1
        })
    }

    // 编辑文章
    const navigate = useNavigate()
    const goPublish = (data) => {
        navigate(`/publish?id=${data.id}`)
    }

    const columns = [
        {
            title: '封面',
            dataIndex: 'cover',
            render: cover => {
                return <img src={cover.images[0] || img404} width={200} height={150} alt="" />
            }
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 220
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: data => <Tag color='green'>审核通过</Tag>
        },
        {
            title: '发布时间',
            dataIndex: 'pub_date'
        },
        {
            title: '阅读数',
            dataIndex: 'read_count'
        },
        {
            title: '评论数',
            dataIndex: 'comment_count'
        },
        {
            title: '点赞数',
            dataIndex: 'like_count'
        },
        {
            title: '操作',
            render: data => {
                return (
                    <Space size='middle'>
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => goPublish(data)}
                        ></Button>
                        <Button
                            type="primary"
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={() => delArticle(data)}
                        />
                    </Space>
                )
            }
        }
    ]

    return (
        <div>
            {/* 筛选区域 */}
            <Card
                title={
                    <Breadcrumb separator='>'>
                        <Breadcrumb.Item>
                            <Link to='/home'>首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>内容管理</Breadcrumb.Item>
                    </Breadcrumb>
                }
                style={{ marginBottom: 20 }}
            >
                <Form
                    initialValues={{ status: -1 }}
                    onFinish={onFinish}
                >
                    <Form.Item label='状态' name='status'>
                        <Radio.Group>
                            <Radio value={-1}>全部</Radio>
                            <Radio value={0}>草稿</Radio>
                            <Radio value={1}>待审核</Radio>
                            <Radio value={2}>审核通过</Radio>
                            <Radio value={3}>审核失败</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label='频道' name='channel_id'>
                        <Select
                            placeholder='请选择文章频道'
                            style={{ width: 120 }}
                        >
                            {channelStore.channelList.map(channel => <Option key={channel.id} value={channel.id}>{channel.name}</Option>)}

                        </Select>
                    </Form.Item>
                    <Form.Item label='日期' name='date'>
                        {/* 传入locale属性, 控制中文显示 */}
                        <RangePicker locale={locale}></RangePicker>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
                            筛选
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            {/* 文章列表区域 */}
            <Card title={`根据筛选条件共查询到 ${articleData.count} 条结果: `}>
                <Table
                    rowKey='id'
                    columns={columns}
                    dataSource={articleData.list}
                    pagination={{
                        pageSize: params.per_page,
                        total: articleData.count,
                        onChange: pageChange
                    }}
                ></Table>
            </Card>
        </div>
    )
}

export default observer(Article)