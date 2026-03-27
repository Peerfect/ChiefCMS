function getCookie(key) {
  const name = key + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return decodeURIComponent(c.substring(name.length));
    }
  }
  return null;
}

// Toast 提示函数
function showToast(message, type = 'info', duration = 2000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  // 自动移除
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

class CommentManager {
  constructor(articleId) {
    this.articleId = articleId;
    this.currentPage = 1;
    this.pageSize = 10;
    this.comments = [];
    this.isLoading = false;
  }

  async loadComments(page = 1, append = false) {
    if (this.isLoading) return;

    this.isLoading = true;
    try {
      const response = await fetch(`/member/v1/articleComments?articleId=${this.articleId}&page=${page}&pageSize=${this.pageSize}`, {
        credentials: 'include'
      });
      const result = await response.json();

      console.log('[CommentManager.loadComments] API返回:', result);

      if (result.success) {
        const list = result.data?.list || [];
        console.log('[CommentManager.loadComments] 评论列表:', list);

        if (append) {
          // 追加模式：将新数据追加到现有数组
          this.comments = [...this.comments, ...list];
        } else {
          // 非追加模式：替换数据
          this.comments = list;
        }
        this.currentPage = page;
        this.renderComments(append, result.data?.count || 0);
        this.renderPagination(result.data);
      } else {
        console.error('获取评论失败:', result.msg);
      }
    } catch (error) {
      console.error('获取评论失败:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async likeComment(commentId, element) {
    try {
      const response = await fetch('/member/v1/likeComment', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: commentId })
      });
      const result = await response.json();
      
      if (result.success) {
        this.updateLikeStatus(commentId, result.data.isLiked, result.data.likeCount, element);
      } else {
        console.error('点赞失败:', result.msg);
      }
    } catch (error) {
      console.error('点赞失败:', error);
    }
  }

  async deleteComment(commentId, element) {
    if (!confirm('确定要删除这条评论吗？')) return;
    
    try {
      const response = await fetch('/member/v1/deleteComment', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: commentId })
      });
      const result = await response.json();
      
      if (result.success) {
        this.removeCommentFromList(commentId, element);
        showToast('删除成功', 'success');
      } else {
        console.error('删除评论失败:', result.msg);
        showToast(result.msg || '删除失败', 'error');
      }
    } catch (error) {
      console.error('删除评论失败:', error);
      showToast('删除失败', 'error');
    }
  }

  updateLikeStatus(commentId, isLiked, likeCount, element) {
    // element 是 button 元素本身
    const likeBtn = element;
    const likeCountEl = element.querySelector('.comment-like-count');

    if (likeBtn && likeCountEl) {
      if (isLiked) {
        likeBtn.classList.add('liked');
      } else {
        likeBtn.classList.remove('liked');
      }
      likeCountEl.textContent = likeCount;
    }
  }

  removeCommentFromList(commentId, element) {
    const commentItem = element.closest('.comment-item');
    if (commentItem) {
      commentItem.style.opacity = '0';
      setTimeout(() => {
        commentItem.remove();
      }, 300);
    }
  }

  renderComments(append = false, totalCount = 0) {
    const container = document.getElementById('comment-list');
    const countEl = document.getElementById('comment-count');
    if (!container) return;

    // 更新评论数量
    if (countEl && totalCount > 0) {
      countEl.textContent = totalCount;
    }

    if (this.comments.length === 0) {
      container.innerHTML = '<div class="comment-empty">暂无评论，快来抢沙发吧~</div>';
      return;
    }

    // API 已经返回了树形结构，直接使用
    const html = this.comments.map(comment => {
      return this.renderCommentWithReplies(comment);
    }).join('');

    if (append) {
      // 追加模式：找到加载更多按钮，在其前面插入新内容
      const loadMoreBtn = container.querySelector('.comment-load-more');
      if (loadMoreBtn) {
        loadMoreBtn.insertAdjacentHTML('beforebegin', html);
      } else {
        container.insertAdjacentHTML('beforeend', html);
      }
    } else {
      // 非追加模式：替换整个容器内容
      container.innerHTML = html;
    }
  }

  renderCommentWithReplies(comment) {
    const avatar = comment.avatar || '/images/default-avatar.svg';
    const nickname = comment.nickname || comment.username || '匿名用户';
    const likedClass = comment.is_liked ? 'liked' : '';

    // 转义昵称中的特殊字符，防止 XSS
    const escapedNickname = nickname.replace(/'/g, "\\'").replace(/"/g, '\\"');

    // 递归渲染回复树
    const repliesHtml = comment.replies?.length 
      ? this.renderReplies(comment.replies) 
      : '';

    return `
      <div class="comment-item" data-id="${comment.id}">
        <div class="comment-main">
          <div class="comment-avatar">
            <img src="${avatar}" alt="${nickname}" onerror="this.src='/images/default-avatar.svg'">
          </div>
          <div class="comment-info">
            <div class="comment-header">
              <span class="comment-nickname">${nickname}</span>
              <span class="comment-time">${this.formatTime(comment.createdAt)}</span>
            </div>
            <div class="comment-body">${comment.content}</div>
            <div class="comment-actions">
              <button class="comment-like ${likedClass}" onclick="commentManager.likeComment(${comment.id}, this)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                </svg>
                <span class="comment-like-count">${comment.like_count || 0}</span>
              </button>
              <button class="comment-reply" onclick="commentManager.showReplyBox(${comment.id}, '${escapedNickname}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                <span>回复</span>
              </button>
            </div>
            ${repliesHtml}
          </div>
        </div>
      </div>
    `;
  }

  // 渲染回复列表（所有层级都在第二层平铺展示）
  renderReplies(replies, depth = 0) {
    if (!replies || replies.length === 0) return '';

    // 收集所有回复（包括嵌套的）到单层数组
    const flattenReplies = (items, result = []) => {
      items.forEach(item => {
        result.push(item);
        if (item.replies?.length) {
          flattenReplies(item.replies, result);
        }
      });
      return result;
    };

    // 如果是第一层调用，平铺所有回复
    const allReplies = depth === 0 ? flattenReplies(replies) : replies;

    const repliesHtml = allReplies.map(reply => {
      const nickname = reply.nickname || reply.username || '匿名用户';
      const likedClass = reply.is_liked ? 'liked' : '';
      const replyToText = reply.reply_to_username ? `@${reply.reply_to_username}` : '';
      const escapedNickname = nickname.replace(/'/g, "\\'").replace(/"/g, '\\"');
      
      // 格式：昵称 @被回复者：内容
      const contentHtml = replyToText 
        ? `${nickname} <span class="reply-to">${replyToText}</span>：${reply.content}`
        : `${nickname}：${reply.content}`;

      return `
        <div class="comment-reply-item" data-id="${reply.id}">
          <div class="comment-reply-body">${contentHtml}</div>
          <div class="comment-reply-actions">
            <span class="comment-time">${this.formatTime(reply.createdAt)}</span>
            <button class="comment-like ${likedClass}" onclick="commentManager.likeComment(${reply.id}, this)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
              </svg>
              <span class="comment-like-count">${reply.like_count || 0}</span>
            </button>
            <button class="comment-reply-btn" onclick="commentManager.showReplyBox(${reply.id}, '${escapedNickname}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              <span>回复</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    return `<div class="comment-replies">${repliesHtml}</div>`;
  }

  renderComment(comment, isReply = false) {
    const avatar = comment.avatar || '/images/default-avatar.svg';
    const nickname = comment.nickname || comment.username || '匿名用户';
    const likedClass = comment.is_liked ? 'liked' : '';

    // 回复内容：回复者 @被回复者：内容
    let contentHtml = comment.content;
    if (isReply && comment.reply_to_username) {
      contentHtml = `${nickname} <span class="reply-to">@${comment.reply_to_username}</span>：${comment.content}`;
    }

    // 转义昵称中的特殊字符，防止 XSS
    const escapedNickname = nickname.replace(/'/g, "\\'").replace(/"/g, '\\"');

    return `
      <div class="comment-item ${isReply ? 'reply-item' : ''}" data-id="${comment.id}">
        <div class="comment-main">
          <div class="comment-avatar">
            <img src="${avatar}" alt="${nickname}" onerror="this.src='/images/default-avatar.svg'">
          </div>
          <div class="comment-info">
            <div class="comment-header">
              <span class="comment-nickname">${nickname}</span>
              <span class="comment-time">${this.formatTime(comment.createdAt)}</span>
            </div>
            <div class="comment-body">${contentHtml}</div>
            <div class="comment-actions">
              <button class="comment-like ${likedClass}" onclick="commentManager.likeComment(${comment.id}, this)">
                <i class="icon-heart"></i>
                <span class="comment-like-count">${comment.like_count || 0}</span>
              </button>
              <button class="comment-reply" onclick="commentManager.showReplyBox(${comment.id}, '${escapedNickname}')">
                <i class="icon-reply"></i>
                <span>回复</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderPagination(data) {
    const container = document.getElementById('comment-pagination');
    if (!container) return;

    // 如果没有更多数据，不显示分页
    if (data.current >= data.total) {
      container.innerHTML = '';
      return;
    }

    // 显示"加载更多"按钮
    container.innerHTML = `
      <div class="comment-load-more">
        <button class="load-more-btn" onclick="commentManager.loadMore()">
          加载更多
        </button>
      </div>
    `;
  }

  async loadMore() {
    const nextPage = this.currentPage + 1;
    await this.loadComments(nextPage, true);
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) {
      return '刚刚';
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)}分钟前`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)}小时前`;
    } else if (diff < 2592000) {
      return `${Math.floor(diff / 86400)}天前`;
    } else {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
  }

  showReplyBox(commentId, username) {
    // 先尝试查找主评论，再尝试查找回复项
    let commentItem = document.querySelector(`.comment-item[data-id="${commentId}"]`);
    let replyItem = document.querySelector(`.comment-reply-item[data-id="${commentId}"]`);
    
    if (!commentItem && !replyItem) {
      console.log('[showReplyBox] commentItem not found for id:', commentId);
      return;
    }

    // 先关闭其他已打开的回复框
    document.querySelectorAll('.reply-box-container').forEach(el => el.remove());

    // 创建回复框容器
    let replyBoxContainer = document.createElement('div');
    replyBoxContainer.className = 'reply-box-container';
    replyBoxContainer.dataset.forCommentId = commentId;
    
    replyBoxContainer.innerHTML = `
      <div class="reply-box">
        <div class="reply-to">回复${username}...</div>
        <textarea id="reply-content-${commentId}" placeholder="输入回复内容..." maxlength="500"></textarea>
        <div class="reply-toolbar">
          <div class="reply-tools">
            <button type="button" class="emoji-btn" title="表情">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            </button>
          </div>
          <div class="reply-submit-area">
            <span class="char-count" id="reply-char-count-${commentId}">0/500</span>
            <button class="btn-cancel" onclick="commentManager.hideReplyBox(${commentId})">取消</button>
            <button class="btn-submit" id="reply-submit-${commentId}" onclick="commentManager.submitReply(${commentId})" disabled>回复</button>
          </div>
        </div>
      </div>
    `;

    // 在当前评论/回复项后面插入回复框
    if (replyItem) {
      // 如果是回复项，在当前回复后面插入
      replyItem.insertAdjacentElement('afterend', replyBoxContainer);
    } else if (commentItem) {
      // 如果是主评论，在 comment-actions 后面插入
      const commentActions = commentItem.querySelector('.comment-actions');
      if (commentActions) {
        commentActions.insertAdjacentElement('afterend', replyBoxContainer);
      } else {
        // 如果找不到 actions，则在 comment-info 最后插入
        const commentInfo = commentItem.querySelector('.comment-info');
        if (commentInfo) {
          commentInfo.appendChild(replyBoxContainer);
        }
      }
    }

    // 自动聚焦到输入框并添加字数统计
    setTimeout(() => {
      const textarea = document.getElementById(`reply-content-${commentId}`);
      const charCount = document.getElementById(`reply-char-count-${commentId}`);
      const submitBtn = document.getElementById(`reply-submit-${commentId}`);
      
      if (textarea) {
        textarea.focus();
        textarea.addEventListener('input', function() {
          const length = this.value.length;
          if (charCount) charCount.textContent = `${length}/500`;
          if (submitBtn) submitBtn.disabled = length === 0;
        });
      }
    }, 100);
  }

  hideReplyBox(commentId) {
    // 查找对应评论的回复框并移除
    const replyBox = document.querySelector(`.reply-box-container[data-for-comment-id="${commentId}"]`);
    if (replyBox) {
      replyBox.remove();
    }
  }

  async submitReply(commentId) {
    const textarea = document.getElementById(`reply-content-${commentId}`);
    const content = textarea?.value?.trim();

    if (!content) {
      showToast('请输入回复内容', 'info');
      return;
    }

    // 需要登录才能回复
    if (!this.isLoggedIn()) {
      showToast('请先登录', 'info');
      return;
    }

    // 获取被回复评论的信息（可能是主评论或回复）
    const commentItem = document.querySelector(`.comment-item[data-id="${commentId}"]`);
    const replyItem = document.querySelector(`.comment-reply-item[data-id="${commentId}"]`);
    const targetItem = commentItem || replyItem;
    const replyToNickname = targetItem?.querySelector('.comment-nickname')?.textContent || '';

    try {
      const response = await fetch('/member/v1/comment', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId: this.articleId,
          content: content,
          parentId: commentId,
          replyToMemberId: null,
          replyToUsername: replyToNickname
        })
      });

      const result = await response.json();

      if (result.success) {
        // 关闭回复框
        this.hideReplyBox(commentId);
        // 刷新评论列表，保持在当前页
        this.loadComments(this.currentPage, false);
        showToast('回复成功', 'success');
      } else {
        showToast(result.msg || '回复失败', 'error');
      }
    } catch (error) {
      console.error('回复失败:', error);
      showToast('回复失败，请稍后重试', 'error');
    }
  }

  async submitMainComment() {
    const textarea = document.getElementById('main-comment-content');
    const content = textarea?.value?.trim();

    if (!content) {
      showToast('请输入评论内容', 'info');
      return;
    }

    if (!this.isLoggedIn()) {
      showToast('请先登录', 'info');
      return;
    }

    try {
      const response = await fetch('/member/v1/comment', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId: this.articleId,
          content: content,
          parentId: null,
          replyToMemberId: null,
          replyToUsername: null
        })
      });

      const result = await response.json();

      if (result.success) {
        textarea.value = '';
        document.getElementById('main-char-count').textContent = '0/1000';
        document.getElementById('submit-main-comment').disabled = true;
        this.loadComments(1, false);
        showToast('评论成功', 'success');
      } else {
        showToast(result.msg || '评论失败', 'error');
      }
    } catch (error) {
      console.error('评论失败:', error);
      showToast('评论失败，请稍后重试', 'error');
    }
  }

  isLoggedIn() {
    return getCookie('ut') !== null;
  }

  checkLoginStatus() {
    const form = document.getElementById('main-comment-form');
    const prompt = document.getElementById('comment-login-prompt');
    
    if (!form || !prompt) {
      console.log('[CommentManager.checkLoginStatus] Elements not found', { form: !!form, prompt: !!prompt });
      return;
    }
    
    if (this.isLoggedIn()) {
      form.style.display = 'block';
      prompt.style.display = 'none';
    } else {
      form.style.display = 'none';
      prompt.style.display = 'block';
    }
  }
}

let commentManager = null;

document.addEventListener('DOMContentLoaded', () => {
  const articleElement = document.querySelector('article[data-article-id]');
  if (articleElement) {
    const articleId = articleElement.dataset.articleId;
    commentManager = new CommentManager(articleId);
    commentManager.checkLoginStatus();
    commentManager.loadComments();
    
    // 初始化主评论输入框字数统计
    const mainTextarea = document.getElementById('main-comment-content');
    const mainCharCount = document.getElementById('main-char-count');
    const mainSubmitBtn = document.getElementById('submit-main-comment');
    
    if (mainTextarea && mainCharCount && mainSubmitBtn) {
      mainTextarea.addEventListener('input', function() {
        const length = this.value.length;
        mainCharCount.textContent = `${length}/1000`;
        mainSubmitBtn.disabled = length === 0;
      });
    }
    
    // 主评论提交
    if (mainSubmitBtn) {
      mainSubmitBtn.addEventListener('click', () => {
        commentManager.submitMainComment();
      });
    }
    
    // 表情按钮点击提示
    document.querySelectorAll('.emoji-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        showToast('表情功能开发中...', 'info');
      });
    });
  }
});
