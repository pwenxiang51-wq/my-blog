---
title: 【终极进化】Hexo + Cloudflare + Qexo：从“黑框受难”到“全自动CMS管理
date: 2026-01-07T14:06:00.000+08:00
tags:
  - Hexo
  - Qexo
  - Cloudflare
  - 自动化部署
categories:
  - 建站实录
index_img: /images/banner.jpg
banner_img: /images/article.jpg
---

## 💥 从崩溃开始
昨天下午，为了给博客换个背景图，差点把心态搞崩。
本地 CMD 黑框框各种报错：`FATAL YAMLException`、`deploy` 没反应、背景图配置冲突……折腾了半天，博客差点原地爆炸。

但正是这次折腾，让我下定决心彻底重构博客的发布流程。
**目标：抛弃本地黑框，实现“像用 WordPress 一样管理 Hexo”。**

---

## 🛠️ 第一步：底层修复（排雷）
在自动化之前，先解决了本地配置的几个大坑：

1.  **YAML 语法地狱**：
    `_config.yml` 里重复定义了 `deploy` 字段，导致 Hexo 无法识别发布配置。
    **教训**：配置文件里同一个 Key 绝对不能出现两次！

2.  **Cloudflare 的中文陷阱**：
    在配置 Cloudflare Pages 时，因为浏览器自动翻译，导致构建命令变成了 `npx hexo 生成`，输出目录变成了 `民众`。
    **修正**：必须严格使用英文指令 `hexo generate` 和 `public`。

---

## 🚀 第二步：架构飞升（云端自动化）

我做了一个关键决定：**不再在本地生成网页，而是把“源码”交给云端。**

1.  **强制推送源码**：
    利用 `git push --force` 将本地的 Hexo 源文件（包含 `_config.yml` 和 `scaffolds` 等）推送到 GitHub 的 `main` 分支。
    
2.  **接管构建**：
    Cloudflare Pages 绑定 GitHub 仓库，一旦检测到源码变动，立刻在云端执行 `hexo g`，自动完成部署。

---

## 👑 第三步：终极形态（Qexo 在线后台）

既然已经云端自动化了，为什么还要用 VS Code 写文章？
我部署了 **Qexo** 在线管理后台，直接对接 GitHub 仓库。

**现在的发布流程极其丝滑：**
1.  **打开后台**：浏览器访问我的 Qexo 管理面板。
2.  **在线写作**：像写 Word 一样编辑文章，支持 Markdown 实时预览。
3.  **一键发布**：点击保存。
    * 👉 Qexo 自动把文章推送到 **GitHub**（实现自动备份）。
    * 👉 Cloudflare 自动检测到 GitHub 更新，开始**构建部署**。
    * 👉 1分钟后，全球 CDN 自动刷新。

---

## 📝 总结
现在的我：
* ❌ 不需要打开本地 CMD 黑框。
* ❌ 不需要担心电脑坏了丢失文章（GitHub 实时存着）。
* ✅ 随时随地，手机/iPad 打开网页就能写博客。

这才是 2026 年写博客该有的样子。😎
