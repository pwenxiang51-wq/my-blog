---
title: "[安全] 给 VPS 穿上防弹衣：配置 Fail2Ban 防止 SSH 暴力破解"
date: 2022-05-01T10:25:00.000+08:00
---


VPS 裸奔在公网上，每天都会有无数个脚本尝试暴力破解你的 SSH 密码。如果你已经修改了 SSH 默认端口（比如改为 56789），虽然能躲过大部分扫描，但加上 **Fail2Ban** 才是双重保险。

**Fail2Ban 的原理很简单：** 监控日志 -> 发现有人多次输错密码 -> 自动推算 IP -> **关进小黑屋 (防火墙拉黑)**。

### 📋 环境说明

* **系统**：Debian 11 / 12
* **SSH 端口**：`56789` (根据你实际修改的端口填写)

---

## 🛠️ 第一步：更新源并安装 Fail2Ban

首先更新系统软件包列表，然后直接安装：

    apt update && apt install fail2ban -y

---

## 📝 第二步：配置防护规则 (重点)

Fail2Ban 默认只监控 22 端口，因为我们改了端口（比如 56789），所以必须新建一个配置文件来告诉它监控哪里。

**直接复制下面整段代码**，粘贴到 SSH 终端并回车（这将自动生成配置文件）：

    cat > /etc/fail2ban/jail.local <<EOF
    [sshd]
    enabled = true
    port = 56789
    filter = sshd
    logpath = /var/log/auth.log
    maxretry = 5
    bantime = 3600
    findtime = 600
    EOF

{% note warning %}
**⚠️ 注意端口号！**
上面代码中的 `port = 56789` 必须改成你 **真实使用的 SSH 端口**。如果你没改过端口，就填 22。
{% endnote %}

---

## 🚀 第三步：启动并设置开机自启

配置写好后，重启服务即可生效，并设置为开机自动运行：

    systemctl restart fail2ban && systemctl enable fail2ban

---

## ✅ 第四步：验证是否有效

你可以使用以下命令查看 SSH 防护模块的状态：

    fail2ban-client status sshd

如果看到 `Status` 显示为 **active**，并且 `Jail list` 里有 `sshd`（或者空列表），如下图所示：

<img src="/images/屏幕截图-2026-01-06-155829.png" style="width: 100%; display: block; margin: 10px 0;" />

说明防护罩已经打开了！

---

## 💡 附：Fail2Ban 常用维护命令

**1. 解封某个 IP**
(万一你自己手误输错密码被封了，用这个命令救自己)：

    fail2ban-client set sshd unbanip 1.2.3.4

**2. 查看 Fail2Ban 运行日志**
(看看今天又有多少倒霉蛋被封了)：

    tail -f /var/log/fail2ban.log
