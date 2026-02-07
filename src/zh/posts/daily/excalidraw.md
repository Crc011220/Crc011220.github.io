---
icon: pen-to-square
date: 2026-02-07
category:
  - Daily Notes
tag:
  - Notes
---

# Excalidraw

Excalidraw 是一个开源的虚拟白板，用于绘制手绘风格的流程图，支持多人协作编辑。

## 产品特点

- **开源**：MIT 协议，可自由使用和二次开发
- **手绘风格**：流程图呈现手绘、草图效果
- **协作编辑**：支持多人实时协同编辑

## 使用方式

### 本地部署

```bash
# 使用 create-excalidraw-app 创建项目
npx create-excalidraw-app my-app

# 启动开发服务器
cd my-app
npm run dev
```

### Docker 部署

```bash
docker run --rm -dit --name excalidraw -p 80:80 excalidraw/excalidraw
```

### 在线使用

直接访问 [excalidraw.com](https://excalidraw.com) 无需安装。

### 自托管

可以通过 Docker 或 npm 安装，部署到自己的服务器上。

## 自定义服务

可以与自己的后端集成，实现定制功能：

- **协作编辑**：基于 WebSocket + Yjs（CRDT）实现多人实时协同
- **持久化**：将画布数据存储到自己的数据库
- **鉴权**：实现自己的登录和权限控制
