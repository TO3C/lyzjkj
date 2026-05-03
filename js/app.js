// ====== 流云智炬 · 页面交互逻辑 V2.0 ======
// 支持多页：首页(home) / AI体验(ai) / 作品案例(works)
// 页面通过 <body data-page="..."> 标识

var page = document.body.dataset.page || 'home';

document.addEventListener('DOMContentLoaded', function() {
  // ====== 全局 ======
  initSmoothScrolling();
  initScrollAnimations();
  initScrollProgress();
  initAIChat();

  // ====== 首页 ======
  if (page === 'home') {
    initActiveNavLink();
    initContactForm();
  }

  // ====== AI体验页 ======
  if (page === 'ai') {
    initAIDemo();
  }

  // ====== 作品案例页 ======
  if (page === 'works') {
    initPortfolio();
  }

  // ====== CloudBase 初始化（延迟加载） ======
  initCloudBase();
});

// ===================================================================
// 平滑滚动（支持跨页锚点）
// ===================================================================
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offsetTop = target.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });
}

// ===================================================================
// 滚动动画
// ===================================================================
function initScrollAnimations() {
  var observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('stat-number')) {
          animateNumber(entry.target);
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.price-card, .adv-card, .process-step, .fade-in, .stat-number, .feature-card, .project-card').forEach(function(el) {
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

function animateNumber(element) {
  var text = element.textContent;
  if (text.includes('年') && text.includes('月')) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    return;
  }
  var finalNumber = parseInt(text);
  if (isNaN(finalNumber)) return;
  var duration = 2000;
  var increment = finalNumber / (duration / 16);
  var currentNumber = 0;
  var timer = setInterval(function() {
    currentNumber += increment;
    if (currentNumber >= finalNumber) { currentNumber = finalNumber; clearInterval(timer); }
    if (text.includes('年')) element.textContent = Math.floor(currentNumber) + '年';
    else if (text.includes('+')) element.textContent = Math.floor(currentNumber) + '+';
    else if (text.includes('%')) element.textContent = Math.floor(currentNumber) + '%';
    else element.textContent = Math.floor(currentNumber);
  }, 16);
}

// ===================================================================
// 滚动进度条
// ===================================================================
function initScrollProgress() {
  var bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;top:0;left:0;width:0%;height:3px;background:var(--terracotta);z-index:9999;transition:width 0.3s ease;';
  document.body.appendChild(bar);
  window.addEventListener('scroll', throttle(function() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var progress = (scrollTop / scrollHeight) * 100;
    bar.style.width = progress + '%';
  }, 16));
}

// ===================================================================
// 首页：活动导航高亮
// ===================================================================
function initActiveNavLink() {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    var scrollPosition = window.pageYOffset + 100;
    sections.forEach(function(section) {
      var sectionTop = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      var sectionId = section.getAttribute('id');
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  updateActiveLink();
  window.addEventListener('scroll', throttle(updateActiveLink, 16));
}

// ===================================================================
// 首页：联系表单
// ===================================================================
function initContactForm() {
  var contactForm = document.getElementById('contactForm');
  var submitBtn = document.getElementById('submitBtn');
  var formMessage = document.getElementById('formMessage');
  if (!contactForm || !submitBtn) return;

  if (typeof emailjs === 'undefined') {
    formMessage.textContent = '邮件服务加载失败，请刷新页面';
    formMessage.className = 'form-message show error';
    return;
  }

  try {
    emailjs.init('SF1gQ4b50a6Q4Z9OX');
  } catch (e) {
    formMessage.textContent = '邮件服务初始化失败';
    formMessage.className = 'form-message show error';
    return;
  }

  submitBtn.addEventListener('click', function(e) {
    e.preventDefault();
    var email = document.getElementById('email').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var message = document.getElementById('message').value.trim();

    if (!email && !phone) { showFormMessage('error', '请至少填写邮箱或电话其中一个'); return; }
    if (!message || message.length < 10) { showFormMessage('error', '请详细描述您的需求（至少10个字符）'); return; }

    var originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
    submitBtn.disabled = true;

    var formData = { email: email, phone: phone, message: message };

    // EmailJS 发送
    emailjs.send('service_pic12wf', 'template_j4ddbl6', formData)
      .then(function() {
        showFormMessage('success', '消息发送成功！我们会尽快与您联系。');
        contactForm.reset();
        submitBtn.innerHTML = originalBtnContent;
        submitBtn.disabled = false;
        setTimeout(function() { hideFormMessage(); }, 5000);

        // CloudBase 双写（不阻塞UI）
        if (typeof cloudbase !== 'undefined') {
          persistContactToCloudBase(formData);
        }
      }, function(error) {
        showFormMessage('error', '发送失败，请稍后重试或直接发送邮件至 296077990@qq.com');
        submitBtn.innerHTML = originalBtnContent;
        submitBtn.disabled = false;
        setTimeout(function() { hideFormMessage(); }, 5000);
      });
  });

  function showFormMessage(type, msg) {
    formMessage.textContent = msg;
    formMessage.className = 'form-message show ' + type;
  }
  function hideFormMessage() {
    formMessage.classList.remove('show');
  }
}

// CloudBase 联系表单持久化
async function persistContactToCloudBase(formData) {
  try {
    var res = await fetch('https://cloud1-0ggg2niq36a70b37.service.tcloudbase.com/contact-api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        source: 'website'
      })
    });
    var data = await res.json();
    console.log('CloudBase contact saved:', data);
  } catch (e) {
    console.warn('CloudBase contact persist failed (non-critical):', e.message);
  }
}

