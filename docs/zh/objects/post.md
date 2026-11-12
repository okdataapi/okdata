# Post

> 视频、笔记、推文或文章，所有平台同一种结构。

网页版：https://okdata.online/zh/docs/objects/post/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 内容在平台上的 ID。 |
| `url` | string | 内容链接。 |
| `type` | string | 内容类型。 |
| `title` | string \| null | 标题（视频、笔记、文章才有）。 |
| `text` | string | 文案、正文或简介，纯文本；文章为 Markdown。 |
| `lang` | string \| null | 语言代码，平台给出或检测得到。 |
| `published_at` | string \| null | 发布时间，ISO 8601，UTC；只有数据源不给时间时为 null（wechat_mp.articles.metrics、wechat_channels.videos.metrics、youtube.channels.videos.list 取 Shorts 时），并列在 meta.unavailable 里。 |
| `author` | AccountRef | 发布者。 |
| `metrics` | Metrics | 抓取时的数据；平台不公开的为 null。 |
| `images` | string[] \| null | 图文内容的图片地址。 |
| `hashtags` | string[] \| null | 话题标签，不带 #。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### AccountRef

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 平台上的账号 ID。 |
| `username` | string \| null | 用户名（平台有的话）。 |
| `name` | string \| null | 昵称。 |
| `avatar_url` | string \| null | 头像图片地址。 |
| `followers` | integer \| null | 抓取时的粉丝数。 |
| `verified` | boolean \| null | 平台是否显示认证标识。 |

### Metrics

| 字段 | 类型 | 说明 |
|---|---|---|
| `views` | integer \| null | 播放或阅读数。 |
| `likes` | integer \| null | 点赞数。 |
| `comments` | integer \| null | 评论数。 |
| `shares` | integer \| null | 分享数。 |
| `favorites` | integer \| null | 收藏数。 |
| `reposts` | integer \| null | 转发数。 |

## 返回 Post 的接口

