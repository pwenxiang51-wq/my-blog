---
title: 【硬核教程】零成本打造地表最强 AI 助理：Llama 3 + SDXL 绘图 + 长期记忆 (Cloudflare 全托管)
date: 2026-01-10T17:43:00.000+08:00
---
前言：在这个 AI 泛滥的时代，拥有一个完全属于自己的、隐私的、免费的、且功能强大的 AI 助理是每个极客的梦想。 本文将教你如何利用 Cloudflare Workers 的边缘计算能力，缝合 Groq (Llama 3.3) 的极速推理、Workers AI (Stable Diffusion XL) 的绘图能力，以及 KV 数据库的记忆能力，打造一个**“图文双修”**的 Telegram 机器人。

核心卖点：

💸 0 成本：全部利用厂商免费额度。

⚡ 极速：部署在边缘节点，全球毫秒级响应。

🎨 多模态：支持对话、写代码、生成 8K 写实图片。

🧠 有记忆：记得住你是谁，支持连续对话。

🛠️ 准备工作
在开始之前，你需要准备好以下 3 样东西：

Cloudflare 账号：用于托管代码和数据库（无需绑定信用卡）。

Telegram Bot Token：

在 TG 找 @BotFather，发送 /newbot，获取 Token。

同时获取你自己的 TG ID (找 @userinfobot 获取)，作为管理员 ID。

Groq API Key：

去 Groq Console 免费申请一个 Key（目前业界速度最快的 Llama 推理服务）。

🚀 部署步骤 (保姆级)
第一步：创建 KV 数据库 (用于存储记忆)
登录 Cloudflare Dash，进入左侧 Storage & Databases -> KV。

点击 Create Namespace，命名为 AI_MEMORY。

点击 Add。

第二步：创建 Worker
进入 Compute (Workers) -> Create Worker。

命名为 velo-ai-bot (或者你喜欢的名字)，点击 Deploy。

进入 Worker 的 Settings -> Variables，添加以下环境变量：

TG_BOT_TOKEN: 你的 TG 机器人 Token。

GROQ_API_KEY: 你的 Groq API Key。

ADMIN_ID: 你的 TG 数字 ID (安全锁，防止被白嫖)。

第三步：关键绑定 (Bindings)
这一步最重要，错一个都跑不通！ 进入 Settings -> Bindings，点击 Add：

绑定 AI 能力：

类型选择：Workers AI

Variable name 填：AI (必须大写)

绑定记忆能力：

类型选择：KV Namespace

Variable name 填：MEMORY (必须大写)

Namespace 选择你刚才建的 AI_MEMORY。

💻 核心代码 (V5.0 终极版)
点击 Edit Code，清空所有原有代码，将下方代码完整粘贴进去。

JavaScript

/**
 * ⚡ Velo.x AI - v5.0 (Final Ultimate Edition)
 * ---------------------------------------------
 * @module 1: Groq Llama 3.3 (对话 + 记忆)
 * @module 2: Stable Diffusion XL (写实画图)
 * @module 3: TG Bot API (交互核心)
 */

const CONFIG = {
    // 文本大脑模型
    TEXT_MODEL: 'llama-3.3-70b-versatile',
    // 系统提示词
    SYSTEM_PROMPT: `You are Velo.x AI, a helpful assistant. Answer concisely in Chinese. Use Markdown.`,
    // 记忆限制 (记住最近 12 条消息)
    MEMORY_LIMIT: 12,
    // 绘图引擎模型
    IMAGE_MODEL: '@cf/stabilityai/stable-diffusion-xl-base-1.0'
};

export default {
    async fetch(request, env) {
        // Webhook 握手
        if (request.method !== 'POST') return new Response('Velo.x AI System Online.', { status: 200 });

        try {
            const update = await request.json();
            if (!update.message || !update.message.text) return new Response('OK');

            const chatId = update.message.chat.id;
            const userId = update.message.from.id;
            const text = update.message.text.trim();
            const messageId = update.message.message_id;

            // 🛡️ 1. 安全鉴权 (只服务大佬)
            if (env.ADMIN_ID && String(userId) !== String(env.ADMIN_ID)) {
                return new Response('OK'); 
            }

            // 🧹 2. 清除记忆指令
            if (text === '/clear' || text === '/reset') {
                try {
                    await env.MEMORY.delete(String(chatId));
                    await sendText(chatId, "🧹 **大脑已格式化，记忆已清除。**", env);
                } catch (e) {
                    await sendText(chatId, "⚠️ 清除失败，请检查 KV 绑定", env);
                }
                return new Response('OK');
            }

            // 🎨 3. 绘图指令 (/img)
            if (text.startsWith('/img') || text.startsWith('/draw')) {
                const prompt = text.replace(/^\/(img|draw)\s*/, '');
                
                if (!prompt) {
                    await sendText(chatId, "⚠️ 请输入提示词，例如：`/img 赛博朋克`", env);
                    return new Response('OK');
                }

                // 发送“上传中”状态
                await sendChatAction(chatId, 'upload_photo', env);
                // 调用写实画图逻辑
                await handleImageGeneration(chatId, prompt, messageId, env);
            } 
            
            // 💬 4. 对话指令 (Groq + 记忆)
            else {
                await sendChatAction(chatId, 'typing', env);
                
                let history = [];
                try {
                    // 尝试读取记忆
                    history = await env.MEMORY.get(String(chatId), { type: 'json' }) || [];
                } catch (e) {
                    history = [];
                }
                
                // 拼接当前问题
                const requestMessages = [...history, { role: "user", content: text }];
                
                // 调用 Groq
                const aiReply = await fetchGroqWithHistory(requestMessages, env);
                
                // 发送回复
                await sendText(chatId, aiReply, env, messageId);

                // 更新并保存记忆
                try {
                    history.push({ role: "user", content: text });
                    history.push({ role: "assistant", content: aiReply });
                    // 裁剪超长记忆
                    if (history.length > CONFIG.MEMORY_LIMIT) {
                        history = history.slice(history.length - CONFIG.MEMORY_LIMIT);
                    }
                    await env.MEMORY.put(String(chatId), JSON.stringify(history));
                } catch (e) {}
            }

        } catch (e) {
            console.error(e);
        }
        return new Response('OK');
    }
};