// ===================================================================
// AI聊天引擎 V3.0（来自 script-fixed.js，完全保留）
// ===================================================================
var AI_CHAT_API = 'https://cloud1-0ggg2niq36a70b37.service.tcloudbase.com/ai-chat';
var chatHistory = [];

var AI_KB = {
  company: {
    name: '三亚流云智炬科技工作室', slogan: '用温度做技术',
    addr: '海南省三亚市', tel: '13876597418', wx: 'Lyzjkj',
    email: '296077990@qq.com', web: 'www.lyzjkj.top',
    hours: '周一至周五 9:00-18:00'
  },
  webPricing: [
    { name: 'A1·体验版', price: '¥3,800', market: '¥5,000~8,000', pages: '1页单页滚动', days: '3天', desc: '极简品牌展示', features: '移动端适配+域名1年+服务器1年' },
    { name: 'A2·初创版 ⭐', price: '¥6,800', market: '¥8,000~12,000', pages: '5页', days: '7天', desc: '初创企业首选', features: 'CMS后台+SEO基础+域名1年+服务器1年' },
    { name: 'B1·品牌版 ⭐主推', price: '¥12,800', market: '¥15,000~25,000', pages: '8页', days: '12天', desc: '成长型企业品牌升级', features: '原创UI+CMS完整版+SEO深度+博客系统+AI客服(50问答)+在线留言' },
    { name: 'B2·专业版', price: '¥19,800', market: '¥25,000~40,000', pages: '15页', days: '18天', desc: '中大型/外贸公司', features: '2轮风格提案+数据分析面板+SEO+百度收录+双语(中英)+AI客服(200问答)+服务器2年' },
    { name: 'C1·集团版', price: '¥29,800', market: '¥40,000~80,000', pages: '20页+', days: '25天', desc: '集团/上市企业', features: '3语种+会员系统+API对接+售后6个月' },
    { name: 'C2·定制版', price: '¥50,000起', market: '¥80,000~150,000', pages: '不限', days: '按需', desc: '大型平台/特殊需求', features: '全部功能+电商+售后12个月' }
  ],
  mpPricing: [
    { name: 'MP1·展示版', price: '¥5,800', market: '¥15,000~30,000', days: '7天', desc: '小微企业品牌展示', features: '5页+一键拨号+一键导航' },
    { name: 'MP2·基础功能版 ⭐', price: '¥9,800', market: '¥30,000~50,000', days: '12天', desc: '服务型/预约型企业', features: '8页+预约/报名/留言+用户系统+CMS后台' },
    { name: 'MP3·电商标准版', price: '¥18,800', market: '¥50,000~80,000', days: '18天', desc: '中小电商/零售', features: '15页+商品管理+购物车+微信支付+优惠券+订单管理' },
    { name: 'MP4·电商专业版', price: '¥29,800', market: '¥80,000~150,000', days: '25天', desc: '品牌电商/连锁', features: '多规格商品+微信支付宝双支付+拼团秒杀+会员积分+二级分销+数据看板' },
    { name: 'MP5·多商户平台版', price: '¥48,000起', market: '¥100,000~200,000', days: '按需', desc: '本地生活平台', features: '多商户入驻+平台抽佣+商户管理后台' }
  ],
  industries: {
    '酒店民宿': { price: '+¥5,000', features: '房型管理+预订日历+在线支付+周边推荐', base: '推荐 A2初创版 ¥6,800 或 B1品牌版 ¥12,800' },
    '餐饮美食': { price: '+¥6,000', features: '扫码点餐+后厨打印+排队系统+堂食管理', base: '推荐 MP2基础功能版 ¥9,800' },
    '零售商贸': { price: '+¥8,000', features: '多门店库存+会员储值+积分兑换+收银台', base: '推荐 MP3电商标准版 ¥18,800' },
    '企业服务': { price: '+¥3,000', features: 'AI智能客服+在线预约+案例管理+服务评价', base: '推荐 B1品牌版 ¥12,800' },
    '房产家装': { price: '+¥8,000', features: '楼盘管理+VR嵌入+置业顾问分配+预约看房', base: '推荐 B1品牌版 ¥12,800' }
  },
  combos: [
    { name: '初创组合', content: '网站A1+小程序MP1', price: '¥8,000', save: '¥1,600' },
    { name: '成长组合 ⭐', content: '网站A2+小程序MP2', price: '¥14,000', save: '¥2,600' },
    { name: '品牌组合', content: '网站B1+小程序MP3', price: '¥27,000', save: '¥4,600' },
    { name: '旗舰组合', content: '网站B2+小程序MP4', price: '¥42,000', save: '¥7,600' }
  ],
  faq: {
    '源码归谁': '网站前端源码和小程序源码都归您所有，验收后完整交付。域名用您的信息注册，服务器用您的账号购买——网站和小程序都是您自己的资产。',
    '售后多久': '验收后免费售后3个月。包含：程序Bug修复（1工作日内）、服务器故障排查（2小时内）、安全紧急补丁、使用操作指导。不包含功能新增和内容代更新。',
    '多久上线': '网站：A1体验版3天 / A2初创版7天 / B1品牌版12天 / B2专业版18天 / C1集团版25天。小程序另加微信审核7-14天（不计入工期）。以上均不含客户反馈时间。',
    '怎么付款': '≤3万项目：50%首付+50%验收后付。>3万项目：40%首付+30%中期款(设计确认后)+30%尾款(验收后)。支持银行转账、支付宝、微信支付。',
    '能不能便宜': '我们的价格已经是海南本地特惠价了——同样品质，一线城市贵30-50%。套餐价不打折（品质不打折），但组合购买有优惠（如网站+小程序组合可省¥1,600~7,600），老客户转介绍双方各返¥500。',
    '合同': '我们使用标准服务合同，明确约定：源码归属、知识产权、数据保护、售后范围、违约条款（万分之五/天）。支持电子签约（法大大/腾讯电子签），也支持纸质合同。',
    '案例': '有的！我们已服务50+客户，涵盖酒店民宿、餐饮、零售、企业服务等多个行业。可以针对您的行业发相关案例给您参考。',
    '模板和定制区别': '模板站=租房：源码不是你的，改不了，搬家搬不走，年费越交越多。定制站=买房：源码是你的，想怎么改怎么改，域名服务器都在你名下，一次性付费。',
    '微信审核': '小程序需提交微信审核（7-14天），这个时间不计入工期。首次审核失败免费修改，我们有丰富的审核经验，通过率很高。',
    '维护费': '免费售后3个月结束后，可选续费：基础维护 ¥3,600/年（含每月1次内容更新），高级维护 ¥9,800/年（含功能微调+每月3次更新）。也可以按次付费 ¥500/次。'
  }
};

