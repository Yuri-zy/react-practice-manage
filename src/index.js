import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// 导入antd样式文件
import 'antd/dist/antd.min.css'
// 引入index.scss文件
import './index.scss'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // 严格模式, 使用脚手架创建项目默认会启用, 会出现双调用的现象
  // 严格模式检查只在开发模式下运行, 不会与生产模式冲突
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);