document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();

    const scrollElements = document.querySelectorAll('.scroll-fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    scrollElements.forEach(el => observer.observe(el));

    // 导航高亮
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    // 构建当前页面可能的URL组合（参考default模板）
    function buildCurrentUrls() {
        const urlParts = currentPath.split('/').filter(item => item && !item.endsWith('.html'));
        const urls = [];
        
        // 生成各级路径
        for (let i = 0; i < urlParts.length; i++) {
            const path = '/' + urlParts.slice(0, i + 1).join('/');
            urls.push(path + '/index.html');
            urls.push(path + '/page.html');
            urls.push(path + '.html');
        }
        
        // 根路径
        if (currentPath === '/' || currentPath === '') {
            urls.push('/');
            urls.push('/index.html');
        }
        
        // 当前完整路径
        urls.push(currentPath);
        
        return urls;
    }
    
    const currentUrls = buildCurrentUrls();
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        // 移除其他高亮
        link.classList.remove('text-primary');
        
        // 检查是否匹配
        let isActive = false;
        
        // 1. 直接匹配href
        if (currentUrls.includes('/' + href) || currentUrls.includes(href)) {
            isActive = true;
        }
        
        // 2. 首页特殊处理
        if ((currentPath === '/' || currentPath === '') && (href === 'index.html' || href === '/')) {
            isActive = true;
        }
        
        // 3. 检查当前路径是否包含href的关键部分
        if (!isActive) {
            const hrefName = href.replace('.html', '');
            if (currentPath.includes('/' + hrefName + '/') || currentPath.includes('/' + hrefName + '.html')) {
                isActive = true;
            }
        }
        
        if (isActive) {
            link.classList.add('text-primary');
        }
    });

    // 移动端侧边栏菜单切换
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    
    function openMobileMenu() {
        if (mobileSidebar && mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('hidden');
            setTimeout(() => {
                mobileMenuOverlay.classList.remove('opacity-0');
                mobileSidebar.classList.remove('translate-x-full');
            }, 10);
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeMobileMenu() {
        if (mobileSidebar && mobileMenuOverlay) {
            mobileSidebar.classList.add('translate-x-full');
            mobileMenuOverlay.classList.add('opacity-0');
            setTimeout(() => {
                mobileMenuOverlay.classList.add('hidden');
            }, 300);
            document.body.style.overflow = '';
        }
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMobileMenu);
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // 点击菜单项后关闭侧边栏
    if (mobileSidebar) {
        mobileSidebar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
});
