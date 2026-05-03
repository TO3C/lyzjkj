// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initMobileMenu();
    initSmoothScrolling();
    initActiveNavLink();
    initScrollAnimations();
    initPortfolioFilter();
    initContactForm();
    initParticles();
    initGlitchEffect();
    initTechIconsAnimation();
    initScrollProgress();
});
// 移动端菜单
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 点击链接后关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 滚动时关闭菜单
    window.addEventListener('scroll', function() {
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// 平滑滚动
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 活动导航链接高亮
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveLink() {
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // 初始更新
    updateActiveLink();
    
    // 滚动时更新 - 使用节流优化
    window.addEventListener('scroll', throttle(updateActiveLink, 16));
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // 数字动画
                if (entry.target.classList.contains('stat-number')) {
                    animateNumber(entry.target);
                }
            }
        });
    }, observerOptions);

    // 添加需要动画的元素
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .contact-item, .fade-in, .stat-number');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// 数字动画
function animateNumber(element) {
    const text = element.textContent;
    
    // 如果是2025年5月这样的文本，直接显示不做动画
    if (text.includes('年') && text.includes('月')) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        return;
    }
    
    // 处理纯数字情况
    const finalNumber = parseInt(text);
    const duration = 2000;
    const increment = finalNumber / (duration / 16);
    let currentNumber = 0;

    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= finalNumber) {
            currentNumber = finalNumber;
            clearInterval(timer);
        }
        
        if (text.includes('年')) {
            element.textContent = Math.floor(currentNumber) + '年';
        } else if (text.includes('+')) {
            element.textContent = Math.floor(currentNumber) + '+';
        } else {
            element.textContent = Math.floor(currentNumber);
        }
    }, 16);
}

// 作品集筛选
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // 初始化作品集项目状态
    portfolioItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
        item.style.transition = 'all 0.3s ease';
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 移除所有活动状态
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.style.position = 'relative';
                    item.style.zIndex = '1';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 作品集项目悬停效果优化
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
            const overlay = this.querySelector('.portfolio-overlay');
            if (overlay) {
                overlay.style.pointerEvents = 'auto';
            }
        });

        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
            const overlay = this.querySelector('.portfolio-overlay');
            if (overlay) {
                overlay.style.pointerEvents = 'none';
            }
        });
    });
}

    // EmailJS 联系表单
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const formMessage = document.getElementById('formMessage');

        console.log('EmailJS loaded:', typeof emailjs);
        
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS not loaded!');
            formMessage.textContent = '邮件服务加载失败，请刷新页面';
            formMessage.className = 'form-message show error';
            return;
        }
        
        // 初始化 EmailJS
        try {
            emailjs.init("SF1gQ4b50a6Q4Z9OX");
            console.log('EmailJS initialized');
        } catch (e) {
            console.error('EmailJS init error:', e);
            formMessage.textContent = '邮件服务初始化失败';
            formMessage.className = 'form-message show error';
            return;
        }

        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();

        // 简化表单验证逻辑
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();

        // 检查是否至少填写了联系方式
        if (!email && !phone) {
            showMessage('error', '请至少填写邮箱或电话其中一个');
            return;
        }

        // 检查需求描述
        if (!message || message.trim().length < 10) {
            showMessage('error', '请详细描述您的需求（至少10个字符）');
            return;
        }

        // 显示加载状态
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
        submitBtn.disabled = true;

        // 准备表单数据
        const formData = {
            email: email,
            phone: phone,
            message: message
        };



        // 发送邮件
        console.log('Sending email with EmailJS...');
        emailjs.send('service_pic12wf', 'template_j4ddbl6', formData)
            .then(function(response) {
                console.log('EmailJS success:', response);
                showMessage('success', '消息发送成功！我们会尽快与您联系。');
                
                // 重置表单
                contactForm.reset();
                
                // 恢复按钮状态
                submitBtn.innerHTML = originalBtnContent;
                submitBtn.disabled = false;
                
                // 3秒后隐藏消息
                setTimeout(() => {
                    hideMessage();
                }, 5000);
                
            }, function(error) {
                // 显示失败消息
                showMessage('error', '发送失败，请稍后重试或直接发送邮件至 296077990@qq.com');
                showMessage('error', `错误详情: ${error.text}`);
                
                // 恢复按钮状态
                submitBtn.innerHTML = originalBtnContent;
                submitBtn.disabled = false;
                
                // 5秒后隐藏消息
                setTimeout(() => {
                    hideMessage();
                }, 5000);
            });
        });

    function showMessage(type, message) {
        formMessage.textContent = message;
        formMessage.className = 'form-message show ' + type;
    }

    function hideMessage() {
        formMessage.classList.remove('show');
    }

    // 表单验证
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        // 移除之前的错误样式
        field.classList.remove('error');

        if (field.hasAttribute('required') && !value) {
            isValid = false;
        }

        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }

        if (!isValid) {
            field.classList.add('error');
            field.style.borderColor = '#ff4444';
        } else {
            field.style.borderColor = '';
        }

        return isValid;
    }
}