// ==========================================
// 🧠 核心功能：Groq 对话 (Llama 3.3)
// ==========================================
async function fetchGroqWithHistory(messages, env) {
    try {
        const payloadMessages = [
            { role: "system", content: CONFIG.SYSTEM_PROMPT },
            ...messages
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: CONFIG.TEXT_MODEL,
                messages: payloadMessages,
                temperature: 0.6,
                max_tokens: 2048
            })
        });
        const data = await response.json();
        return data.choices?.[0]?.message?.content || "❌ Groq 无响应";
    } catch (e) {
        return `Groq Error: ${e.message}`;
    }
}

// ==========================================
// 🎨 核心功能：AI 绘图 (写实增强版 V2)
// ==========================================
async function handleImageGeneration(chatId, prompt, replyId, env) {
    try {
        // ✨ 自动注入“画质增强剂”
        const enhancedPrompt = prompt + ", photorealistic, 8k resolution, cinematic lighting, highly detailed, masterpiece, sharp focus";
        
        // 调用 CF 显卡 (SDXL)
        const inputs = { prompt: enhancedPrompt, steps: 25 }; 
        const responseStream = await env.AI.run(CONFIG.IMAGE_MODEL, inputs);

        // 格式转换 (ArrayBuffer -> Blob)
        const arrayBuffer = await new Response(responseStream).arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: 'image/png' });

        // 打包发送给 TG
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('photo', blob, 'gen.png'); 
        formData.append('caption', `🎨 \`${prompt}\``);
        formData.append('parse_mode', 'Markdown');
        formData.append('reply_to_message_id', replyId);

        const res = await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) throw new Error(await res.text());

    } catch (err) {
        await sendText(chatId, `❌ **绘图失败:** ${err.message}`, env);
    }
}

// ==========================================
// 🛠️ 辅助工具
// ==========================================
async function sendChatAction(chatId, action, env) {
    await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendChatAction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, action: action })
    });
}

async function sendText(chatId, text, env, replyId = null) {
    const url = `https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`;
    const payload = { chat_id: chatId, text: text, parse_mode: 'Markdown', reply_to_message_id: replyId };
    let res = await fetch(url, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
    if (!res.ok) {
        delete payload.parse_mode; // 降级发送
        await fetch(url, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
    }
}
🔮 玩法指南
部署完成后，在 Telegram 里找到你的机器人：

聊天模式：直接发送文字，支持上下文连续对话（记得住 6 轮以内的内容）。

画图模式：发送 /img 关键词（例如：/img 赛博朋克黑客）。系统会自动增强提示词，生成照片级写实大图。

清除记忆：发送 /clear 或 /reset，重置大脑。

🚨 灾难恢复方案 (Plan B)
问：如果未来有一天，Groq 不再免费，或者挂了，我的机器人会死吗？ 答：不会！

Cloudflare 本身就内置了免费的 Llama 模型。如果 Groq 失效，你只需要修改代码中的一个函数，就能让机器人原地复活，切换回 Cloudflare 的内生动力。

修改步骤：
找到代码中的 fetchGroqWithHistory 函数，将其替换为以下代码（使用 Workers AI）：

JavaScript

// Plan B: 使用 Cloudflare 原生 AI 替代 Groq
async function fetchGroqWithHistory(messages, env) {
    try {
        // 使用 CF 免费的 Llama 3 8B 模型
        const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
            messages: messages,
            stream: false
        });
        
        return response.response || "❌ Cloudflare AI 无响应";
    } catch (e) {
        return `CF AI Error: ${e.message}`;
    }
}
只要做了这一步修改，你的机器人就真正实现了“永生”，因为它所有的依赖（算力、存储、网络）都完全运行在 Cloudflare 的生态闭环内，无惧任何外部 API 倒闭。

结语： 这不仅仅是一段代码，这是赛博时代的“数字资产”。它不需要维护，不消耗你的电费，永远在线，时刻待命。 Enjoy your new Cyber Assistant! 🦅
