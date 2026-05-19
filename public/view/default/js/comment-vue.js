// 默认头像 (data URI，避免文件加载问题)
const DEFAULT_AVATAR = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="#e8eaed"/><circle cx="40" cy="30" r="12" fill="#9aa0a6"/><path d="M16 68c0-13.255 10.745-24 24-24s24 10.745 24 24" fill="#9aa0a6"/></svg>');

// Vue 3 评论组件模板
const commentTemplate = `
    <section class="comment-section" id="comments">
        <!-- 评论头部 -->
        <div class="comment-section-header">
            <h2>评论 <span class="comment-count">{{ totalCount }}</span></h2>
        </div>

        <!-- 主评论输入框 -->
        <div class="main-comment-form">
            <div class="comment-input-wrapper">
                <div class="comment-input-hint">平等表达，友善交流</div>
                <div class="anonymous-info" v-if="!isLoggedIn" style="margin-bottom:10px;display:flex;gap:10px;">
                    <input type="text" v-model="anonymousNickname" placeholder="昵称（选填）" maxlength="20" style="flex:1;padding:8px 12px;border:1px solid #e4e7ed;border-radius:4px;font-size:14px;outline:none;" />
                    <input type="email" v-model="anonymousEmail" placeholder="邮箱（选填）" maxlength="50" style="flex:1;padding:8px 12px;border:1px solid #e4e7ed;border-radius:4px;font-size:14px;outline:none;" />
                </div>
                <textarea 
                    ref="mainTextarea"
                    v-model="mainCommentContent"
                    placeholder="输入评论..." 
                    maxlength="1000"
                    rows="3"
                ></textarea>
                <div class="comment-input-toolbar">
                    <div class="comment-input-tools">
                        <button type="button" class="tool-btn emoji-btn" title="表情" @click="toggleEmojiPicker('main')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                                <line x1="9" y1="9" x2="9.01" y2="9"/>
                                <line x1="15" y1="9" x2="15.01" y2="9"/>
                            </svg>
                        </button>
                        <!-- 表情选择器 -->
                        <div class="emoji-picker" v-if="emojiPickerVisible === 'main'">
                            <div class="emoji-picker-header">
                                <span>常用表情</span>
                            </div>
                            <div class="emoji-list">
                                <div 
                                    v-for="emoji in emojiList" 
                                    :key="emoji.name"
                                    class="emoji-item"
                                    @click="insertEmoji('main', emoji)"
                                    :data-title="emoji.name"
                                >
                                    <img :src="emoji.url" :alt="emoji.name">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="comment-input-submit">
                        <span class="char-count">{{ mainCommentContent.length }}/1000</span>
                        <button 
                            class="submit-btn" 
                            :disabled="!mainCommentContent.trim()"
                            @click="submitMainComment"
                        >发送</button>
                    </div>
                </div>
            </div>
        </div>



        <!-- 评论列表 -->
        <div class="comment-list">
            <div class="comment-empty" v-if="loading && comments.length === 0">加载评论中...</div>
            <div class="comment-empty" v-else-if="!loading && comments.length === 0">暂无评论，快来抢沙发吧~</div>
            
            <!-- 主评论 -->
            <div 
                class="comment-item" 
                v-for="(comment, commentIndex) in displayedComments" 
                :key="comment.id"
                :data-id="comment.id"
            >
                <div class="comment-main">
                    <div class="comment-avatar">
                        <img :src="comment.avatar || defaultAvatar" :alt="comment.nickname" @error="handleAvatarError($event)">
                    </div>
                    <div class="comment-info">
                        <div class="comment-header">
                            <span class="comment-nickname">{{ comment.nickname || comment.username || '匿名用户' }}</span>
                            <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
                        </div>
                        <div class="comment-body" v-html="renderContent(comment.content)"></div>
                        <div class="comment-actions">
                            <button 
                                class="comment-like" 
                                :class="{ liked: comment.is_liked }"
                                @click="likeComment(comment)"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                                </svg>
                                <span class="comment-like-count" v-if="comment.like_count">{{ comment.like_count }}</span>
                            </button>
                            <button 
                                class="comment-reply" 
                                @click="showReplyBox(comment.id, comment.nickname || comment.username)"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                                </svg>
                                <span>回复</span>
                            </button>
                        </div>

                        <!-- 回复框 -->
                        <div class="reply-box-container" v-if="replyBoxVisible[comment.id]">
                            <div class="reply-box">
                                <div class="reply-to">回复 {{ replyBoxTarget[comment.id] }}...</div>
                                <textarea 
                                    :ref="'replyTextarea_' + comment.id"
                                    v-model="replyContent[comment.id]"
                                    placeholder="输入回复内容..." 
                                    maxlength="500"
                                ></textarea>
                                <div class="reply-toolbar">
                                    <div class="reply-tools">
                                        <button type="button" class="emoji-btn" title="表情" @click="toggleEmojiPicker('reply_' + comment.id)">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <circle cx="12" cy="12" r="10"/>
                                                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                                                <line x1="9" y1="9" x2="9.01" y2="9"/>
                                                <line x1="15" y1="9" x2="15.01" y2="9"/>
                                            </svg>
                                        </button>
                                        <!-- 表情选择器 -->
                                        <div class="emoji-picker" v-if="emojiPickerVisible === 'reply_' + comment.id">
                                            <div class="emoji-picker-header">
                                                <span>常用表情</span>
                                            </div>
                                            <div class="emoji-list">
                                                <div 
                                                    v-for="emoji in emojiList" 
                                                    :key="emoji.name"
                                                    class="emoji-item"
                                                    @click="insertEmoji('reply_' + comment.id, emoji)"
                                                    :data-title="emoji.name"
                                                >
                                                    <img :src="emoji.url" :alt="emoji.name">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="reply-submit-area">
                                        <span class="char-count">{{ (replyContent[comment.id] || '').length }}/500</span>
                                        <button class="btn-cancel" @click="hideReplyBox(comment.id)">取消</button>
                                        <button 
                                            class="btn-submit" 
                                            :disabled="!(replyContent[comment.id] || '').trim()"
                                            @click="submitReply(comment)"
                                        >回复</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 回复列表 -->
                        <div class="comment-replies" v-if="comment.replies && comment.replies.length">
                            <div 
                                class="comment-reply-item" 
                                v-for="reply in getDisplayedReplies(comment)" 
                                :key="reply.id"
                                :data-id="reply.id"
                            >
                                <div class="comment-reply-body">
                                    <template v-if="reply.reply_to_username">
                                        {{ reply.nickname || reply.username }} <span class="reply-to">@{{ reply.reply_to_username }}</span>：<span v-html="renderContent(reply.content)"></span>
                                    </template>
                                    <template v-else>
                                        {{ reply.nickname || reply.username }}：<span v-html="renderContent(reply.content)"></span>
                                    </template>
                                </div>
                                <div class="comment-reply-actions">
                                    <span class="comment-time">{{ formatTime(reply.createdAt) }}</span>
                                    <button 
                                        class="comment-like" 
                                        :class="{ liked: reply.is_liked }"
                                        @click="likeComment(reply)"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                                        </svg>
                                        <span class="comment-like-count" v-if="reply.like_count">{{ reply.like_count }}</span>
                                    </button>
                                    <button 
                                        class="comment-reply-btn" 
                                        @click="showReplyBox(reply.id, reply.nickname || reply.username)"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                                        </svg>
                                        <span>回复</span>
                                    </button>
                                </div>

                                <!-- 回复框 -->
                                <div class="reply-box-container" v-if="replyBoxVisible[reply.id]">
                                    <div class="reply-box">
                                        <div class="reply-to">回复 {{ replyBoxTarget[reply.id] }}...</div>
                                        <textarea 
                                            :ref="'replyTextarea_' + reply.id"
                                            v-model="replyContent[reply.id]"
                                            placeholder="输入回复内容..." 
                                            maxlength="500"
                                        ></textarea>
                                        <div class="reply-toolbar">
                                            <div class="reply-tools">
                                                <button type="button" class="emoji-btn" title="表情" @click="toggleEmojiPicker('reply_' + reply.id)">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                                                        <line x1="9" y1="9" x2="9.01" y2="9"/>
                                                        <line x1="15" y1="9" x2="15.01" y2="9"/>
                                                    </svg>
                                                </button>
                                                <!-- 表情选择器 -->
                                                <div class="emoji-picker" v-if="emojiPickerVisible === 'reply_' + reply.id">
                                                    <div class="emoji-picker-header">
                                                        <span>常用表情</span>
                                                    </div>
                                                    <div class="emoji-list">
                                                        <div 
                                                            v-for="emoji in emojiList" 
                                                            :key="emoji.name"
                                                            class="emoji-item"
                                                            @click="insertEmoji('reply_' + reply.id, emoji)"
                                                            :data-title="emoji.name"
                                                        >
                                                            <img :src="emoji.url" :alt="emoji.name">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="reply-submit-area">
                                                <span class="char-count">{{ (replyContent[reply.id] || '').length }}/500</span>
                                                <button class="btn-cancel" @click="hideReplyBox(reply.id)">取消</button>
                                                <button 
                                                    class="btn-submit" 
                                                    :disabled="!(replyContent[reply.id] || '').trim()"
                                                    @click="submitReply(reply, comment.id)"
                                                >回复</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 查看全部回复按钮 -->
                            <div 
                                class="view-all-replies" 
                                v-if="shouldShowViewAllReplies(comment)"
                                @click.prevent="toggleShowAllReplies(comment.id)"
                            >
                                <span>查看全部 {{ comment.replies.length }} 条回复</span>
                                <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="6 9 12 15 18 9"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 查看全部评论按钮 -->
            <div 
                class="view-all-comments" 
                v-if="shouldShowViewAllComments"
                @click.prevent="toggleShowAllComments"
            >
                <span>查看全部 {{ comments.length }} 条评论</span>
                <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </div>
        </div>

        <!-- 分页 - 只有在展开全部后才显示加载更多 -->
        <div class="comment-pagination" v-if="showAllComments && hasMore">
            <button class="load-more-btn" @click.prevent="loadMore" :disabled="loadingMore">
                {{ loadingMore ? '加载中...' : '加载更多' }}
            </button>
        </div>
    </section>
`;