// 粒子背景效果
function initParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;

    // 创建动态粒子
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(0, 212, 255, 0.8)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
        particle.style.opacity = Math.random() * 0.8 + 0.2;

        particlesContainer.appendChild(particle);

        // 清理过期粒子
        setTimeout(() => {
            particle.remove();
        }, 20000);
    }

    // 定期创建新粒子
    setInterval(createParticle, 1000);

    // 初始创建一些粒子
    for (let i = 0; i < 20; i++) {
        setTimeout(createParticle, i * 100);
    }
}

// 故障效果增强
function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch');
    
    glitchElements.forEach(element => {
        element.addEventListener('mouseover', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'glitch 2s infinite';
            }, 10);
        });

        // 随机故障效果
        setInterval(() => {
            if (Math.random() > 0.95) {
                element.style.animation = 'none';
                setTimeout(() => {
                    element.style.animation = 'glitch 0.3s infinite';
                    setTimeout(() => {
                        element.style.animation = 'glitch 2s infinite';
                    }, 300);
                }, 10);
            }
        }, 3000);
    });
}

// 技术图标动画
function initTechIconsAnimation() {
    const techIcons = document.querySelectorAll('.tech-icons i');
    
    techIcons.forEach((icon, index) => {
        icon.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = `bounce 0.5s ease`;
            }, 10);
        });

        // 初始动画延迟
        icon.style.animationDelay = `${index * 0.1}s`;
        icon.style.animation = 'float 3s ease-in-out infinite';
    });
}

// 滚动进度指示器
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00d4ff, #0066ff, #ff00ff);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollProgress = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = scrollProgress + '%';
    }, 16));
}

// 导航栏滚动效果
window.addEventListener('scroll', throttle(function() {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 212, 255, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}, 16));