- [抖音视频搜索](https://okdata.online/zh/apis/douyin/videos/search/) (`douyin.videos.search`): $0.02/次 · 每页约 20 条视频
- [抖音视频详情](https://okdata.online/zh/apis/douyin/videos/get/) (`douyin.videos.get`): $0.002/次
- [抖音账号作品列表](https://okdata.online/zh/apis/douyin/users/videos/list/) (`douyin.users.videos.list`): $0.002/次 · 每页约 20 条视频
- [小红书笔记搜索](https://okdata.online/zh/apis/xiaohongshu/notes/search/) (`xiaohongshu.notes.search`): $0.02/次 · 每页约 20 篇笔记
- [小红书笔记详情](https://okdata.online/zh/apis/xiaohongshu/notes/get/) (`xiaohongshu.notes.get`): $0.02/次
- [小红书博主笔记列表](https://okdata.online/zh/apis/xiaohongshu/users/notes/list/) (`xiaohongshu.users.notes.list`): $0.02/次 · 每页约 20 篇笔记
- [公众号历史文章](https://okdata.online/zh/apis/wechat_mp/accounts/articles/list/) (`wechat_mp.accounts.articles.list`): $0.02/次 · 每页约 10 篇文章
- [公众号文章详情](https://okdata.online/zh/apis/wechat_mp/articles/get/) (`wechat_mp.articles.get`): $0.02/次
- [B站视频搜索](https://okdata.online/zh/apis/bilibili/videos/search/) (`bilibili.videos.search`): $0.002/次 · 每页约 20 条视频
- [B站视频详情](https://okdata.online/zh/apis/bilibili/videos/get/) (`bilibili.videos.get`): $0.002/次
- [微博搜索](https://okdata.online/zh/apis/weibo/posts/search/) (`weibo.posts.search`): $0.002/次 · 每页约 10 条帖子
- [TikTok 视频搜索](https://okdata.online/zh/apis/tiktok/videos/search/) (`tiktok.videos.search`): $0.002/次 · 每页约 30 条视频
- [TikTok 视频详情](https://okdata.online/zh/apis/tiktok/videos/get/) (`tiktok.videos.get`): $0.002/次
- [X 帖子详情](https://okdata.online/zh/apis/x/posts/get/) (`x.posts.get`): $0.0003/次
- [X 帖子搜索](https://okdata.online/zh/apis/x/posts/search/) (`x.posts.search`): $0.002/次 · 每页约 20 条帖子
- [X 账号帖子列表](https://okdata.online/zh/apis/x/users/posts/list/) (`x.users.posts.list`): $0.002/次 · 每页约 20 条帖子
- [YouTube 视频搜索](https://okdata.online/zh/apis/youtube/videos/search/) (`youtube.videos.search`): $0.004/次 · 每页约 20 条视频
- [YouTube 视频详情](https://okdata.online/zh/apis/youtube/videos/get/) (`youtube.videos.get`): $0.002/次
- [Instagram 账号帖子](https://okdata.online/zh/apis/instagram/users/posts/list/) (`instagram.users.posts.list`): $0.004/次 · 每页约 12 条帖子
- [Instagram 帖子详情](https://okdata.online/zh/apis/instagram/posts/get/) (`instagram.posts.get`): $0.004/次
- [Instagram 话题帖子](https://okdata.online/zh/apis/instagram/hashtags/posts/list/) (`instagram.hashtags.posts.list`): $0.004/次 · 每页约 10 条帖子
- [Reddit 帖子搜索](https://okdata.online/zh/apis/reddit/posts/search/) (`reddit.posts.search`): $0.004/次 · 每页约 25 条帖子
- [Reddit 帖子详情](https://okdata.online/zh/apis/reddit/posts/get/) (`reddit.posts.get`): $0.002/次
- [Reddit 热门帖子](https://okdata.online/zh/apis/reddit/popular/posts/list/) (`reddit.popular.posts.list`): $0.002/次 · 每页约 10 条帖子
- [Reddit 社区帖子](https://okdata.online/zh/apis/reddit/subreddits/posts/list/) (`reddit.subreddits.posts.list`): $0.004/次 · 每页约 25 条帖子
- [Reddit 用户帖子](https://okdata.online/zh/apis/reddit/users/posts/list/) (`reddit.users.posts.list`): $0.002/次 · 每页约 25 条帖子
- [快手视频搜索](https://okdata.online/zh/apis/kuaishou/videos/search/) (`kuaishou.videos.search`): $0.02/次 · 每页约 10 条视频
- [快手作品详情](https://okdata.online/zh/apis/kuaishou/videos/get/) (`kuaishou.videos.get`): $0.002/次
- [快手账号作品](https://okdata.online/zh/apis/kuaishou/users/videos/list/) (`kuaishou.users.videos.list`): $0.02/次 · 每页约 20 条视频
- [知乎内容搜索](https://okdata.online/zh/apis/zhihu/posts/search/) (`zhihu.posts.search`): $0.002/次 · 每页约 20 条帖子
- [知乎问题回答](https://okdata.online/zh/apis/zhihu/questions/answers/list/) (`zhihu.questions.answers.list`): $0.002/次 · 每页约 20 条帖子
- [知乎问题详情](https://okdata.online/zh/apis/zhihu/questions/get/) (`zhihu.questions.get`): $0.002/次
- [知乎回答详情](https://okdata.online/zh/apis/zhihu/answers/get/) (`zhihu.answers.get`): $0.002/次
- [知乎文章详情](https://okdata.online/zh/apis/zhihu/articles/get/) (`zhihu.articles.get`): $0.002/次
- [知乎专栏文章列表](https://okdata.online/zh/apis/zhihu/columns/articles/list/) (`zhihu.columns.articles.list`): $0.002/次 · 每页约 20 篇文章
- [知乎想法详情](https://okdata.online/zh/apis/zhihu/pins/get/) (`zhihu.pins.get`): $0.002/次
- [知乎用户回答](https://okdata.online/zh/apis/zhihu/users/answers/list/) (`zhihu.users.answers.list`): $0.002/次 · 每页约 20 条帖子
- [知乎用户文章](https://okdata.online/zh/apis/zhihu/users/articles/list/) (`zhihu.users.articles.list`): $0.002/次 · 每页约 20 篇文章
- [知乎用户想法](https://okdata.online/zh/apis/zhihu/users/pins/list/) (`zhihu.users.pins.list`): $0.002/次 · 每页约 20 条帖子
- [视频号视频搜索](https://okdata.online/zh/apis/wechat_channels/videos/search/) (`wechat_channels.videos.search`): $0.02/次 · 每页约 10 条视频
- [视频号账号作品](https://okdata.online/zh/apis/wechat_channels/users/videos/list/) (`wechat_channels.users.videos.list`): $0.02/次 · 每页约 15 条视频
- [视频号作品详情](https://okdata.online/zh/apis/wechat_channels/videos/get/) (`wechat_channels.videos.get`): $0.02/次
- [视频号直播回放](https://okdata.online/zh/apis/wechat_channels/users/live_replays/list/) (`wechat_channels.users.live_replays.list`): $0.02/次 · 每页约 48 条帖子
- [抖音话题视频](https://okdata.online/zh/apis/douyin/hashtags/videos/list/) (`douyin.hashtags.videos.list`): $0.002/次 · 每页约 10 条视频
- [抖音视频播放量](https://okdata.online/zh/apis/douyin/videos/metrics/) (`douyin.videos.metrics`): $0.002/次
- [抖音相关视频](https://okdata.online/zh/apis/douyin/videos/related/) (`douyin.videos.related`): $0.002/次 · 每页约 10 条视频
- [抖音视频榜](https://okdata.online/zh/apis/douyin/videos/trending/) (`douyin.videos.trending`): $0.002/次 · 每页约 9 条视频
- [抖音巨量算数达人热门视频](https://okdata.online/zh/apis/douyin/index/creators/videos/list/) (`douyin.index.creators.videos.list`): $0.002/次 · 每页约 20 条视频
- [抖音巨量算数关键词热门视频](https://okdata.online/zh/apis/douyin/index/videos/search/) (`douyin.index.videos.search`): $0.002/次 · 每页约 20 条视频
- [抖音星图视频数据报告](https://okdata.online/zh/apis/douyin/xingtu/videos/get/) (`douyin.xingtu.videos.get`): $0.004/次
- [小红书图片搜索](https://okdata.online/zh/apis/xiaohongshu/images/search/) (`xiaohongshu.images.search`): $0.02/次 · 每页约 20 条帖子
- [小红书话题笔记](https://okdata.online/zh/apis/xiaohongshu/topics/notes/list/) (`xiaohongshu.topics.notes.list`): $0.02/次 · 每页约 10 篇笔记
- [小红书视频笔记详情（视频地址）](https://okdata.online/zh/apis/xiaohongshu/videos/get/) (`xiaohongshu.videos.get`): $0.02/次
- [小红书蒲公英内容广场热门笔记](https://okdata.online/zh/apis/xiaohongshu/pgy/notes/trending/) (`xiaohongshu.pgy.notes.trending`): $0.04/次 · 每页约 34 篇笔记
- [微博详情](https://okdata.online/zh/apis/weibo/posts/get/) (`weibo.posts.get`): $0.002/次
- [微博用户微博](https://okdata.online/zh/apis/weibo/users/posts/list/) (`weibo.users.posts.list`): $0.002/次 · 每页约 20 条帖子
- [B站用户投稿](https://okdata.online/zh/apis/bilibili/users/videos/list/) (`bilibili.users.videos.list`): $0.002/次 · 每页约 30 条视频
- [B站综合热门](https://okdata.online/zh/apis/bilibili/videos/trending/) (`bilibili.videos.trending`): $0.002/次 · 每页约 20 条视频
- [视频号合集视频](https://okdata.online/zh/apis/wechat_channels/collections/videos/list/) (`wechat_channels.collections.videos.list`): $0.02/次 · 每页约 20 条视频
- [微信搜一搜综合搜索](https://okdata.online/zh/apis/wechat/posts/search/) (`wechat.posts.search`): $0.02/次 · 每页约 20 条帖子
- [公众号文章互动数据](https://okdata.online/zh/apis/wechat_mp/articles/metrics/) (`wechat_mp.articles.metrics`): $0.02/次
- [视频号作品互动数据](https://okdata.online/zh/apis/wechat_channels/videos/metrics/) (`wechat_channels.videos.metrics`): $0.015/次
- [视频号账号作品（备用版）](https://okdata.online/zh/apis/wechat_channels/backup/users/videos/list/) (`wechat_channels.backup.users.videos.list`): $0.06/次 · 每页约 15 条视频
- [视频号视频搜索（备用版）](https://okdata.online/zh/apis/wechat_channels/backup/videos/search/) (`wechat_channels.backup.videos.search`): $0.15/次 · 每页约 10 条视频
- [微信搜一搜综合搜索（备用版）](https://okdata.online/zh/apis/wechat/backup/posts/search/) (`wechat.backup.posts.search`): $0.15/次 · 每页约 20 条帖子
- [Telegram 频道消息](https://okdata.online/zh/apis/telegram/channels/messages/list/) (`telegram.channels.messages.list`): $0.002/次 · 每页约 20 条帖子
- [Telegram 单条消息](https://okdata.online/zh/apis/telegram/messages/get/) (`telegram.messages.get`): $0.002/次
- [YouTube 频道帖子](https://okdata.online/zh/apis/youtube/channels/posts/list/) (`youtube.channels.posts.list`): $0.002/次 · 每页约 10 条帖子
- [YouTube 帖子详情](https://okdata.online/zh/apis/youtube/posts/get/) (`youtube.posts.get`): $0.002/次
- [YouTube 频道视频](https://okdata.online/zh/apis/youtube/channels/videos/list/) (`youtube.channels.videos.list`): $0.002/次 · 每页约 30 条视频
- [TikTok 账号作品](https://okdata.online/zh/apis/tiktok/users/videos/list/) (`tiktok.users.videos.list`): $0.002/次 · 每页约 10 条视频
- [TikTok 话题作品](https://okdata.online/zh/apis/tiktok/hashtags/videos/list/) (`tiktok.hashtags.videos.list`): $0.002/次 · 每页约 20 条视频
- [X 帖子回复](https://okdata.online/zh/apis/x/posts/replies/list/) (`x.posts.replies.list`): $0.002/次 · 每页约 35 条帖子
- [X 帖子引用](https://okdata.online/zh/apis/x/posts/quotes/list/) (`x.posts.quotes.list`): $0.0003/条 · 每次最多 $0.006
- [X 长文](https://okdata.online/zh/apis/x/posts/article/get/) (`x.posts.article.get`): $0.002/次
- [X 对话串](https://okdata.online/zh/apis/x/threads/posts/list/) (`x.threads.posts.list`): $0.0003/条 · 每次最多 $0.015
- [X 账号被提及](https://okdata.online/zh/apis/x/users/mentions/list/) (`x.users.mentions.list`): $0.0003/条 · 每次最多 $0.006
- [X 列表帖子](https://okdata.online/zh/apis/x/lists/posts/list/) (`x.lists.posts.list`): $0.002/次 · 每页约 100 条帖子
- [X 社群帖子](https://okdata.online/zh/apis/x/communities/posts/list/) (`x.communities.posts.list`): $0.0003/条 · 每次最多 $0.006
- [抖音用户视频（备用版）](https://okdata.online/zh/apis/douyin/backup/users/videos/list/) (`douyin.backup.users.videos.list`): $0.0025/次 · 每页约 20 条视频
- [抖音视频搜索（备用版）](https://okdata.online/zh/apis/douyin/backup/videos/search/) (`douyin.backup.videos.search`): $0.03/次 · 每页约 8 条视频
- [B站用户投稿（备用版）](https://okdata.online/zh/apis/bilibili/backup/users/videos/list/) (`bilibili.backup.users.videos.list`): $0.0025/次 · 每页约 20 条视频
