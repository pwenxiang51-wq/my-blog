---
title: "[优化] Debian 11 开启 BBR：压榨 VPS 的每一滴网络性能"
date: 2022-07-26T15:10:00.000+08:00
---


VPS 到手后的第一件事，除了安全防护，就是 **开启 BBR**。
在复杂的国际网络环境中，开启 BBR 和不开启 BBR，速度体验简直是天壤之别。

Debian 11 / 12 的内核（5.10+）已经默认内置了 BBR 模块，我们只需要简单的几行命令就能“唤醒”它。

---

## 🔍 第一步：检查现有状态

在开启之前，我们可以先看看当前的 TCP 拥塞控制算法是什么。在 SSH 中输入：

    sysctl net.ipv4.tcp_congestion_control

* **如果输出 `cubic` 或 `reno`**：说明你还在用老式的算法，不仅慢，还容易丢包。👉 **请继续往下做。**
* **如果输出 `bbr`**：说明已经开启了，你可以直接关掉这篇文章去喝茶了。🍵

---

## 🚀 第二步：一键开启 BBR

直接复制下面这两行指令，粘贴到 SSH 中运行（这会把配置写入系统文件）：

    echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
    echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf

然后，运行下面这行命令，让配置 **立即生效**：

    sysctl -p

运行后如果看到如下输出，说明配置已经成功加载：

<img src="/images/屏幕截图-2026-01-06-162013.png" style="width: 100%; display: block; margin: 10px 0;" />

---

## ✅ 第三步：验证是否成功

再次查询算法状态：

    sysctl net.ipv4.tcp_congestion_control

如果这次输出的是：

    net.ipv4.tcp_congestion_control = bbr

**恭喜你！** 你的 VPS 网络性能已经解锁了“物理外挂”。

---

## 💡 进阶：为什么要用 BBR？

传统的 TCP 拥塞控制（像 `Cubic`）非常保守，一遇到丢包就误以为网络堵了，立马把速度降下来（断崖式降速）。

而 **Google BBR** 是基于“模型预测”的，它不管你丢不丢包，只看**实际带宽**和**延迟**。
这就好比老司机开车，遇到堵车（丢包）不会急刹车，而是寻找缝隙穿插过去。因此它非常适合**高延迟、易丢包**的国际线路（比如你的 VPS）。
