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

// EmailJS联系表单
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    // EmailJS 配置
    
    try {
        emailjs.init("SF1gQ4b50a6Q4Z9OX"); // 替换为你的实际公钥
    } catch (error) {
        showMessage('error', 'EmailJS 初始化失败，请检查配置');
        return;
    }

    contactForm.addEventListener('submit', function(e) {
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
        const submitBtn = contactForm.querySelector('button[type="submit"]');
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
        emailjs.send('service_pic12wf', 'template_j4ddbl6', formData)
            .then(function(response) {
                // 显示成功消息
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
                showMessage('error', `错误详情: ${error.message}`);
                
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
