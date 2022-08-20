import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '@/pages/Login'
import Layout from '@/pages/Layout'
import './App.css'
import { AuthComponent } from './components/AuthComponent';
import Publish from './pages/Publish'
import Article from './pages/Article'
import Home from './pages/Home'

function App() {
  return (
    // 路由配置
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* 创建路由path和组件对应关系 */}
          {/* Layout 需要进行鉴权 */}
          {/* 此处Layout不一定不能写死, 要根据是否登录进行判断 */}
          <Route path='/' element={
            <AuthComponent>
              <Layout />
            </AuthComponent>
          }>
            <Route index element={<Home />}></Route>
            <Route path='article' element={<Article />}></Route>
            <Route path='publish' element={<Publish />}></Route>
          </Route>
          {/* 不需要 */}
          <Route path='/login' element={<Login />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
