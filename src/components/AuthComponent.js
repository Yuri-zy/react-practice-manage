// 1.判断token是否存在
// 2.存在 => 直接正常渲染
// 3.不存在 => 重定向到登录路由

import { getToken } from "@/utils"
import { Navigate } from "react-router-dom"

// 高阶组件: 把一个组件当成另外一个组件的参数传入
// 然后通过一定的判断, 返回新的组件

function AuthComponent({ children }) {
    const isToken = getToken()
    if (isToken) {
        return <>{children}</>
    } else {
        return <Navigate to='/login' replace />
    }
}

// <AuthComponent><Layout /></AuthComponent>
// 登录: <><Layout /></Layout>
// 非登录: <Navigate to="/login" replace />

export { AuthComponent }