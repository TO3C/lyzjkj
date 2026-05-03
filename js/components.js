// ====== 流云智炬 · 共享组件注入 V1.0 ======
// 在所有页面注入统一的导航栏、页脚、AI聊天挂件
// 需在 <body> 顶部紧邻 placeholder div 后同步加载

(function() {
  const page = document.body.dataset.page || 'home';

  // ====== 导航栏 HTML ======
  function injectHeader() {
    var ph = document.getElementById('header-placeholder');
    if (!ph) return;
    ph.innerHTML = '<nav class="navbar">' +
      '<div class="nav-container">' +
        '<a href="index.html" class="nav-logo">流云智炬</a>' +
        '<ul class="nav-menu">' +
          '<li class="nav-item"><a href="index.html" class="nav-link" data-nav="home">首页</a></li>' +
          '<li class="nav-item"><a href="index.html#pricing" class="nav-link" data-nav="pricing">服务报价</a></li>' +
          '<li class="nav-item"><a href="ai.html" class="nav-link" data-nav="ai">AI体验</a></li>' +
          '<li class="nav-item"><a href="works.html" class="nav-link" data-nav="works">作品案例</a></li>' +
          '<li class="nav-item"><a href="index.html#about" class="nav-link" data-nav="about">关于我们</a></li>' +
          '<li class="nav-item"><a href="index.html#contact" class="nav-link" data-nav="contact">联系我们</a></li>' +
        '</ul>' +
        '<div class="hamburger"><span class="bar"></span><span class="bar"></span><span class="bar"></span></div>' +
      '</div>' +
    '</nav>';
    setActiveNav();
    rewriteHomepageAnchors();
  }

  // ====== 页脚 HTML ======
  function injectFooter() {
    var ph = document.getElementById('footer-placeholder');
    if (!ph) return;
    ph.innerHTML = '<footer class="footer">' +
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div class="footer-col">' +
            '<h4>流云智炬科技</h4>' +
            '<p>用温度做技术 · 企业数字化服务伙伴</p>' +
            '<div class="footer-social">' +
              '<a href="#" aria-label="GitHub"><i class="fab fa-github"></i></a>' +
              '<a href="#" aria-label="微信"><i class="fab fa-weixin"></i></a>' +
            '</div>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>快速链接</h4>' +
            '<ul>' +
              '<li><a href="index.html">首页</a></li>' +
              '<li><a href="index.html#pricing">服务报价</a></li>' +
              '<li><a href="ai.html">AI体验</a></li>' +
              '<li><a href="works.html">作品案例</a></li>' +
              '<li><a href="index.html#contact">联系我们</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>联系方式</h4>' +
            '<ul>' +
              '<li><i class="fas fa-envelope"></i> 296077990@qq.com</li>' +
              '<li><i class="fas fa-phone"></i> 13876597418</li>' +
              '<li><i class="fas fa-map-marker-alt"></i> 海南省三亚市</li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<p>&copy; 2026 流云智炬科技. 版权所有</p>' +
          '<p>琼ICP备2025064801号</p>' +
        '</div>' +
      '</div>' +
    '</footer>';
  }

  // ====== AI聊天挂件 HTML ======
  function injectChatWidget() {
    var ph = document.getElementById('chat-widget-placeholder');
    if (!ph) return;
    ph.innerHTML = '<div class="ai-chat-widget" id="aiChatWidget">' +
      '<button class="ai-chat-toggle" id="aiChatToggle" aria-label="打开AI客服">' +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="2"/></svg>' +
        '<span class="ai-badge">AI</span>' +
      '</button>' +
      '<div class="ai-chat-window" id="aiChatWindow">' +
        '<div class="chat-header">' +
          '<div class="chat-title">小炬 · AI 顾问</div>' +
          '<div class="chat-header-actions">' +
            '<button class="chat-minimize" id="chatMinimize" aria-label="最小化">−</button>' +
            '<button class="chat-clear" id="chatClear" aria-label="清除对话">✕</button>' +
          '</div>' +
        '</div>' +
        '<div class="chat-messages" id="chatMessages">' +
          '<div class="message message-ai"><div class="message-content">嗨～我是小炬！想了解啥随便问，网站、小程序、合作都行 😊</div></div>' +
        '</div>' +
        '<div class="chat-input-area">' +
          '<input type="text" class="chat-input" id="chatInput" placeholder="想聊点啥？" aria-label="输入消息">' +
          '<button class="chat-send" id="chatSend" aria-label="发送">➤</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  // ====== 导航激活状态 ======
  function setActiveNav() {
    var links = document.querySelectorAll('.nav-link[data-nav]');
    links.forEach(function(link) {
      var nav = link.getAttribute('data-nav');
      link.classList.remove('active');
      if (page === 'home' && (nav === 'home' || nav === 'pricing' || nav === 'about' || nav === 'contact')) {
        // 首页上所有锚点链接不高亮（由滚动检测控制）
      }
      if (nav === page) link.classList.add('active');
    });
    // 首页特殊处理：默认高亮"首页"
    if (page === 'home') {
      var homeLink = document.querySelector('.nav-link[data-nav="home"]');
      if (homeLink) homeLink.classList.add('active');
    }
  }

  // ====== 首页锚点链接改写 ======
  function rewriteHomepageAnchors() {
    if (page !== 'home') return;
    var links = document.querySelectorAll('.nav-link[href^="index.html#"]');
    links.forEach(function(link) {
      var href = link.getAttribute('href');
      link.setAttribute('href', href.replace('index.html', ''));
    });
  }

  // ====== 移动端菜单 ======
  function initMobileMenu() {
    var hamburger = document.querySelector('.hamburger');
    var navMenu = document.querySelector('.nav-menu');
    var navLinks = document.querySelectorAll('.nav-link');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ====== AI 聊天窗口控制 ======
  function initChatWidgetButtons() {
    var toggle = document.getElementById('aiChatToggle');
    var windowEl = document.getElementById('aiChatWindow');
    var minimize = document.getElementById('chatMinimize');
    var clear = document.getElementById('chatClear');
    var input = document.getElementById('chatInput');

    if (!toggle || !windowEl) return;

    toggle.addEventListener('click', function() {
      windowEl.classList.toggle('active');
      if (windowEl.classList.contains('active') && input) {
        setTimeout(function() { input.focus(); }, 100);
      }
    });

    if (minimize) {
      minimize.addEventListener('click', function() {
        windowEl.classList.remove('active');
      });
    }

    if (clear) {
      clear.addEventListener('click', function() {
        windowEl.classList.remove('active');
        var msgs = document.getElementById('chatMessages');
        if (msgs) {
          msgs.innerHTML = '<div class="message message-ai"><div class="message-content">重新来～有啥想聊的尽管说 😊</div></div>';
        }
        localStorage.removeItem('ai-chat-history');
      });
    }
  }

  // ====== 执行注入 ======
  // 导航栏：立即注入（header-placeholder 在脚本之前，已解析）
  injectHeader();

  // 页脚 + AI挂件 + 移动端菜单：placeholder 在脚本之后，需等 DOM 就绪
  document.addEventListener('DOMContentLoaded', function() {
    injectFooter();
    injectChatWidget();
    initChatWidgetButtons();
    initMobileMenu();
  });
})();