function matchKB(msg) {
  var m = msg.toLowerCase();
  if (/电话|微信|联系|怎么联系|在哪|地址/.test(m)) {
    return '📞 电话：' + AI_KB.company.tel + '<br>💬 微信：' + AI_KB.company.wx + '<br>📧 邮箱：' + AI_KB.company.email + '<br>🌐 官网：' + AI_KB.company.web + '<br>📍 地址：' + AI_KB.company.addr + '<br>⏰ 工作时间：' + AI_KB.company.hours;
  }
  if (/网站.*(?:多少钱|报价|价格|套餐|收费)|做.*网站.*(?:多少|价格|报价|费用)|网站.*开发/.test(m)) {
    var r = '<b>🏨 网站开发套餐 V3.0（含市场参考价对比）</b><br><br>';
    AI_KB.webPricing.forEach(function(p) {
      r += '<b>' + p.name + '</b> <b style="color:var(--terracotta);">' + p.price + '</b>（市场 ' + p.market + '）<br>';
      r += '　' + p.pages + ' · ' + p.days + ' · ' + p.desc + '<br>';
      r += '　' + p.features + '<br><br>';
    });
    r += '💡 海南本地团队，比一线城市便宜30-50%<br>💡 源码+域名+服务器全部交付<br>💡 售后3个月免费';
    return r;
  }
  if (/小程序.*(?:多少钱|报价|价格|套餐|收费)|做.*小程序.*(?:多少|价格|报价|费用)|小程序.*开发/.test(m)) {
    var r2 = '<b>📱 小程序开发套餐 V3.0（含市场定制均价对比）</b><br><br>';
    AI_KB.mpPricing.forEach(function(p) {
      r2 += '<b>' + p.name + '</b> <b style="color:var(--terracotta);">' + p.price + '</b>（市场定制均价 ' + p.market + '）<br>';
      r2 += '　' + p.days + ' · ' + p.desc + '<br>';
      r2 += '　' + p.features + '<br><br>';
    });
    r2 += '💡 源码全部交付，比SaaS年费方案更划算<br>💡 微信审核时间不计入工期';
    return r2;
  }
  if (/民宿|酒店|客栈/.test(m)) {
    var ind = AI_KB.industries['酒店民宿'];
    return '<b>🏨 酒店民宿行业方案</b><br><br>' + ind.base + '<br>+ 行业功能包 <b style="color:var(--terracotta);">' + ind.price + '</b><br><br>📦 功能包内容：' + ind.features + '<br><br>💰 综合报价示例：<br>　A2初创版 + 功能包 = <b style="color:var(--terracotta);">¥11,800</b><br>　B1品牌版 + 功能包 = <b style="color:var(--terracotta);">¥17,800</b><br><br>👉 需要针对您的民宿/酒店做具体方案吗？告诉我房间数和需求～';
  }
  if (/餐饮|餐厅|饭店|点餐/.test(m)) {
    var ind2 = AI_KB.industries['餐饮美食'];
    return '<b>🍽️ 餐饮美食行业方案</b><br><br>' + ind2.base + '<br>+ 行业功能包 <b style="color:var(--terracotta);">' + ind2.price + '</b><br><br>📦 功能包内容：' + ind2.features + '<br><br>💰 综合报价：MP2 + 功能包 = <b style="color:var(--terracotta);">¥15,800</b><br><br>👉 需要扫码点餐还是排队叫号？告诉我具体需求～';
  }
  if (/零售|电商|商城|卖东西|开店/.test(m)) {
    var ind3 = AI_KB.industries['零售商贸'];
    return '<b>🛍️ 零售商贸行业方案</b><br><br>' + ind3.base + '<br>+ 行业功能包 <b style="color:var(--terracotta);">' + ind3.price + '</b><br><br>📦 功能包内容：' + ind3.features + '<br><br>💡 如果是纯电商，推荐 MP3电商标准版 ¥18,800 或 MP4电商专业版 ¥29,800<br><br>👉 主要卖什么品类？需要多门店管理吗？';
  }
  if (/网站.*小程序|小程序.*网站|组合|打包|两个都要/.test(m)) {
    var r3 = '<b>🎁 网站+小程序组合优惠</b><br><br>';
    AI_KB.combos.forEach(function(c) {
      r3 += '<b>' + c.name + '</b>：' + c.content + '<br>';
      r3 += '　组合价 <b style="color:var(--terracotta);">' + c.price + '</b>（节省 ' + c.save + '）<br><br>';
    });
    r3 += '💡 组合购买后台数据打通，统一管理';
    return r3;
  }
  if (/源码|源代码|代码归谁|归谁|属于谁|域名.*谁|服务器.*谁/.test(m)) return AI_KB.faq['源码归谁'];
  if (/售后|维护|保修|服务.*多久|坏了.*怎么办|出问题/.test(m)) return AI_KB.faq['售后多久'];
  if (/多久|工期|时间|上线|几天|什么时候.*好/.test(m)) return AI_KB.faq['多久上线'];
  if (/付款|支付|怎么.*付|分期|首付/.test(m)) return AI_KB.faq['怎么付款'];
  if (/便宜|贵|打折|优惠|降价|能不能少/.test(m)) return AI_KB.faq['能不能便宜'];
  if (/合同|协议|签约|条款|法律/.test(m)) return AI_KB.faq['合同'];
  if (/案例|作品|客户|做过.*什么|有没有.*案例/.test(m)) return AI_KB.faq['案例'];
  if (/模板|定制.*区别|淘宝.*区别|SaaS|凡科|上线了/.test(m)) return AI_KB.faq['模板和定制区别'];
  if (/审核|微信审核|审核.*不过|审核.*多久/.test(m)) return AI_KB.faq['微信审核'];
  if (/维护费|维护.*多少钱|续费|年费/.test(m)) return AI_KB.faq['维护费'];
  if (/优势|为什么.*你们|区别|凭什么|好.*哪里/.test(m)) {
    return '<b>💡 我们的优势</b><br><br>✅ <b>源码交付</b>：网站是你的，不是租的<br>✅ <b>原创设计</b>：一对一沟通，拒绝模板套用<br>✅ <b>海南本地</b>：实时响应，没有一线城市溢价<br>✅ <b>价格透明</b>：明码标价，市场参考价对比<br>✅ <b>售后保障</b>：免费3个月，Bug 1工作日内修复<br>✅ <b>数据保护</b>：合同明确数据保护条款<br>✅ <b>AI智能客服</b>：B1及以上套餐免费赠送<br>📞 ' + AI_KB.company.tel + ' | 💬 ' + AI_KB.company.wx;
  }
  if (/流程|步骤|怎么.*做|过程/.test(m)) {
    return '<b>📋 合作流程</b><br><br>1️⃣ <b>需求沟通</b>：了解行业/功能/预算/风格<br>2️⃣ <b>方案报价</b>：1个工作日内出方案+报价<br>3️⃣ <b>签约启动</b>：签合同+付首付，提供素材<br>4️⃣ <b>UI设计</b>：首页设计→反馈→定稿→内页设计<br>5️⃣ <b>开发测试</b>：前后端开发→联调→内部测试<br>6️⃣ <b>验收上线</b>：客户验收→部署上线→操作培训<br>7️⃣ <b>售后服务</b>：免费3个月，7天/30天/90天回访<br><br>📅 总工期 3-25 个工作日（按套餐不同）';
  }
  if (/评估|推荐|建议|适合|不知道.*选|帮我.*选/.test(m)) {
    return '🤔 <b>帮您快速评估</b><br><br>请告诉我：<br>1️⃣ 您是什么行业？（酒店/餐饮/零售/企业服务/其他）<br>2️⃣ 主要目的是什么？（品牌展示/在线获客/在线交易）<br>3️⃣ 预算大概在什么范围？<br>4️⃣ 期望什么时间上线？<br><br>💡 也可以直接 📞 ' + AI_KB.company.tel + ' 或 💬 ' + AI_KB.company.wx + '，我们电话沟通更快～';
  }
  if (/你好|hi|hello|嗨|在吗/.test(m)) {
    return '你好呀～欢迎来到流云智炬！😊<br><br>我们是三亚本地的互联网工作室，专注：<br>🌐 企业品牌官网开发<br>📱 微信小程序开发<br>🤖 AI智能客服<br><br>你可以直接问我：<br>· "网站开发多少钱？"<br>· "民宿小程序方案"<br>· "你们有什么优势？"<br>· "做网站要多久？"<br><br>也可以 📞 ' + AI_KB.company.tel + ' 或 💬 ' + AI_KB.company.wx + ' 直接联系我们～';
  }
  return null;
}

