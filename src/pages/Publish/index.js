import { Card, Breadcrumb, Form, Button, Radio, Input, Upload, Space, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import './index.scss'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useStore } from '@/store'
import { useEffect, useRef, useState } from 'react'
import { http } from '@/utils'

const { Option } = Select

const Publish = () => {
    const { channelStore } = useStore()

    const navigate = useNavigate()

    // 存放上传图片的列表
    const [fileList, setFileList] = useState([])
    // 使用useRef声明一个暂存仓库
    const cacheImgList = useRef([])
    const onUploadChange = ({ fileList }) => {
        console.log(fileList)

        // 数据格式化, 防止bug
        const formatList = fileList.map(file => {
            if (file.response) {
                return {
                    url: file.response.data.url
                }
            }
            return file
        })

        setFileList(formatList)
        // 在暂时仓库中存储一份图片列表
        cacheImgList.current = formatList
    }

    // 图片状态切换
    const [imgCount, setImgCount] = useState(1)
    const radioChange = (e) => {
        console.log(e.target.value)
        const rawValue = e.target.value
        setImgCount(rawValue)

        // 从暂存仓库里去取应的图片数量 交给我们用来渲染图片列表的fileList
        // 无图
        if (cacheImgList.current.length === 0) {
            return false
        }
        if (rawValue === 1) {
            const img = cacheImgList.current[0]
            setFileList([img])
        } else if (rawValue === 3) {
            setFileList(cacheImgList.current)
        }
    }

    // 提交表单
    const onFinish = async (values) => {
        // console.log(values)
        // 处理数据
        const { channel_id, content, title, type } = values
        const params = {
            channel_id,
            content,
            title,
            type,
            cover: {
                type,
                images: fileList.map(item => item.url)
                // images: fileList.map(item => item.url)
            }
        }
        console.log(params)
        if (id) {
            await http.put(`/mp/articles/${id}?draft=false`, params)
        } else {
            await http.post('/mp/articles?draft=false', params)
        }
        // 发布完成后进行跳转
        navigate('/article')
        message.success(`${id ? '更新成功' : '发布成功'}`)
    }

    // 编辑功能
    const [params] = useSearchParams()
    const id = params.get('id')
    console.log('route:', id)
    // 数据回填
    const form = useRef(null)
    useEffect(() => {
        const loadDetail = async () => {
            const res = await http.get(`/mp/articles/${id}`)
            const data = res.data
            // 表单数据回填
            form.current.setFieldsValue({ ...data, type: data.cover.type })

            // 抽取相同数据结构
            const formatImgList = data.cover.images.map(url => {
                return {
                    url
                }
            })
            // // 回填upload
            // setFileList(data.cover.images.map(url => {
            //     return {
            //         url
            //     }
            // }))
            // // 暂存仓库里存一份
            // cacheImgList.current = data.cover.images.map(url => {
            //     return {
            //         url
            //     }
            // })
            // 回填upload
            setFileList(formatImgList)
            // 暂存仓库里存一份
            cacheImgList.current = formatImgList
        }
        if (id) {
            loadDetail()
            // console.log(form.current)
        }
    }, [id])

    return (
        <div className='publish'>
            <Card
                title={
                    <Breadcrumb separator='>'>
                        <Breadcrumb.Item>
                            <Link to='/home'>首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{id ? '编辑' : '发布'}文章</Breadcrumb.Item>
                    </Breadcrumb>
                }
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ type: 1 }}
                    onFinish={onFinish}
                    ref={form}
                >
                    <Form.Item
                        label='标题'
                        name='title'
                        rules={[{ required: true, message: '请输入文章标题' }]}
                    >
                        <Input placeholder='请选择文章频道' style={{ width: 300 }}></Input>
                    </Form.Item>
                    <Form.Item
                        label='频道'
                        name='channel_id'
                        rules={[{ required: true, message: '请选择文章频道' }]}
                    >
                        <Select placeholder='请选择文章频道' style={{ width: 200 }}>
                            {channelStore.channelList.map(item => (
                                <Option key={item.id} value={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label='封面'>
                        <Form.Item name='type'>
                            <Radio.Group onChange={radioChange}>
                                <Radio value={1}>单图</Radio>
                                <Radio value={3}>三图</Radio>
                                <Radio value={0}>无图</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {imgCount > 0 && (
                            <Upload
                                name='image'
                                listType='picture-card'
                                className='avatar-uploader'
                                showUploadList
                                action='http://geek.itheima.net/v1_0/upload'
                                fileList={fileList}
                                onChange={onUploadChange}
                                multiple={imgCount > 1}
                                maxCount={imgCount}
                            >
                                <div style={{ marginTop: 8 }}>
                                    <PlusOutlined />
                                </div>
                            </Upload>
                        )}

                    </Form.Item>

                    {/* 富文本组件被Form.Item控制, 其输入内容会在onFinish回调中收集起来 */}
                    <Form.Item
                        label='内容'
                        name='content'
                        rules={[{ required: true, message: '请输入文章内容' }]}
                    >
                        <ReactQuill
                            className='publish-quill'
                            theme='snow'
                            placeholder='请输入文章内容'
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 4 }}>
                        <Space>
                            <Button size='large' type='primary' htmlType='submit'>
                                {id ? '更新' : '发布'}文章
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default observer(Publish)