// 鼠标跟随效果（可选）
function initMouseFollower() {
    const follower = document.createElement('div');
    follower.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.8), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transition: transform 0.1s ease;
        transform: translate(-50%, -50%);
    `;
    document.body.appendChild(follower);

    document.addEventListener('mousemove', function(e) {
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    });

    // 悬停在按钮上时的效果
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .service-card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            follower.style.transform = 'translate(-50%, -50%) scale(2)';
            follower.style.background = 'radial-gradient(circle, rgba(255, 0, 255, 0.8), transparent)';
        });
        
        element.addEventListener('mouseleave', function() {
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.background = 'radial-gradient(circle, rgba(0, 212, 255, 0.8), transparent)';
        });
    });
}

// 页面加载动画
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// 防止页面在移动设备上的橡皮筋效果
document.addEventListener('touchmove', function(e) {
    const portfolioGrid = e.target.closest('.portfolio-grid');
    const servicesGrid = e.target.closest('.services-grid');
    const techShowcase = e.target.closest('.tech-showcase');
    
    if (portfolioGrid || servicesGrid || techShowcase) {
        return;
    }
    
    if (document.body.scrollHeight > window.innerHeight) {
        return;
    }
    
    e.preventDefault();
}, { passive: false });

// 添加键盘导航支持
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // 关闭移动菜单
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// 性能优化：节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 优化滚动事件 - 已合并到各个滚动事件处理函数中
// window.addEventListener('scroll', throttle(function() {
//     // 滚动相关的事件处理
// }, 16)); // 约60fps

// 鼠标跟随效果已禁用以避免冲突
// initMouseFollower();

// 技术展示区域动画
function initTechShowcase() {
    const codeLines = document.querySelectorAll('.code-line');
    const floatingElements = document.querySelectorAll('.element');
    
    // 代码行动画
    codeLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            line.style.transition = 'all 0.5s ease';
            line.style.opacity = '0.8';
            line.style.transform = 'translateX(0)';
        }, 100 * index);
    });
    
    // 浮动元素动画
    floatingElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px) scale(0.8)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) scale(1)';
        }, 500 + 200 * index);
    });
    
    // 添加悬停效果
    const techShowcase = document.querySelector('.tech-showcase');
    const mainIcon = document.querySelector('.main-icon');
    
    techShowcase.addEventListener('mouseenter', function() {
        mainIcon.style.transform = 'scale(1.1) rotate(5deg)';
        mainIcon.style.color = 'var(--accent-color)';
    });
    
    techShowcase.addEventListener('mouseleave', function() {
        mainIcon.style.transform = 'scale(1) rotate(0deg)';
        mainIcon.style.color = 'var(--primary-color)';
    });
    
    // 元素点击效果
    floatingElements.forEach(element => {
        element.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'elementPulse 0.5s ease';
            }, 10);
        });
    });
}

// 元素脉冲动画
const style = document.createElement('style');
style.textContent = `
    @keyframes elementPulse {
        0% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.2) rotate(10deg); }
        100% { transform: scale(1) rotate(0deg); }
    }