async function callAI(message) {
  var kbReply = matchKB(message);
  if (kbReply) {
    chatHistory.push({ role: 'user', content: message });
    chatHistory.push({ role: 'assistant', content: kbReply });
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
    return kbReply;
  }
  try {
    var res = await fetch(AI_CHAT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message, history: chatHistory })
    });
    var data = await res.json();
    if (data.code === 200 && data.data && data.data.reply) {
      chatHistory.push({ role: 'user', content: message });
      chatHistory.push({ role: 'assistant', content: data.data.reply });
      if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
      return data.data.reply;
    }
    throw new Error(data.msg || 'API error');
  } catch (e) {
    console.error('AI API error:', e);
    return '抱歉，这个问题我需要一点时间思考～<br><br>📞 你可以直接电话联系：<b>' + AI_KB.company.tel + '</b><br>💬 或者加微信：<b>' + AI_KB.company.wx + '</b><br>📧 邮箱：' + AI_KB.company.email + '<br><br>我们会在第一时间回复你！';
  }
}

// ====== 聊天UI ======
function initAIChat() {
  var chatWidget = document.getElementById('aiChatWidget');
  if (!chatWidget) return;
  var chatMessages = document.getElementById('chatMessages');
  var chatInput = document.getElementById('chatInput');
  var chatSend = document.getElementById('chatSend');
  if (!chatMessages || !chatInput || !chatSend) return;

  // 修复组件注入后的事件绑定
  chatSend.onclick = null;
  chatSend.addEventListener('click', sendMessage);
  chatInput.onkeypress = null;
  chatInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') sendMessage(); });

  loadChatHistory();
  initChatToggle();
}

