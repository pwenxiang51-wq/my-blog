---
title: Windows 安装 Git 并拉取 Hexo 博客源码备份
date: 2025-11-02T04:01:00.000+08:00
---
虽然我的博客已经实现了云端自动发布，但在本地电脑保留一份源码备份（以及为了以后修改主题代码）是非常有必要的。

本文记录了在 **Windows** 电脑上从零安装 **Git**，并把 GitHub 上的博客仓库拉取到桌面的详细操作步骤。

## 📥 第一步：下载与安装 Git

1.  **下载安装包**
    访问 Git 官方网站下载 Windows 版本：
    [Git 官网下载](https://git-scm.com/download/win)

2.  **安装过程**
    * 双击运行下载好的 `.exe` 文件。
    * **一路狂按 Next (下一步)** 即可，所有选项保持默认设置，不需要修改。
    * 直到点击 **Install** 开始安装，最后点击 **Finish** 结束。

---

## ⚙️ 第二步：验证安装与基础配置

安装完成后，我们需要验证一下是否成功，并告诉 Git "我是谁"。

1.  **打开终端**
    在电脑桌面的任意空白处，**点击鼠标右键**，选择 **`Git Bash Here`**（或者 `Open Git Bash`）。
    * *此时会弹出一个黑色的命令框。*

2.  **验证版本**
    在黑框里输入下面这行代码，然后按回车：
    ```bash
    git --version
    ```
    * 如果出现类似 `git version 2.xx.x` 的字样，说明安装成功！✅

3.  **配置用户名和邮箱** (必做！)
    把下面的代码复制进去（记得把名字和邮箱改成你自己的），按回车执行：

    ```bash
    git config --global user.name "Velo.x"
    git config --global user.email "你的邮箱@example.com"
    ```

---

## ☁️ 第三步：拉取博客源码 (Clone)

现在，我们要把 GitHub 上的博客仓库“克隆”到你的本地电脑上。

1.  **获取仓库地址**
    打开你的 GitHub 仓库页面 (`my-blog`)，点击绿色的 **Code** 按钮，复制那个 `HTTPS` 链接。

2.  **执行克隆命令**
    回到刚才的 Git 黑框，输入：
    ```bash
    git clone [https://github.com/pwenxiang51-wq/my-blog.git](https://github.com/pwenxiang51-wq/my-blog.git)
    ```

3.  **完成！**
    你会发现桌面上多了一个叫 `my-blog` 的文件夹。以后你想修改博客配置，就在这个文件夹里改，改完推送到 GitHub 就行了！