`;
document.head.appendChild(style);

// 在滚动到技术展示区域时初始化动画
const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initTechShowcase();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const techShowcase = document.querySelector('.tech-showcase');
if (techShowcase) {
    observer.observe(techShowcase);
}

// ====== AI聊天引擎 V3.0（三层架构：本地KB → 云端API → 智能回退） ======
const AI_CHAT_API = 'https://cloud1-0ggg2niq36a70b37.service.tcloudbase.com/ai-chat';
let chatHistory = [];

// ====== 本地知识库 V3.0（同步 AI知识库_官网客服_V3.0.md） ======
const AI_KB = {
    company: {
        name:'三亚流云智炬科技工作室', slogan:'用温度做技术',
        addr:'海南省三亚市', tel:'13876597418', wx:'Lyzjkj',
        email:'296077990@qq.com', web:'www.lyzjkj.top',
        hours:'周一至周五 9:00-18:00',
    },
    webPricing: [
        { name:'A1·体验版', price:'¥3,800', market:'¥5,000~8,000', pages:'1页单页滚动', days:'3天', desc:'极简品牌展示', features:'移动端适配+域名1年+服务器1年' },
        { name:'A2·初创版 ⭐', price:'¥6,800', market:'¥8,000~12,000', pages:'5页', days:'7天', desc:'初创企业首选', features:'CMS后台+SEO基础+域名1年+服务器1年' },
        { name:'B1·品牌版 ⭐主推', price:'¥12,800', market:'¥15,000~25,000', pages:'8页', days:'12天', desc:'成长型企业品牌升级', features:'原创UI+CMS完整版+SEO深度+博客系统+AI客服(50问答)+在线留言' },
        { name:'B2·专业版', price:'¥19,800', market:'¥25,000~40,000', pages:'15页', days:'18天', desc:'中大型/外贸公司', features:'2轮风格提案+数据分析面板+SEO+百度收录+双语(中英)+AI客服(200问答)+服务器2年' },
        { name:'C1·集团版', price:'¥29,800', market:'¥40,000~80,000', pages:'20页+', days:'25天', desc:'集团/上市企业', features:'3语种+会员系统+API对接+售后6个月' },
        { name:'C2·定制版', price:'¥50,000起', market:'¥80,000~150,000', pages:'不限', days:'按需', desc:'大型平台/特殊需求', features:'全部功能+电商+售后12个月' },
    ],
    mpPricing: [
        { name:'MP1·展示版', price:'¥5,800', market:'¥15,000~30,000', days:'7天', desc:'小微企业品牌展示', features:'5页+一键拨号+一键导航' },
        { name:'MP2·基础功能版 ⭐', price:'¥9,800', market:'¥30,000~50,000', days:'12天', desc:'服务型/预约型企业', features:'8页+预约/报名/留言+用户系统+CMS后台' },
        { name:'MP3·电商标准版', price:'¥18,800', market:'¥50,000~80,000', days:'18天', desc:'中小电商/零售', features:'15页+商品管理+购物车+微信支付+优惠券+订单管理' },
        { name:'MP4·电商专业版', price:'¥29,800', market:'¥80,000~150,000', days:'25天', desc:'品牌电商/连锁', features:'多规格商品+微信支付宝双支付+拼团秒杀+会员积分+二级分销+数据看板' },
        { name:'MP5·多商户平台版', price:'¥48,000起', market:'¥100,000~200,000', days:'按需', desc:'本地生活平台', features:'多商户入驻+平台抽佣+商户管理后台' },
    ],
    industries: {
        '酒店民宿':{price:'+¥5,000',features:'房型管理+预订日历+在线支付+周边推荐',base:'推荐 A2初创版 ¥6,800 或 B1品牌版 ¥12,800'},
        '餐饮美食':{price:'+¥6,000',features:'扫码点餐+后厨打印+排队系统+堂食管理',base:'推荐 MP2基础功能版 ¥9,800'},
        '零售商贸':{price:'+¥8,000',features:'多门店库存+会员储值+积分兑换+收银台',base:'推荐 MP3电商标准版 ¥18,800'},
        '企业服务':{price:'+¥3,000',features:'AI智能客服+在线预约+案例管理+服务评价',base:'推荐 B1品牌版 ¥12,800'},
        '房产家装':{price:'+¥8,000',features:'楼盘管理+VR嵌入+置业顾问分配+预约看房',base:'推荐 B1品牌版 ¥12,800'},
    },
    combos: [
        { name:'初创组合', content:'网站A1+小程序MP1', price:'¥8,000', save:'¥1,600' },
        { name:'成长组合 ⭐', content:'网站A2+小程序MP2', price:'¥14,000', save:'¥2,600' },
        { name:'品牌组合', content:'网站B1+小程序MP3', price:'¥27,000', save:'¥4,600' },
        { name:'旗舰组合', content:'网站B2+小程序MP4', price:'¥42,000', save:'¥7,600' },
    ],
    faq: {
        '源码归谁':'网站前端源码和小程序源码都归您所有，验收后完整交付。域名用您的信息注册，服务器用您的账号购买——网站和小程序都是您自己的资产。',
        '售后多久':'验收后免费售后3个月。包含：程序Bug修复（1工作日内）、服务器故障排查（2小时内）、安全紧急补丁、使用操作指导。不包含功能新增和内容代更新。',
        '多久上线':'网站：A1体验版3天 / A2初创版7天 / B1品牌版12天 / B2专业版18天 / C1集团版25天。小程序另加微信审核7-14天（不计入工期）。以上均不含客户反馈时间。',
        '怎么付款':'≤3万项目：50%首付+50%验收后付。>3万项目：40%首付+30%中期款(设计确认后)+30%尾款(验收后)。支持银行转账、支付宝、微信支付。',
        '能不能便宜':'我们的价格已经是海南本地特惠价了——同样品质，一线城市贵30-50%。套餐价不打折（品质不打折），但组合购买有优惠（如网站+小程序组合可省¥1,600~7,600），老客户转介绍双方各返¥500。',
        '合同':'我们使用标准服务合同，明确约定：源码归属、知识产权、数据保护、售后范围、违约条款（万分之五/天）。支持电子签约（法大大/腾讯电子签），也支持纸质合同。',
        '案例':'有的！我们已服务50+客户，涵盖酒店民宿、餐饮、零售、企业服务等多个行业。可以针对您的行业发相关案例给您参考。',
        '模板和定制区别':'模板站=租房：源码不是你的，改不了，搬家搬不走，年费越交越多。定制站=买房：源码是你的，想怎么改怎么改，域名服务器都在你名下，一次性付费。',
        '微信审核':'小程序需提交微信审核（7-14天），这个时间不计入工期。首次审核失败免费修改，我们有丰富的审核经验，通过率很高。',
        '维护费':'免费售后3个月结束后，可选续费：基础维护 ¥3,600/年（含每月1次内容更新），高级维护 ¥9,800/年（含功能微调+每月3次更新）。也可以按次付费 ¥500/次。',
    },
};

// ====== 关键词匹配引擎 ======
function matchKB(msg) {
    const m = msg.toLowerCase();
    // 公司联系方式
    if (/电话|微信|联系|怎么联系|在哪|地址/.test(m)) {
        return `📞 电话：${AI_KB.company.tel}<br>💬 微信：${AI_KB.company.wx}<br>📧 邮箱：${AI_KB.company.email}<br>🌐 官网：${AI_KB.company.web}<br>📍 地址：${AI_KB.company.addr}<br>⏰ 工作时间：${AI_KB.company.hours}`;
    }
    // 网站报价
    if (/网站.*(?:多少钱|报价|价格|套餐|收费)|做.*网站.*(?:多少|价格|报价|费用)|网站.*开发/.test(m)) {
        let r = '<b>🏨 网站开发套餐 V3.0（含市场参考价对比）</b><br><br>';
        AI_KB.webPricing.forEach(p => {
            r += `<b>${p.name}</b> <b style="color:var(--primary-color);">${p.price}</b>（市场 ${p.market}）<br>`;
            r += `　${p.pages} · ${p.days} · ${p.desc}<br>`;
            r += `　${p.features}<br><br>`;
        });
        r += '💡 海南本地团队，比一线城市便宜30-50%<br>💡 源码+域名+服务器全部交付<br>💡 售后3个月免费';
        return r;
    }
    // 小程序报价
    if (/小程序.*(?:多少钱|报价|价格|套餐|收费)|做.*小程序.*(?:多少|价格|报价|费用)|小程序.*开发/.test(m)) {
        let r = '<b>📱 小程序开发套餐 V3.0（含市场定制均价对比）</b><br><br>';
        AI_KB.mpPricing.forEach(p => {
            r += `<b>${p.name}</b> <b style="color:var(--primary-color);">${p.price}</b>（市场定制均价 ${p.market}）<br>`;
            r += `　${p.days} · ${p.desc}<br>`;
            r += `　${p.features}<br><br>`;
        });
        r += '💡 源码全部交付，比SaaS年费方案更划算<br>💡 微信审核时间不计入工期';
        return r;
    }
    // 行业匹配
    if (/民宿|酒店|客栈/.test(m)) {
        const ind = AI_KB.industries['酒店民宿'];
        return `<b>🏨 酒店民宿行业方案</b><br><br>${ind.base}<br>+ 行业功能包 <b style="color:var(--primary-color);">${ind.price}</b><br><br>📦 功能包内容：${ind.features}<br><br>💰 综合报价示例：<br>　A2初创版 + 功能包 = <b style="color:var(--primary-color);">¥11,800</b><br>　B1品牌版 + 功能包 = <b style="color:var(--primary-color);">¥17,800</b><br><br>👉 需要针对您的民宿/酒店做具体方案吗？告诉我房间数和需求～`;
    }
    if (/餐饮|餐厅|饭店|点餐/.test(m)) {
        const ind = AI_KB.industries['餐饮美食'];
        return `<b>🍽️ 餐饮美食行业方案</b><br><br>${ind.base}<br>+ 行业功能包 <b style="color:var(--primary-color);">${ind.price}</b><br><br>📦 功能包内容：${ind.features}<br><br>💰 综合报价：MP2 + 功能包 = <b style="color:var(--primary-color);">¥15,800</b><br><br>👉 需要扫码点餐还是排队叫号？告诉我具体需求～`;
    }
    if (/零售|电商|商城|卖东西|开店/.test(m)) {
        const ind = AI_KB.industries['零售商贸'];
        return `<b>🛍️ 零售商贸行业方案</b><br><br>${ind.base}<br>+ 行业功能包 <b style="color:var(--primary-color);">${ind.price}</b><br><br>📦 功能包内容：${ind.features}<br><br>💡 如果是纯电商，推荐 MP3电商标准版 ¥18,800 或 MP4电商专业版 ¥29,800<br><br>👉 主要卖什么品类？需要多门店管理吗？`;
    }
    // 组合优惠
    if (/网站.*小程序|小程序.*网站|组合|打包|两个都要/.test(m)) {
        let r = '<b>🎁 网站+小程序组合优惠</b><br><br>';
        AI_KB.combos.forEach(c => {
            r += `<b>${c.name}</b>：${c.content}<br>`;
            r += `　组合价 <b style="color:var(--primary-color);">${c.price}</b>（节省 ${c.save}）<br><br>`;
        });
        r += '💡 组合购买后台数据打通，统一管理';
        return r;
    }
    // FAQ 匹配
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
        return `<b>💡 我们的优势</b><br><br>
