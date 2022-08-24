// login module
import { makeAutoObservable, runInAction } from 'mobx'
import { http, setToken, getToken, removeToken } from '@/utils'

class LoginStore {
    token = getToken() || ''
    constructor() {
        // 响应式
        makeAutoObservable(this)
    }
    getToken = async ({ mobile, code }) => {
        // 调用登录接口
        const res = await http.post('http://geek.itheima.net/v1_0/authorizations', {
            mobile, code
        })
        // Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed.
        runInAction(() => {
            // 存入token
            this.token = res.data.token
            // 存入ls
            setToken(this.token)
        })
    }
    // 清除Token, 退出登录
    clearToken = () => {
        this.token = ''
        removeToken()
    }
}

export default LoginStore