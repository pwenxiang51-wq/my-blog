---
title: Windows安装Git并拉取Hexo博客源码备份
date: 2026-01-05T16:56:00.000+08:00
---



虽然我的博客已经实现了云端自动发布，但在本地电脑保留一份源码备份（以及为了以后修改主题代码）是非常有必要的。

本文记录了在 Windows 电脑上从零安装 Git，并把 GitHub 上的博客仓库拉取到桌面的详细操作步骤。

### 一、下载与安装 Git

1. 下载安装包
   访问 Git 官方网站下载 Windows 版本：[git-scm.com/download/win](https://git-scm.com/download/win)
   *选择 "64-bit Git for Windows Setup" 进行下载。*
2. 安装过程
   双击运行下载好的 `.exe` 文件。

   * 安装路径：保持默认的 `C:\Program Files\Git` 不变。
   * 配置选项：不需要修改任何设置。
   * 操作策略：一路点击 "Next" (下一步)，直到点击 "Install" 开始安装，最后点击 "Finish" 结束。

### 二、配置 Git 身份信息

Git 安装完成后，必须配置“用户名”和“邮箱”，否则 GitHub 无法识别提交者的身份。

1. 打开命令行
   按键盘上的 `Win` 键，输入 `cmd` 并回车，打开黑色的命令提示符窗口。
2. 输入配置命令
   依次复制以下两行命令并在 CMD 中执行（每行输入后按回车）：

`git config --global user.name "Velo.x"`

`git config --global user.email "你的GitHub邮箱@example.com"`
*(记得把上面邮箱换成你自己的)*

### 三、拉取博客源码到本地

这是最关键的一步，将云端的 GitHub 仓库完整克隆到本地电脑的桌面上。

在 CMD 窗口中，直接复制执行以下命令：

`cd Desktop && git clone https://github.com/pwenxiang51-wq/my-blog.git`

命令解析：

* `cd Desktop`：将当前位置切换到电脑桌面。
* `git clone ...`：从 GitHub 下载我的博客仓库。

### 四、结果验证

执行完上述步骤后，查看电脑桌面。
如果出现了一个名为 `my-blog` 的文件夹，且里面包含 `_config.yml` 等文件，即说明操作成功。

以后的使用场景：

* 日常写作：直接使用网页版 Admin 后台即可。
* 修改主题/代码：进入桌面这个 `my-blog` 文件夹修改，改完后通过 Git 推送回 GitHub。
