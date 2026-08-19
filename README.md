# Outlook Reader (AO3 → Outlook 套壳扩展)

把 AO3（Archive of Our Own）伪装成 Microsoft Outlook 界面的 Edge/Chrome 浏览器扩展。

## 功能

- 访问 archiveofourown.org 任意页面自动套壳为 Outlook 三栏界面
- 搜索框 → AO3 作品搜索
- 邮件列表 → 搜索结果 / 最新更新 / 标签作品
- 阅读区 → 小说正文（含作者笔记、章节导航、Kudos 统计）
- 登录页 / NSFW 确认页也套壳为 Outlook 风格
- URL 加 `?view=raw` 可查看原始页面

## 安装

1. 打开 Edge，进入 `edge://extensions/`
2. 开启「开发人员模式」
3. 点击「加载解压缩的扩展」，选择本项目文件夹
4. 打开 archiveofourown.org 即可使用

## 结构

```
manifest.json   # MV3 配置
content.js      # 主页面套壳逻辑
login.js        # 登录页套壳
outlook.css     # Outlook 风格样式
bg.jpg          # 阅读区空态背景
icons/          # 扩展图标
```

## 说明

- 本扩展仅为个人学习用途，与微软或 AO3 无关
- 数据全部在本地浏览器中处理，不经过任何第三方服务器
