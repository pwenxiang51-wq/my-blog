---
title: "[实战] 从零开始：VPS 节点搭建 + 域名绑定全流程 (勇哥脚本版)"
date: 2022-02-03T10:21:00.000+08:00
---
VPS 买了不能只当摆设。今天分享一套目前**最稳定、最优雅**的方案：
利用 **勇哥 (yonggekkk)** 的一键脚本搭建 **Sing-box** 节点，并配合 **Cloudflare** 绑定自定义域名。

这样不仅搭建简单（一行代码），而且以后连接节点用的就是你自己帅气的域名（如 `vps.222382.xyz`），而不是冷冰冰的 IP 数字。

{% note info %}
**准备工作：** 这一步需要你已经购买了 VPS，并且域名已经托管到了 Cloudflare。
{% endnote %}

---

## 🌐 第一步：域名解析 (Cloudflare)

在操作 VPS 之前，我们先去给它分配一个“门牌号”。

1.  登录 [Cloudflare 后台](https://dash.cloudflare.com/)，点击你的域名。
2.  进入左侧菜单的 **DNS** -> **Records (记录)**。
3.  点击蓝色的 **Add record (添加记录)** 按钮，按下面填写：

    * **Type (类型)**: 选 `A`
    * **Name (名称)**: 填写前缀，比如 `vps` (这样完整域名就是 `vps.222382.xyz`)
    * **IPv4 address (内容)**: 填写你 VPS 的 **IP 地址**。
    * **Proxy status (代理状态)**: **重点！** 点击小黄云，让它变灰 (仅 DNS / DNS Only)。

如下图所示，配置完成后点击 **Save (保存)**：

![](/images/屏幕截图-2026-01-06-142842.png)

{% note danger %}
**⚠️ 特别注意：**
搭建节点时，Cloudflare 的小云朵必须是 **灰色 (DNS Only)** 的！如果开启了小黄云（CDN），节点将无法连接。
{% endnote %}

---

## 💻 第二步：连接 VPS

Windows 用户不需要下载复杂的软件，直接使用系统自带的 CMD 即可。

1.  按键盘上的 `Win + R`，输入 `cmd` 然后回车。
2.  输入连接命令（请将下面的 IP 替换为你自己的）：

```bash
ssh root@123.123.123.123 -p 22
输入密码登录（注意：输入密码时屏幕上不会显示字符，输完直接回车，出现 root@... 提示符即为成功）。

🛠️ 第三步：运行一键脚本并安装
成功进入 VPS 后，复制下面这行代码，在 CMD 里点击鼠标右键粘贴，然后回车：

Bash

bash <(wget -qO- [https://raw.githubusercontent.com/yonggekkk/sing-box-yg/main/sb.sh](https://raw.githubusercontent.com/yonggekkk/sing-box-yg/main/sb.sh))
脚本此时会自动运行，并弹出功能菜单。这证明脚本已经成功加载！

⚙️ 安装与配置流程
菜单出现后，按照以下逻辑进行交互：

选择功能：输入 1 选择 “安装/更新”。

选择协议：推荐选择 Hysteria2 (速度快) 或 Vless Reality (稳定)。

绑定域名：

当脚本询问“是否拥有域名”时，输入 y。

输入域名：填入你在第一步设置好的完整域名（例如 vps.222382.xyz）。

脚本会自动申请 SSL 证书并完成配置。耐心等待一分钟后，屏幕上会显示一大片红色绿色的节点信息。

找到 “复制通用链接” 的那一行复制下来，导入到你的 Shadowrocket (小火箭) 或 v2rayN 中即可使用！

脚本跑完后的状态，如下图所示
![](/images/屏幕截图-2026-01-06-143408.png)

💡 以后怎么管理？
任何时候想修改配置或查看状态，只需要在 SSH 里输入：

Bash

sudo -i
获取 root 权限后，再次输入快捷命令：

Bash

sb
即可瞬间唤出管理菜单。