function initChatToggle() {
  var toggle = document.getElementById('aiChatToggle');
  var windowEl = document.getElementById('aiChatWindow');
  var chatInput = document.getElementById('chatInput');
  if (toggle && windowEl) {
    toggle.addEventListener('click', function() {
      windowEl.classList.toggle('active');
      if (windowEl.classList.contains('active') && chatInput) {
        setTimeout(function() { chatInput.focus(); }, 100);
      }
    });
  }
  var minimize = document.getElementById('chatMinimize');
  var clear = document.getElementById('chatClear');
  if (minimize && windowEl) {
    minimize.addEventListener('click', function() { windowEl.classList.remove('active'); });
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

function getCurrentTime() {
  var now = new Date();
  return String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
}

async function sendMessage() {
  var chatInput = document.getElementById('chatInput');
  if (!chatInput) return;
  var message = chatInput.value.trim();
  if (!message) return;
  addMessage(message, 'user');
  chatInput.value = '';
  showTyping();
  var reply = await callAI(message);
  removeTyping();
  addMessage(reply, 'ai');
}

function addMessage(content, type) {
  var chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  var div = document.createElement('div');
  div.className = 'message message-' + type;
  div.innerHTML = '<div class="message-content">' + content.replace(/\n/g, '<br>') + '</div><div class="message-time">' + getCurrentTime() + '</div>';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  saveChatHistory();
}

function showTyping() {
  var chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  var div = document.createElement('div');
  div.id = 'typing';
  div.className = 'message message-ai';
  div.innerHTML = '<div class="message-content typing"><span></span><span></span><span></span></div>';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() { var t = document.getElementById('typing'); if (t) t.remove(); }

function saveChatHistory() {
  var chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  var msgs = [];
  chatMessages.querySelectorAll('.message').forEach(function(m) {
    if (m.id === 'typing') return;
    var c = m.querySelector('.message-content');
    if (c) msgs.push({ content: c.innerText, type: m.classList.contains('message-user') ? 'user' : 'ai' });
  });
  localStorage.setItem('ai-chat-history', JSON.stringify(msgs));
}

function loadChatHistory() {
  var chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  var saved = localStorage.getItem('ai-chat-history');
  if (saved) {
    try {
      var msgs = JSON.parse(saved);
      chatMessages.innerHTML = '';
      msgs.forEach(function(m) {
        var d = document.createElement('div');
        d.className = 'message message-' + m.type;
        d.innerHTML = '<div class="message-content">' + m.content.replace(/\n/g, '<br>') + '</div>';
        chatMessages.appendChild(d);
      });
      addQuickReplies();
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (e) { addQuickReplies(); }
  } else { addQuickReplies(); }
}

function addQuickReplies() {
  var chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  var q = document.createElement('div');
  q.className = 'quick-replies';
  q.innerHTML = '<button class="quick-reply-btn" data-q="pricing">💰 网站开发报价</button><button class="quick-reply-btn" data-q="miniapp">📱 小程序报价</button><button class="quick-reply-btn" data-q="combo">🎁 网站+小程序组合</button>';
  chatMessages.appendChild(q);
  q.querySelectorAll('.quick-reply-btn').forEach(function(b) {
    b.addEventListener('click', function() {
      var v = b.dataset.q === 'pricing' ? '网站开发多少钱？' : b.dataset.q === 'miniapp' ? '小程序报价多少？' : '网站和小程序一起做有优惠吗？';
      var chatInput = document.getElementById('chatInput');
      if (chatInput) { chatInput.value = v; sendMessage(); }
    });
  });
}

// ===================================================================
// 定价Tab切换
// ===================================================================
function switchPricingTab(tab) {
  document.querySelectorAll('.pricing-tab').forEach(function(t) { t.classList.remove('active'); });
  document.querySelectorAll('.pricing-grid').forEach(function(g) { g.classList.remove('active'); });
  var targetGrid = document.getElementById('pricing-' + tab);
  if (targetGrid) targetGrid.classList.add('active');
  var tabs = document.querySelectorAll('.pricing-tab');
  if (tab === 'web' && tabs[0]) tabs[0].classList.add('active');
  if (tab === 'mp' && tabs[1]) tabs[1].classList.add('active');
}

// ===================================================================
// AI体验页：大聊天界面 + 模式切换
// ===================================================================
function initAIDemo() {
  var demoChatMessages = document.getElementById('demoChatMessages');
  var demoChatInput = document.getElementById('demoChatInput');
  var demoChatSend = document.getElementById('demoChatSend');
  if (!demoChatMessages || !demoChatInput || !demoChatSend) return;

  demoChatSend.addEventListener('click', function() {
    sendDemoMessage();
  });
  demoChatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendDemoMessage();
  });

  // 模式切换按钮
  document.querySelectorAll('.mode-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.mode-btn').forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      var prompt = this.getAttribute('data-prompt');
      if (prompt) {
        demoChatInput.value = prompt;
        sendDemoMessage();
      }
    });
  });
}

