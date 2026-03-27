/**
 * 浏览历史记录 - 通用模块
 * 在所有文章详情页面自动记录浏览历史到localStorage
 */
(function() {
    'use strict';
    
    const BROWSER_HISTORY_KEY = 'browser_history';
    const MAX_HISTORY_SIZE = 100;
    
    /**
     * 添加浏览历史
     * @param {Object} article - 文章信息
     * @param {string} article.id - 文章ID
     * @param {string} article.title - 文章标题
     * @param {string} article.img - 文章封面图（可选）
     */
    function addBrowserHistory(article) {
        try {
            if (!article || !article.id || !article.title) {
                console.log('[BrowserHistory] 文章信息不完整，跳过记录');
                return;
            }
            
            let history = JSON.parse(localStorage.getItem(BROWSER_HISTORY_KEY) || '[]');
            const now = new Date().toISOString();
            const existingIndex = history.findIndex(item => item.id === article.id);
            
            if (existingIndex >= 0) {
                // 更新已有记录
                history[existingIndex].lastViewTime = now;
                history[existingIndex].viewCount = (history[existingIndex].viewCount || 0) + 1;
                history[existingIndex].url = window.location.href; // 更新URL
                // 移到最前面
                const item = history.splice(existingIndex, 1)[0];
                history.unshift(item);
            } else {
                // 添加新记录
                history.unshift({
                    id: article.id,
                    title: article.title,
                    url: window.location.href,
                    cover: article.img || '',
                    viewCount: 1,
                    firstViewTime: now,
                    lastViewTime: now
                });
            }
            
            // 限制历史记录数量
            if (history.length > MAX_HISTORY_SIZE) {
                history = history.slice(0, MAX_HISTORY_SIZE);
            }
            
            localStorage.setItem(BROWSER_HISTORY_KEY, JSON.stringify(history));
            console.log('[BrowserHistory] 记录成功:', article.title);
        } catch (error) {
            console.error('[BrowserHistory] 记录失败:', error);
        }
    }
    
    /**
     * 获取浏览历史
     * @returns {Array} 浏览历史列表
     */
    function getBrowserHistory() {
        try {
            return JSON.parse(localStorage.getItem(BROWSER_HISTORY_KEY) || '[]');
        } catch (error) {
            console.error('[BrowserHistory] 获取失败:', error);
            return [];
        }
    }
    
    /**
     * 清空浏览历史
     */
    function clearBrowserHistory() {
        try {
            localStorage.removeItem(BROWSER_HISTORY_KEY);
            console.log('[BrowserHistory] 已清空');
        } catch (error) {
            console.error('[BrowserHistory] 清空失败:', error);
        }
    }
    
    /**
     * 删除单条浏览历史
     * @param {string} id - 文章ID
     */
    function removeBrowserHistory(id) {
        try {
            let history = JSON.parse(localStorage.getItem(BROWSER_HISTORY_KEY) || '[]');
            history = history.filter(item => item.id !== id);
            localStorage.setItem(BROWSER_HISTORY_KEY, JSON.stringify(history));
            console.log('[BrowserHistory] 删除成功:', id);
        } catch (error) {
            console.error('[BrowserHistory] 删除失败:', error);
        }
    }
    
    // 暴露到全局
    window.BrowserHistory = {
        add: addBrowserHistory,
        get: getBrowserHistory,
        clear: clearBrowserHistory,
        remove: removeBrowserHistory
    };
    
    console.log('[BrowserHistory] 模块已加载，请使用 BrowserHistory.add(data) 记录浏览历史');
})();
