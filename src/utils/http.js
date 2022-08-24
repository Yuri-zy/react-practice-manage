// 封装axios
// 实例化 请求拦截器  响应拦截器

import axios from "axios"
import { history } from "./history"
import { getToken } from "./token"

// export function request(config) {
//     const http = axios.create({
//         baseURL: 'http://geek/itheima/net/v1_0',
//         timeout: 5000
//     })
//     // 添加请求拦截器
//     http.interceptors.request.use((config) => {
//         return config
//     }, (error) => {
//         return Promise.reject.error
//     })

//     // 添加响应拦截器
//     http.interceptors.response.use((response) => {
//         // 2xx 范围内的状态码都会触发该函数
//         // 对响应数据做点什么
//         return response
//     }, (error) => {
//         // 超出 2xx 范围的状态码都会触发该函数
//         // 对响应错误做点什么
//         return Promise.reject(error)
//     })
// }


// 创建实例
const http = axios.create({
    baseURL: 'http://geek.itheima.net/v1_0',
    timeout: 5000
})
// 添加请求拦截器
http.interceptors.request.use((config) => {
    // if not login add token
    const token = getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject.error
})

// 添加响应拦截器
http.interceptors.response.use((response) => {
    // 2xx 范围内的状态码都会触发该函数
    // 对响应数据做点什么
    return response.data
}, (error) => {
    // 超出 2xx 范围的状态码都会触发该函数
    // 对响应错误做点什么
    // console.dir(error)
    if (error.response.status === 401) {
        // reactRouter默认状态下. 并不支持在组件之外完成路由跳转
        // 跳转到登录界面
        // 可以实现跳转, 教程为什么不用存疑
        // window.location.href = '/login'
        history.push('/login')
    }
    return Promise.reject(error)
})

export { http }