async function sendDemoMessage() {
  var demoChatInput = document.getElementById('demoChatInput');
  var demoChatMessages = document.getElementById('demoChatMessages');
  if (!demoChatInput || !demoChatMessages) return;
  var message = demoChatInput.value.trim();
  if (!message) return;

  addDemoMessage(message, 'user');
  demoChatInput.value = '';

  var typingDiv = document.createElement('div');
  typingDiv.id = 'demo-typing';
  typingDiv.className = 'message message-ai';
  typingDiv.innerHTML = '<div class="message-content typing"><span></span><span></span><span></span></div>';
  demoChatMessages.appendChild(typingDiv);
  demoChatMessages.scrollTop = demoChatMessages.scrollHeight;

  var reply = await callAI(message);

  var t = document.getElementById('demo-typing');
  if (t) t.remove();
  addDemoMessage(reply, 'ai');
}

function addDemoMessage(content, type) {
  var demoChatMessages = document.getElementById('demoChatMessages');
  if (!demoChatMessages) return;
  var div = document.createElement('div');
  div.className = 'message message-' + type;
  div.innerHTML = '<div class="message-content">' + content.replace(/\n/g, '<br>') + '</div><div class="message-time">' + getCurrentTime() + '</div>';
  demoChatMessages.appendChild(div);
  demoChatMessages.scrollTop = demoChatMessages.scrollHeight;
}