✅ <b>源码交付</b>：网站是你的，不是租的<br>
✅ <b>原创设计</b>：一对一沟通，拒绝模板套用<br>
✅ <b>海南本地</b>：实时响应，没有一线城市溢价<br>
✅ <b>价格透明</b>：明码标价，市场参考价对比<br>
✅ <b>售后保障</b>：免费3个月，Bug 1工作日内修复<br>
✅ <b>数据保护</b>：合同明确数据保护条款<br>
✅ <b>AI智能客服</b>：B1及以上套餐免费赠送<br>
📞 ${AI_KB.company.tel} | 💬 ${AI_KB.company.wx}`;
    }
    // 合作流程
    if (/流程|步骤|怎么.*做|过程/.test(m)) {
        return `<b>📋 合作流程</b><br><br>
1️⃣ <b>需求沟通</b>：了解行业/功能/预算/风格<br>
2️⃣ <b>方案报价</b>：1个工作日内出方案+报价<br>
3️⃣ <b>签约启动</b>：签合同+付首付，提供素材<br>
4️⃣ <b>UI设计</b>：首页设计→反馈→定稿→内页设计<br>
5️⃣ <b>开发测试</b>：前后端开发→联调→内部测试<br>
6️⃣ <b>验收上线</b>：客户验收→部署上线→操作培训<br>
7️⃣ <b>售后服务</b>：免费3个月，7天/30天/90天回访<br><br>
📅 总工期 3-25 个工作日（按套餐不同）`;
    }
    // 需求评估引导
    if (/评估|推荐|建议|适合|不知道.*选|帮我.*选/.test(m)) {
        return `🤔 <b>帮您快速评估</b><br><br>请告诉我：<br>
