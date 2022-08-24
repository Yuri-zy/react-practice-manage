import { Card, Form, Input, Checkbox, Button, message } from 'antd'
import logo from '@/assets/logo.png'
import { useNavigate } from 'react-router-dom'
// 导入样式文件
import './index.scss'
import { useStore } from '@/store'

function Login() {
    const { loginStore } = useStore()
    const navigate = useNavigate()
    async function onFinish(values) {
        // console.log(values)
        // values: 放置的是所有表单项中用户输入的内容
        // todo: 登录
        try {
            await loginStore.getToken({
                mobile: values.username,
                code: values.password
            })
            // 跳转首页
            navigate('/', { replace: true })
            message.success('登录成功')
        } catch (e) {
            message.error(e.response?.data?.message || '登录失败')
        }
        return
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed', errorInfo)
    }

    return (
        <div className='login'>
            <Card className='login-container'>
                <img className='login-logo' src={logo} alt="" />
                {/* 登录表单 */}
                {/* 子项用到的触发事件, 需要在Form中声明才能使用 */}
                <Form
                    validateTrigger={['onBlur', 'onChange']}
                    initialValues={{
                        remember: true,
                        // password: '123456'
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入手机号！',
                            },
                            {
                                pattern: /^1[3-9]\d{9}$/,
                                message: '请输入正确的手机号!',
                                // 失去焦点才会触发
                                validateTrigger: 'onBlur'
                            }
                        ]}
                    >
                        <Input size='large' placeholder='请输入手机号' />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入验证码！',
                            },
                            {
                                len: 6,
                                message: '验证码为6位字符',
                                validateTrigger: 'onBlur'
                            }
                        ]}
                    >
                        <Input size='large' placeholder='请输入验证码' />
                    </Form.Item>
                    {/* 默认选中 */}
                    {/* <Form.Item name='remember' valuePropName='checked'> */}
                    <Form.Item
                        name="agreement"
                        valuePropName='checked'
                        rules={[
                            {
                                validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('请先勾选同意用户协议和隐私条款'))
                            }
                        ]}
                    >
                        <Checkbox className='login-checkbox-label'>
                            我已阅读并同意「用户协议」和「隐私条款」
                        </Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit' size='large' block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Login