// ===================================================================
// 作品案例页：筛选 + 网格 + 弹窗
// ===================================================================
var FALLBACK_PROJECTS = [
  { id: 1, title: '海棠湾度假酒店官网', category: 'website', tags: ['酒店', '品牌'], desc: '高端度假酒店品牌官网，包含房型展示、在线预订、周边景点推荐，全响应式设计。', tech: ['响应式设计', 'CMS后台', 'SEO优化', '多语言'] },
  { id: 2, title: '三亚本地餐饮小程序', category: 'miniapp', tags: ['餐饮', '小程序'], desc: '扫码点餐+后厨打印+会员系统一体化微信小程序，支持堂食和外卖。', tech: ['微信小程序', '云开发', '微信支付', '实时订单'] },
  { id: 3, title: '海岛特产电商平台', category: 'ecommerce', tags: ['电商', '零售'], desc: '海南特产在线商城，商品管理+购物车+微信支付+分销系统。', tech: ['电商系统', '微信支付', '分销系统', '数据看板'] },
  { id: 4, title: '三亚房产经纪公司官网', category: 'website', tags: ['房产', '品牌'], desc: '楼盘展示+VR看房+置业顾问匹配+预约看房系统。', tech: ['VR集成', '预约系统', 'CRM对接', 'SEO优化'] },
  { id: 5, title: '连锁奶茶店点餐小程序', category: 'miniapp', tags: ['餐饮', '连锁'], desc: '多门店点餐小程序，支持自取和外卖，会员储值+积分系统。', tech: ['多门店', '会员系统', '微信支付', '数据同步'] },
  { id: 6, title: '企业服务品牌官网', category: 'brand', tags: ['企业服务', '品牌'], desc: '财税咨询公司品牌官网，包含服务展示、在线预约、AI智能客服。', tech: ['品牌设计', 'AI客服', '预约系统', 'CMS后台'] },
  { id: 7, title: '三亚民宿预订平台', category: 'website', tags: ['民宿', '平台'], desc: '多民宿入驻预订平台，支持房态管理、在线支付、评价系统。', tech: ['多商户', '预订日历', '支付集成', '评价系统'] },
  { id: 8, title: '健身俱乐部会员小程序', category: 'miniapp', tags: ['服务', '会员'], desc: '课程预约+会员卡+教练展示+签到系统一体化小程序。', tech: ['预约系统', '会员卡', '签到', '消息推送'] }
];

var currentFilter = 'all';
var cloudBaseReady = false;
var projects = FALLBACK_PROJECTS;