1️⃣ 您是什么行业？（酒店/餐饮/零售/企业服务/其他）<br>
2️⃣ 主要目的是什么？（品牌展示/在线获客/在线交易）<br>
3️⃣ 预算大概在什么范围？<br>
4️⃣ 期望什么时间上线？<br><br>
💡 也可以直接 📞 ${AI_KB.company.tel} 或 💬 ${AI_KB.company.wx}，我们电话沟通更快～`;
    }
    // 打招呼
    if (/你好|hi|hello|嗨|在吗/.test(m)) {
        return `你好呀～欢迎来到流云智炬！😊<br><br>
我们是三亚本地的互联网工作室，专注：<br>
🌐 企业品牌官网开发<br>
📱 微信小程序开发<br>
🤖 AI智能客服<br><br>
你可以直接问我：<br>
· "网站开发多少钱？"<br>
· "民宿小程序方案"<br>
· "你们有什么优势？"<br>
· "做网站要多久？"<br><br>
也可以 📞 ${AI_KB.company.tel} 或 💬 ${AI_KB.company.wx} 直接联系我们～`;
    }
    // 无匹配 → 交云端API处理
    return null;
}

// ====== 三层智能回复引擎 ======
async function callAI(message) {
    // 第一层：本地知识库匹配（毫秒级响应）
    const kbReply = matchKB(message);
    if (kbReply) {
        chatHistory.push({ role: 'user', content: message });
        chatHistory.push({ role: 'assistant', content: kbReply });
        if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
        return kbReply;
    }
    // 第二层：CloudBase AI 云函数（处理复杂/冷门问题）
    try {
        const res = await fetch(AI_CHAT_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history: chatHistory })
        });
        const data = await res.json();
        if (data.code === 200 && data.data && data.data.reply) {
            chatHistory.push({ role: 'user', content: message });
            chatHistory.push({ role: 'assistant', content: data.data.reply });
            if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
            return data.data.reply;
        }
        throw new Error(data.msg || 'API error');
    } catch (e) {
        // 第三层：增强回退（带联系方式引导）
        console.error('AI API error:', e);
        return `抱歉，这个问题我需要一点时间思考～<br><br>📞 你可以直接电话联系：<b>${AI_KB.company.tel}</b><br>💬 或者加微信：<b>${AI_KB.company.wx}</b><br>📧 邮箱：${AI_KB.company.email}<br><br>我们会在第一时间回复你！`;
    }
}

// ====== 聊天UI ======
document.addEventListener('DOMContentLoaded', function() { initAIChat(); });

let chatMessages, chatInput;

function getCurrentTime() {
    const now = new Date();
    return String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
}

function initAIChat() {
    const chatWidget = document.getElementById('aiChatWidget');
    if (!chatWidget) return;
    chatMessages = document.getElementById('chatMessages');
    chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    if (!chatMessages || !chatInput || !chatSend) return;
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
    loadChatHistory();
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    addMessage(message, 'user');
    chatInput.value = '';
    showTyping();
    const reply = await callAI(message);
    removeTyping();
    addMessage(reply, 'ai');
}

function addMessage(content, type) {
    const div = document.createElement('div');
    div.className = `message message-${type}`;
    div.innerHTML = `<div class="message-content">${content.replace(/\n/g,'<br>')}</div><div class="message-time">${getCurrentTime()}</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    saveChatHistory();
}

