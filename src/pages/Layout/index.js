import { Layout, Menu, Popconfirm } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { HomeOutlined, DiffOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons'
import './index.scss'
import { useStore } from '@/store'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'

const { Header, Sider } = Layout

const GeekLayout = () => {
    const navigate = useNavigate()
    // const location = useLocation()
    // console.log(location)
    // 获取当前激活的path路径
    const { pathname } = useLocation()
    const { userStore, loginStore, channelStore } = useStore()
    // userStore.getUserInfo()
    useEffect(() => {
        userStore.getUserInfo()
        channelStore.loadChannelList()
    }, [userStore, channelStore])

    const highlight = () => {
        if (pathname === '/') {
            return ['1']
        } else if (pathname === '/article') {
            return ['2']
        } else if (pathname === '/publish') {
            return ['3']
        }
    }

    // 确认退出
    const onConfirm = () => {
        // 退出登录, 删除token, 跳回到登录界面
        loginStore.clearToken()
        navigate('/login')
    }

    return (
        <Layout>
            <Header className='header'>
                <div className='logo' />
                <div className='user-info'>
                    <span className='user-name'>{userStore.userInfo.name}</span>
                    <span className='user-logout'>
                        <Popconfirm
                            onConfirm={onConfirm}
                            title='是否确认退出?'
                            okText='退出'
                            cancelText='取消'>
                            <LogoutOutlined /> 退出
                        </Popconfirm>
                    </span>
                </div>
            </Header>
            <Layout>
                <Sider width={200} className='site-layout-background'>
                    {/* 高亮  defaultSelectedKeys === item key */}
                    <Menu
                        mode='inline'
                        theme='dark'
                        defaultSelectedKeys={['1']}
                        selectedKeys={highlight()}
                        style={{ height: '100%', borderRight: 0 }}
                        items={[
                            {
                                key: '1',
                                icon: <HomeOutlined />,
                                label: '数据概览',
                                onClick: () => { navigate('/') }
                            },
                            {
                                key: '2',
                                icon: <DiffOutlined />,
                                label: '内容管理',
                                onClick: () => { navigate('/article') }
                            },
                            {
                                key: '3',
                                icon: <EditOutlined />,
                                label: '发布文章',
                                onClick: () => { navigate('/publish') }
                            },
                        ]}
                    >
                        {/* [antd: Menu] children will be removed in next major version. Please use items instead. */}
                        {/* <Menu.Item icon={<HomeOutlined />} key='1'>
                            数据概览
                        </Menu.Item>
                        <Menu.Item icon={<DiffOutlined />} key='2'>
                            内容管理
                        </Menu.Item>
                        <Menu.Item icon={<EditOutlined />} key='3'>
                            发布文章
                        </Menu.Item> */}
                    </Menu>
                </Sider>
                <Layout className='layout-content' style={{ padding: 20 }}>
                    {/* 二级路由出口 */}
                    <Outlet />
                </Layout>
            </Layout>
        </Layout>
    )
}

export default observer(GeekLayout)