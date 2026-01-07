---
title: "[安全] 终极防盗门：配置 SSH 密钥登录并禁用密码"
date: 2024-05-03T21:45:00.000+08:00
---


改了端口、装了 Fail2Ban 只是增加了破解难度，而 **SSH 密钥登录** 才是真正把“门锁”焊死。

它的原理是：在你的电脑生成一对“钥匙”（公钥和私钥），把公钥丢给 VPS。以后登录时，VPS 核对你手里的私钥，对上了就直接放行，根本不需要输入密码。

---

## 🔑 第一步：在本地电脑生成密钥

这一步在你自己的电脑（Windows CMD 或 Mac 终端）上操作，**不要连 VPS**。

1.  打开 CMD (Windows) 或 终端 (Mac)。
2.  输入生成命令：

    ssh-keygen -t ed25519 -C "my-vps-key"

3.  一路按回车（不需要设密码）。
4.  生成的密钥会保存在你的用户目录下（通常是 `.ssh` 文件夹）。

---

## 📤 第二步：把“公钥”装进 VPS

我们需要把刚才生成的 **公钥 (Public Key)** 内容复制到 VPS 上。

1.  **查看公钥内容**：

    * Windows CMD 输入： `type %userprofile%\.ssh\id_ed25519.pub`
    * Mac/Linux 输入： `cat ~/.ssh/id_ed25519.pub`

    *(你会看到以 `ssh-ed25519` 开头的一长串字符，把它完整复制下来。)*

2.  **粘贴到 VPS**：

    * 连接你的 VPS：`ssh root@你的IP -p 56789`
    * 创建存放目录（如果没有）：

        mkdir -p ~/.ssh && chmod 700 ~/.ssh

    * 编辑授权文件（关键步骤）：

        nano ~/.ssh/authorized_keys

    * 在编辑器里**粘贴**你刚才复制的那串公钥。
    * 按 `Ctrl + O` 保存，`Ctrl + X` 退出。
    * 赋予正确权限（这一步很重要）：

        chmod 600 ~/.ssh/authorized_keys

---

## 🛡️ 第三步：验证密钥登录 (关键！)

{% note danger %}
**⚠️ 千万别急着关密码登录！**
先验证密钥好不好用。万一没配好又关了密码，你就进不去家门了。
{% endnote %}

1.  **新开**一个本地 CMD 窗口。
2.  输入登录命令：

    ssh root@你的IP -p 56789

3.  如果**没有让你输密码直接进了系统**，说明密钥配置成功！✅

---

## 🚫 第四步：禁用密码登录 (关门)

确认密钥能用后，我们把“密码登录”这个功能彻底关掉。以后谁想试密码都试不了。

1.  在 VPS 里编辑配置文件：

    nano /etc/ssh/sshd_config

2.  按键盘 `Ctrl + W` 搜索 `PasswordAuthentication`，找到后按如下修改（找不到就手动添加）：

    PasswordAuthentication no
    PubkeyAuthentication yes

3.  保存退出 (`Ctrl + O`, `Ctrl + X`)。
4.  重启 SSH 服务：

    systemctl restart sshd

---

## 📝 总结

从此以后，这台 VPS 只认你电脑里的那把“钥匙”。任何试图用密码撞库的黑客，连输入密码的框都看不见，只能在大门外干瞪眼。