function showTyping() {
    const div = document.createElement('div');
    div.id = 'typing';
    div.className = 'message message-ai';
    div.innerHTML = '<div class="message-content typing"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() { const t = document.getElementById('typing'); if (t) t.remove(); }

function saveChatHistory() {
    const msgs = [];
    chatMessages.querySelectorAll('.message').forEach(m => {
        if (m.id === 'typing') return;
        const c = m.querySelector('.message-content');
        if (c) msgs.push({ content: c.innerText, type: m.classList.contains('message-user') ? 'user' : 'ai' });
    });
    const q = chatMessages.querySelector('.quick-replies');
    if (q) q.remove();
    localStorage.setItem('ai-chat-history', JSON.stringify(msgs));
}

function loadChatHistory() {
    const saved = localStorage.getItem('ai-chat-history');
    if (saved) {
        try {
            const msgs = JSON.parse(saved);
            chatMessages.innerHTML = '';
            msgs.forEach(m => {
                const d = document.createElement('div');
                d.className = `message message-${m.type}`;
                d.innerHTML = `<div class="message-content">${m.content.replace(/\n/g,'<br>')}</div>`;
                chatMessages.appendChild(d);
            });
            addQuickReplies();
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch(e) { addQuickReplies(); }
    } else { addQuickReplies(); }
}

function addQuickReplies() {
    const q = document.createElement('div');
    q.className = 'quick-replies';
    q.innerHTML = `<button class="quick-reply-btn" data-q="pricing">💰 网站开发报价</button><button class="quick-reply-btn" data-q="miniapp">📱 小程序报价</button><button class="quick-reply-btn" data-q="combo">🎁 网站+小程序组合</button>`;
    chatMessages.appendChild(q);
    q.querySelectorAll('.quick-reply-btn').forEach(b => {
        b.addEventListener('click', () => {
            const v = b.dataset.q === 'pricing' ? '网站开发多少钱？' : b.dataset.q === 'miniapp' ? '小程序报价多少？' : '网站和小程序一起做有优惠吗？';
            chatInput.value = v;
            sendMessage();
        });
    });
}

if (document.getElementById('aiChatWidget')) loadChatHistory();
