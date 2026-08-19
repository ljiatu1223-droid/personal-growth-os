# 个人成长操作系统（Growth OS）

一个苹果设计风格的 PWA（渐进式 Web 应用），用于管理 30 天个人成长计划：健身、拍摄剪辑、烹饪、小提琴四大模块。

## 在线访问

**https://ljiatu1223-droid.github.io/personal-growth-os/**

支持「添加到主屏幕」，安装后可像原生 App 一样全屏使用，并支持离线打开。

## 功能特性

- **今日看板**：当日任务聚合、待办中/进行中/已完成/待补证据状态流转
- **计划（周/月视图）**：30 天任务全景、任务调整（改期）、跳过、补证据
- **成长档案**：连续打卡、完成率、时长统计、四模块进度
- **我的**：数据导出/导入（JSON 备份）、深浅色主题切换
- **课程引擎**：教学卡片、清单勾选、记录输入、计时器、证据上传、自评打分六类组件
- **纯本地存储**：所有数据保存在浏览器 localStorage，不上传服务器

## 本地运行

```bash
# 任意静态服务器均可，例如：
python3 -m http.server 8080
# 打开 http://localhost:8080
```

> Service Worker 需在 localhost 或 HTTPS 环境下生效。

## 技术栈

原生 HTML / CSS / JavaScript，零依赖、零构建，PWA（manifest + Service Worker）。

## 目录结构

```
├── index.html      # 应用外壳与页面结构
├── styles.css      # 设计令牌与组件样式（苹果设计风格）
├── mock.js         # 课程内容与初始数据
├── app.js          # 状态管理、路由与课程引擎
├── manifest.json   # PWA 清单
├── sw.js           # Service Worker（离线缓存）
└── icon-*.png      # 应用图标
```