const { createApp, ref, reactive, computed, onMounted, nextTick } = Vue;

// 获取 cookie
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

// Toast 提示
function showToast(message, type = 'info', duration = 2000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

createApp({
    template: commentTemplate,
    setup() {
        // 文章 ID
        const articleId = ref(null);
        
        // 登录状态 - 只在初始化时检查一次
        const isLoggedIn = ref(false);
        
        // 默认头像
        const defaultAvatar = DEFAULT_AVATAR;
        function handleAvatarError(event) {
            if (event.target.src !== DEFAULT_AVATAR) {
                event.target.src = DEFAULT_AVATAR;
            }
        }
        
        // 评论数据
        const comments = ref([]);
        const totalCount = ref(0);
        const loading = ref(false);
        const loadingMore = ref(false);
        const currentPage = ref(1);
        const pageSize = 10;
        const hasMore = ref(false);
        
        // 主评论输入
        const mainCommentContent = ref('');
        const mainTextarea = ref(null);
        const anonymousNickname = ref('');
        const anonymousEmail = ref('');
        
        // 回复相关
        const replyBoxVisible = reactive({});
        const replyBoxTarget = reactive({});
        const replyContent = reactive({});
        const replyToId = reactive({});
        const replyTargetDom = reactive({});
        
        // 展开/收起状态
        const showAllComments = ref(false);
        const showAllReplies = reactive({});
        
        // 表情选择器
        const emojiPickerVisible = ref(null);
        
        // Emoji 列表
        const emojiList = [
            { name: '微笑', url: '/emoji/emoji_1.png' },
            { name: '开心', url: '/emoji/emoji_2.png' },
            { name: '色', url: '/emoji/emoji_3.png' },
            { name: '发呆', url: '/emoji/emoji_4.png' },
            { name: '可怜', url: '/emoji/emoji_5.png' },
            { name: '流泪', url: '/emoji/emoji_6.png' },
            { name: '害羞', url: '/emoji/emoji_7.png' },
            { name: '闭嘴', url: '/emoji/emoji_8.png' },
            { name: '睡', url: '/emoji/emoji_9.png' },

            { name: '吃瓜', url: '/emoji/emoji_10.png' },
            { name: '尴尬', url: '/emoji/emoji_11.png' },
            { name: '发怒', url: '/emoji/emoji_12.png' },
            { name: '调皮', url: '/emoji/emoji_13.png' },
            { name: '瘪嘴', url: '/emoji/emoji_14.png' },
            { name: '思考', url: '/emoji/emoji_15.png' },
            { name: '不失礼貌的微笑', url: '/emoji/emoji_16.png' },
            { name: '奸笑', url: '/emoji/emoji_17.png' },
            { name: '抓狂', url: '/emoji/emoji_18.png' },
           
            { name: '吐', url: '/emoji/emoji_19.png' },
            { name: '偷笑', url: '/emoji/emoji_20.png' },
            { name: '愉快', url: '/emoji/emoji_21.png' },
            { name: '白眼', url: '/emoji/emoji_22.png' },
            { name: '傲慢', url: '/emoji/emoji_23.png' },
            { name: '困', url: '/emoji/emoji_24.png' },
            { name: '灵光一现', url: '/emoji/emoji_25.png' },
            { name: '流汗', url: '/emoji/emoji_26.png' },
            { name: '憨笑', url: '/emoji/emoji_27.png' },
          
            { name: '捂脸', url: '/emoji/emoji_28.png' },
            { name: '奋斗', url: '/emoji/emoji_29.png' },
            { name: '咒骂', url: '/emoji/emoji_30.png' },
            { name: '疑问', url: '/emoji/emoji_31.png' },
            { name: '嘘', url: '/emoji/emoji_32.png' },
            { name: '晕', url: '/emoji/emoji_33.png' },
            { name: '哀', url: '/emoji/emoji_34.png' },
            { name: '骷髅', url: '/emoji/emoji_35.png' },
            { name: '敲打', url: '/emoji/emoji_36.png' },
            
            { name: '再见', url: '/emoji/emoji_37.png' },
            { name: '擦汗', url: '/emoji/emoji_38.png' },
            { name: '抠鼻', url: '/emoji/emoji_39.png' },
            { name: '泣不成声', url: '/emoji/emoji_40.png' },
            { name: '坏笑', url: '/emoji/emoji_41.png' },
            { name: '左哼哼', url: '/emoji/emoji_42.png' },
            { name: '右哼哼', url: '/emoji/emoji_43.png' },
            { name: '打哈欠', url: '/emoji/emoji_44.png' },
            { name: '鄙视', url: '/emoji/emoji_45.png' },
            
            { name: '委屈', url: '/emoji/emoji_46.png' },
            { name: '快哭了', url: '/emoji/emoji_47.png' },
            { name: '摸头', url: '/emoji/emoji_48.png' },
            { name: '阴险', url: '/emoji/emoji_49.png' },
            { name: '亲亲', url: '/emoji/emoji_50.png' },
            { name: '机智', url: '/emoji/emoji_51.png' },
            { name: '得意', url: '/emoji/emoji_52.png' },
            { name: '大金牙', url: '/emoji/emoji_53.png' },
            { name: '拥抱', url: '/emoji/emoji_54.png' },
           
            { name: '大笑', url: '/emoji/emoji_55.png' },
            { name: '送心', url: '/emoji/emoji_56.png' },
            { name: '震惊', url: '/emoji/emoji_57.png' },
            { name: '酷拽', url: '/emoji/emoji_58.png' },
            { name: '尬笑', url: '/emoji/emoji_59.png' },
            { name: '大哭', url: '/emoji/emoji_60.png' },
            { name: '苦笑', url: '/emoji/emoji_61.png' },
            { name: '做鬼脸', url: '/emoji/emoji_62.png' },
            { name: '红脸', url: '/emoji/emoji_63.png' },
            
            { name: '鼓掌', url: '/emoji/emoji_64.png' },
            { name: '恐惧', url: '/emoji/emoji_65.png' },
            { name: '斜眼', url: '/emoji/emoji_66.png' },
            { name: '嘿哈', url: '/emoji/emoji_67.png' },
            { name: '惊讶', url: '/emoji/emoji_68.png' },
            { name: '绝望的凝视', url: '/emoji/emoji_69.png' },
            { name: '囧', url: '/emoji/emoji_70.png' },
            { name: '皱眉', url: '/emoji/emoji_71.png' },
            { name: '耶', url: '/emoji/emoji_72.png' },
            
            { name: '石化', url: '/emoji/emoji_73.png' },
            { name: '我想静静', url: '/emoji/emoji_74.png' },
            { name: '吐血', url: '/emoji/emoji_75.png' },
            { name: '互粉', url: '/emoji/emoji_76.png' },
            { name: '互相关注', url: '/emoji/emoji_77.png' },
            { name: '加好友', url: '/emoji/emoji_78.png' },
            { name: '强', url: '/emoji/emoji_79.png' },
            { name: '钱', url: '/emoji/emoji_80.png' },
            { name: '飞吻', url: '/emoji/emoji_81.png' },
            
            { name: '打脸', url: '/emoji/emoji_82.png' },
            { name: '惊恐', url: '/emoji/emoji_83.png' },
            { name: '悠闲', url: '/emoji/emoji_84.png' },
            { name: '泪奔', url: '/emoji/emoji_85.png' },
            { name: '舔屏', url: '/emoji/emoji_86.png' },
            { name: '紫薇别走', url: '/emoji/emoji_87.png' },
            { name: '听歌', url: '/emoji/emoji_88.png' },
            { name: '难过', url: '/emoji/emoji_89.png' },
            { name: '生病', url: '/emoji/emoji_90.png' },
            
            { name: '绿帽子', url: '/emoji/emoji_91.png' },
            { name: '如花', url: '/emoji/emoji_92.png' },
            { name: '惊喜', url: '/emoji/emoji_93.png' },
            { name: '吐彩虹', url: '/emoji/emoji_94.png' },
            { name: '吐舌', url: '/emoji/emoji_95.png' },
            { name: '无辜呆', url: '/emoji/emoji_96.png' },
            { name: '看', url: '/emoji/emoji_97.png' },
            { name: '白眼的狗', url: '/emoji/emoji_98.png' },
            { name: '黑脸', url: '/emoji/emoji_99.png' },
            
            { name: '猪头', url: '/emoji/emoji_100.png' },
            { name: '熊吉', url: '/emoji/emoji_101.png' },
            { name: '不看', url: '/emoji/emoji_102.png' },
            { name: '玫瑰', url: '/emoji/emoji_103.png' },
            { name: '凋谢', url: '/emoji/emoji_104.png' },
            { name: '嘴唇', url: '/emoji/emoji_105.png' },
            { name: '爱心', url: '/emoji/emoji_106.png' },
            { name: '心碎', url: '/emoji/emoji_107.png' },
            { name: '赞', url: '/emoji/emoji_108.png' },
            
            { name: '弱', url: '/emoji/emoji_109.png' },
            { name: '握手', url: '/emoji/emoji_110.png' },
            { name: 'ok', url: '/emoji/emoji_111.png' },
            { name: '谢谢', url: '/emoji/emoji_112.png' },
            { name: '比心', url: '/emoji/emoji_113.png' },
            { name: '碰拳', url: '/emoji/emoji_114.png' },
            { name: '击掌', url: '/emoji/emoji_115.png' },
            { name: '左', url: '/emoji/emoji_116.png' },
            { name: '右', url: '/emoji/emoji_117.png' },
           
            { name: '力量', url: '/emoji/emoji_118.png' },
            { name: '胜利', url: '/emoji/emoji_119.png' },
            { name: '抱拳', url: '/emoji/emoji_120.png' },
            { name: '勾引', url: '/emoji/emoji_121.png' },
            { name: '拳头', url: '/emoji/emoji_122.png' },
            { name: '庆祝', url: '/emoji/emoji_123.png' },
            { name: '礼物', url: '/emoji/emoji_124.png' },
            { name: '红包', url: '/emoji/emoji_125.png' },
            { name: '18禁', url: '/emoji/emoji_126.png' },
           
            { name: '去污粉', url: '/emoji/emoji_127.png' },
            { name: '666', url: '/emoji/emoji_128.png' },
            { name: '给力', url: '/emoji/emoji_129.png' },
            { name: 'v5', url: '/emoji/emoji_130.png' },
            { name: '菜刀', url: '/emoji/emoji_131.png' },
            { name: '炸弹', url: '/emoji/emoji_132.png' },
            { name: '便便', url: '/emoji/emoji_133.png' },
            { name: '月亮', url: '/emoji/emoji_134.png' },
            { name: '太阳', url: '/emoji/emoji_135.png' },
            { name: '发', url: '/emoji/emoji_136.png' },
            { name: '黄瓜', url: '/emoji/emoji_137.png' },
            { name: '西瓜', url: '/emoji/emoji_138.png' },
            { name: '啤酒', url: '/emoji/emoji_139.png' },
            { name: '咖啡', url: '/emoji/emoji_140.png' },
            { name: '蛋糕', url: '/emoji/emoji_141.png' }
        ];
        
        // 常量
        const MAX_DISPLAY_COMMENTS = 3;
        const MAX_DISPLAY_REPLIES = 2;
        
        // 计算显示的评论
        const displayedComments = computed(() => {
            if (showAllComments.value || comments.value.length <= MAX_DISPLAY_COMMENTS) {
                return comments.value;
            }
            return comments.value.slice(0, MAX_DISPLAY_COMMENTS);
        });
        
        // 是否显示"查看全部评论"
        const shouldShowViewAllComments = computed(() => {
            return comments.value.length > MAX_DISPLAY_COMMENTS && !showAllComments.value;
        });
        
        // 是否显示"查看全部回复"
        function shouldShowViewAllReplies(comment) {
            return comment.replies && comment.replies.length > MAX_DISPLAY_REPLIES && !showAllReplies[comment.id];
        }
        
        // 获取显示的回复
        function getDisplayedReplies(comment) {
            if (showAllReplies[comment.id] || !comment.replies || comment.replies.length <= MAX_DISPLAY_REPLIES) {
                return comment.replies || [];
            }
            return comment.replies.slice(0, MAX_DISPLAY_REPLIES);
        }
        
        // 切换显示全部评论
        function toggleShowAllComments() {
            showAllComments.value = !showAllComments.value;
        }
        
        // 切换显示全部回复
        function toggleShowAllReplies(commentId) {
            showAllReplies[commentId] = !showAllReplies[commentId];
        }
        
        // 切换表情选择器
        function toggleEmojiPicker(target) {
            if (emojiPickerVisible.value === target) {
                emojiPickerVisible.value = null;
            } else {
                emojiPickerVisible.value = target;
            }
        }
        
        // 插入表情
        function insertEmoji(target, emoji) {
            let textarea;
            let contentRef;
            
            if (target === 'main') {
                textarea = mainTextarea.value;
                contentRef = mainCommentContent;
            } else {
                const replyId = target.replace('reply_', '');
                textarea = document.querySelector(`[data-id="${replyId}"] textarea`);
                contentRef = { value: replyContent[replyId] };
            }
            
            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const text = target === 'main' ? mainCommentContent.value : replyContent[target.replace('reply_', '')];
                const before = text.substring(0, start);
                const after = text.substring(end);
                const emojiText = `[${emoji.name}]`;
                
                if (target === 'main') {
                    mainCommentContent.value = before + emojiText + after;
                } else {
                    const replyId = target.replace('reply_', '');
                    replyContent[replyId] = before + emojiText + after;
                }
                
                nextTick(() => {
                    textarea.focus();
                    const newCursorPos = start + emojiText.length;
                    textarea.setSelectionRange(newCursorPos, newCursorPos);
                });
            }
            
            emojiPickerVisible.value = null;
        }
        
        // 点击外部关闭表情选择器
        function handleClickOutside(event) {
            if (!event.target.closest('.emoji-picker') && !event.target.closest('.emoji-btn')) {
                emojiPickerVisible.value = null;
            }
        }
        
        // 格式化时间
        function formatTime(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            const now = new Date();
            const diff = Math.floor((now - date) / 1000);
            
            if (diff < 60) return '刚刚';
            if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
            if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
            if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`;
            
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        }
        
        // 渲染内容，将表情文字转换为图片
        function renderContent(content) {
            if (!content) return '';
            let result = content;
            emojiList.forEach(emoji => {
                const regex = new RegExp(`\\[${emoji.name}\\]`, 'g');
                result = result.replace(regex, `<img src="${emoji.url}" alt="${emoji.name}" class="emoji-in-text">`);
            });
            return result;
        }
        
        // 平铺回复列表
        function flattenReplies(replies) {
            const result = [];
            function flatten(items) {
                items.forEach(item => {
                    result.push(item);
                    if (item.replies && item.replies.length) {
                        flatten(item.replies);
                    }
                });
            }
            flatten(replies);
            return result;
        }
        
        // 加载评论
        async function loadComments(page = 1, append = false) {
            if (loading.value) return;
            
            loading.value = true;
            try {
                const response = await fetch(`/member/v1/articleComments?articleId=${articleId.value}&page=${page}&pageSize=${pageSize}`, {
                    credentials: 'include'
                });
                const result = await response.json();
                
                if (result.success) {
                    const list = result.data?.list || [];
                    totalCount.value = result.data?.total || 0;
                    
                    if (append) {
                        comments.value.push(...list);
                    } else {
                        comments.value = list;
                    }
                    
                    currentPage.value = page;
                    hasMore.value = comments.value.length < totalCount.value;
                }
            } catch (error) {
                console.error('加载评论失败:', error);
            } finally {
                loading.value = false;
                loadingMore.value = false;
            }
        }
        
        // 加载更多
        async function loadMore() {
            if (loading.value || loadingMore.value) return;
            await loadComments(currentPage.value + 1, true);
        }
        
        // 提交主评论
        async function submitMainComment() {
            const content = mainCommentContent.value.trim();
            if (!content) {
                showToast('请输入评论内容', 'info');
                return;
            }
            
            try {
                const body = {
                    articleId: articleId.value,
                    content: content,
                    parentId: null,
                    replyToMemberId: null,
                    replyToUsername: null
                };
                
                // 未登录时使用匿名评论接口
                let url = '/member/v1/comment';
                if (!isLoggedIn.value) {
                    url = '/member/v1/commentAnonymous';
                    body.nickname = anonymousNickname.value.trim() || '匿名用户';
                    body.email = anonymousEmail.value.trim() || '';
                }
                
                const response = await fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    mainCommentContent.value = '';
                    totalCount.value++;
                    if (result.data) {
                        comments.value.unshift(result.data);
                    }
                    showToast('评论成功', 'success');
                } else {
                    showToast(result.msg || '评论失败', 'error');
                }
            } catch (error) {
                console.error('评论失败:', error);
                showToast('评论失败，请稍后重试', 'error');
            }
        }
        
        // 显示回复框
        function showReplyBox(commentId, username, replyToUsername = null) {
            // 关闭其他回复框
            Object.keys(replyBoxVisible).forEach(key => {
                replyBoxVisible[key] = false;
            });
            
            replyBoxVisible[commentId] = true;
            replyBoxTarget[commentId] = username;
            replyContent[commentId] = '';
            replyToId[commentId] = commentId;
        }
        
        // 隐藏回复框
        function hideReplyBox(commentId) {
            replyBoxVisible[commentId] = false;
            replyContent[commentId] = '';
        }
        
        // 提交回复
        async function submitReply(reply, parentCommentId = null) {
            const commentId = reply.id;
            const content = (replyContent[commentId] || '').trim();
            
            if (!content) {
                showToast('请输入回复内容', 'info');
                return;
            }
            
            try {
                const body = {
                    articleId: articleId.value,
                    content: content,
                    parentId: parentCommentId || commentId,
                    replyToMemberId: reply.member_id,
                    replyToUsername: reply.nickname || reply.username
                };
                
                let url = '/member/v1/comment';
                if (!isLoggedIn.value) {
                    url = '/member/v1/commentAnonymous';
                    body.nickname = anonymousNickname.value.trim() || '匿名用户';
                    body.email = anonymousEmail.value.trim() || '';
                }
                
                const response = await fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    hideReplyBox(commentId);
                    totalCount.value++;
                    if (result.data) {
                        const targetId = parentCommentId || commentId;
                        const parentComment = comments.value.find(c => c.id === targetId);
                        
                        if (parentComment) {
                            if (!parentComment.replies) {
                                parentComment.replies = [];
                            }
                            
                            // 如果是回复某个回复，在对应回复后面插入
                            if (result.data.reply_to_member_id) {
                                const targetIndex = parentComment.replies.findIndex(r => r.id === commentId);
                                if (targetIndex !== -1) {
                                    parentComment.replies.splice(targetIndex + 1, 0, result.data);
                                } else {
                                    parentComment.replies.push(result.data);
                                }
                            } else {
                                parentComment.replies.push(result.data);
                            }
                        }
                    }
                    showToast('回复成功', 'success');
                } else {
                    showToast(result.msg || '回复失败', 'error');
                }
            } catch (error) {
                console.error('回复失败:', error);
                showToast('回复失败，请稍后重试', 'error');
            }
        }
        
        // 点赞
        async function likeComment(comment) {
            try {
                const response = await fetch('/member/v1/likeComment', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: comment.id })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    comment.is_liked = result.data.isLiked;
                    comment.like_count = result.data.likeCount;
                }
            } catch (error) {
                console.error('点赞失败:', error);
            }
        }
        
        // 表情提示
        function showEmojiHint() {
            showToast('表情功能开发中...', 'info');
        }
        
        // 初始化
        onMounted(() => {
            // 检查登录状态（只检查一次）
            isLoggedIn.value = getCookie('ut') !== null;
            
            const articleElement = document.querySelector('article[data-article-id]');
            if (articleElement) {
                articleId.value = articleElement.dataset.articleId;
                loadComments(1, false);
            }
            
            // 点击外部关闭表情选择器
            document.addEventListener('click', handleClickOutside);
        });
        
        return {
            isLoggedIn,
            defaultAvatar,
            handleAvatarError,
            comments,
            displayedComments,
            totalCount,
            loading,
            loadingMore,
            hasMore,
            mainCommentContent,
            mainTextarea,
            anonymousNickname,
            anonymousEmail,
            replyBoxVisible,
            replyBoxTarget,
            replyContent,
            showAllComments,
            showAllReplies,
            emojiPickerVisible,
            emojiList,
            shouldShowViewAllComments,
            shouldShowViewAllReplies,
            getDisplayedReplies,
            toggleShowAllComments,
            toggleShowAllReplies,
            toggleEmojiPicker,
            insertEmoji,
            formatTime,
            renderContent,
            flattenReplies,
            loadMore,
            submitMainComment,
            showReplyBox,
            hideReplyBox,
            submitReply,
            likeComment,
            showEmojiHint
        };
    }
}).mount('#comment-app');