// CloudBase 初始化
async function initCloudBase() {
  if (typeof cloudbase === 'undefined') {
    console.log('CloudBase SDK not loaded, using fallback data');
    if (page === 'works') renderPortfolioGrid(FALLBACK_PROJECTS);
    return;
  }
  try {
    var app = cloudbase.init({ env: 'lyzjkj-top-7g2o2uud420b1470' });
    var auth = app.auth();
    await auth.anonymousAuthProvider().signIn();
    window._cloudbaseDb = app.database();
    cloudBaseReady = true;
    console.log('CloudBase connected');

    // 如果当前是作品页，尝试加载云端数据
    if (page === 'works') {
      loadProjectsFromCloudBase();
    }
  } catch (e) {
    console.warn('CloudBase init failed, using fallback:', e.message);
    if (page === 'works') renderPortfolioGrid(FALLBACK_PROJECTS);
  }
}

async function loadProjectsFromCloudBase() {
  if (!window._cloudbaseDb) {
    renderPortfolioGrid(FALLBACK_PROJECTS);
    return;
  }
  try {
    var res = await window._cloudbaseDb.collection('projects').orderBy('sortOrder', 'asc').get();
    if (res.data && res.data.length > 0) {
      projects = res.data;
      console.log('Loaded ' + projects.length + ' projects from CloudBase');
    }
  } catch (e) {
    console.warn('CloudBase projects load failed, using fallback:', e.message);
    projects = FALLBACK_PROJECTS;
  }
  renderPortfolioGrid(projects);
}

function initPortfolio() {
  // 筛选按钮
  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      currentFilter = this.getAttribute('data-filter');
      filterPortfolio();
    });
  });

  // 弹窗关闭
  var modal = document.getElementById('projectModal');
  if (modal) {
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });
}

function renderPortfolioGrid(projectList) {
  var grid = document.getElementById('portfolioGrid');
  if (!grid) return;
  grid.innerHTML = '';
  projectList.forEach(function(project) {
    var card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', project.category);
    card.setAttribute('data-id', project.id);
    card.innerHTML = '<div class="project-card-img">' +
      '<div class="project-card-placeholder"><i class="fas fa-' + getCategoryIcon(project.category) + '"></i></div>' +
      '</div>' +
      '<div class="project-card-body">' +
        '<span class="project-category-badge">' + getCategoryLabel(project.category) + '</span>' +
        '<h3 class="project-card-title">' + project.title + '</h3>' +
        '<p class="project-card-desc">' + project.desc + '</p>' +
        '<div class="project-card-tags">' + (project.tags || []).map(function(t) { return '<span class="project-tag">' + t + '</span>'; }).join('') + '</div>' +
        '<div class="project-card-tech">' + (project.tech || project.techStack || []).map(function(t) { return '<span class="project-tech-tag">' + t + '</span>'; }).join('') + '</div>' +
      '</div>';
    card.addEventListener('click', function() { openModal(project); });
    grid.appendChild(card);
  });
}

function filterPortfolio() {
  var cards = document.querySelectorAll('.project-card');
  cards.forEach(function(card) {
    if (currentFilter === 'all' || card.getAttribute('data-category') === currentFilter) {
      card.style.display = 'block';
      setTimeout(function() { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(function() { card.style.display = 'none'; }, 300);
    }
  });
}

function openModal(project) {
  var modal = document.getElementById('projectModal');
  if (!modal) return;
  document.getElementById('modalTitle').textContent = project.title;
  document.getElementById('modalCategory').textContent = getCategoryLabel(project.category);
  document.getElementById('modalDesc').textContent = project.desc;
  document.getElementById('modalTags').innerHTML = (project.tags || []).map(function(t) { return '<span class="project-tag">' + t + '</span>'; }).join('');
  document.getElementById('modalTech').innerHTML = (project.tech || project.techStack || []).map(function(t) { return '<span class="project-tech-tag">' + t + '</span>'; }).join('');
  document.getElementById('modalIcon').innerHTML = '<i class="fas fa-' + getCategoryIcon(project.category) + '"></i>';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  var modal = document.getElementById('projectModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function getCategoryLabel(cat) {
  var map = { website: '网站开发', miniapp: '小程序', ecommerce: '电商', brand: '品牌设计', service: '企业服务' };
  return map[cat] || cat;
}

function getCategoryIcon(cat) {
  var map = { website: 'globe', miniapp: 'mobile-alt', ecommerce: 'shopping-cart', brand: 'palette', service: 'briefcase' };
  return map[cat] || 'folder';
}

// ===================================================================
// 工具函数
// ===================================================================
function throttle(func, limit) {
  var inThrottle;
  return function() {
    var args = arguments;
    var context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(function() { inThrottle = false; }, limit);
    }
  };
}
