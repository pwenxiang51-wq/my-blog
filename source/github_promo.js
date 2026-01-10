// Velo.x GitHub 自动引流脚本
// 这里的代码会在页面加载完成后执行，自动把卡片插入到文章底部

document.addEventListener('DOMContentLoaded', function () {
  // 1. 检测是否在文章页面（通过查找文章容器）
  var postContent = document.querySelector('.markdown-body');
  
  // 2. 如果找到了文章容器，且不是“关于”页面
  if (postContent && window.location.pathname !== '/about/') {
    
    // 3. 定义要插入的 HTML 内容
    var promoHTML = `
      <div style="margin-top: 50px; padding: 20px; background: #f6f8fa; border-radius: 12px; border: 1px solid #d0d7de;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h4 style="margin: 0 0 10px 0; color: #24292f;">🤝 交个朋友</h4>
            <p style="margin: 0; font-size: 14px; color: #57606a;">我是 Velo.x，一名热衷于 VPS 与 AI 黑科技的极客。</p>
          </div>
          <div style="font-size: 30px;">👋</div>
        </div>
        <div style="margin-top: 15px;">
          <a href="https://github.com/pwenxiang51-wq" target="_blank" style="display: inline-block; background: #24292f; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; margin-right: 10px;">
            🚀 关注我的 GitHub
          </a>
          <a href="https://github.com/pwenxiang51-wq?tab=repositories" target="_blank" style="display: inline-block; background: #ffffff; color: #24292f; border: 1px solid #d0d7de; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 14px;">
            📂 查看所有项目
          </a>
        </div>
      </div>
    `;

    // 4. 创建一个 div 并插入到文章末尾
    var promoDiv = document.createElement('div');
    promoDiv.innerHTML = promoHTML;
    postContent.appendChild(promoDiv);
  }
});
