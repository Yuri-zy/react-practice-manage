import { Layout, Menu, Popconfirm } from 'antd'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { HomeOutlined, DiffOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons'
import './index.scss'

const { Header, Sider } = Layout

const GeekLayout = () => {
    const navigate = useNavigate()
    // const location = useLocation()
    // console.log(location)
    const { pathname } = useLocation()

    const highlight = () => {
        if (pathname === '/') {
            return ['1']
        } else if (pathname === '/article') {
            return ['2']
        } else if (pathname === '/publish') {
            return ['3']
        }
    }
    return (
        <Layout>
            <Header className='header'>
                <div className='logo' />
                <div className='user-info'>
                    <span className='user-name'>user.name</span>
                    <span className='user-logout'>
                        <Popconfirm title='是否确认退出?' okText='退出' cancelText='取消'>
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

export default GeekLayout