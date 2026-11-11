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
| `published_at` | string | 发布时间，ISO 8601，UTC。 |
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
- [公众号历史文章](https://okdata.online/zh/apis/wechat_mp/accounts/articles/list/) (`wechat_mp.accounts.articles.list`): $0.04/次 · 每页约 10 篇文章
- [公众号文章详情](https://okdata.online/zh/apis/wechat_mp/articles/get/) (`wechat_mp.articles.get`): $0.02/次
- [B站视频搜索](https://okdata.online/zh/apis/bilibili/videos/search/) (`bilibili.videos.search`): $0.002/次 · 每页约 20 条视频
- [B站视频详情](https://okdata.online/zh/apis/bilibili/videos/get/) (`bilibili.videos.get`): $0.002/次
- [微博搜索](https://okdata.online/zh/apis/weibo/posts/search/) (`weibo.posts.search`): $0.002/次 · 每页约 10 条帖子
- [TikTok 视频搜索](https://okdata.online/zh/apis/tiktok/videos/search/) (`tiktok.videos.search`): $0.002/次 · 每页约 30 条视频
- [TikTok 视频详情](https://okdata.online/zh/apis/tiktok/videos/get/) (`tiktok.videos.get`): $0.002/次
- [X 帖子详情](https://okdata.online/zh/apis/x/posts/get/) (`x.posts.get`): $0.001/次
- [X 帖子搜索](https://okdata.online/zh/apis/x/posts/search/) (`x.posts.search`): $0.006/次 · 每页约 20 条帖子
- [X 账号帖子列表](https://okdata.online/zh/apis/x/users/posts/list/) (`x.users.posts.list`): $0.006/次 · 每页约 20 条帖子
- [YouTube 视频搜索](https://okdata.online/zh/apis/youtube/videos/search/) (`youtube.videos.search`): $0.004/次 · 每页约 20 条视频
- [YouTube 视频详情](https://okdata.online/zh/apis/youtube/videos/get/) (`youtube.videos.get`): $0.004/次
