# Comment

> 内容下的一条评论或回复。

网页版：https://okdata.online/zh/docs/objects/comment/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 评论 ID。 |
| `post_id` | string | 所属内容的 ID。 |
| `parent_id` | string \| null | 回复的上级评论；一级评论为 null。 |
| `text` | string | 评论内容。 |
| `published_at` | string | 发布时间，ISO 8601，UTC。 |
| `author` | AccountRef | 评论者。 |
| `likes` | integer \| null | 评论点赞数。 |
| `replies` | integer \| null | 回复数。 |
| `ip_location` | string \| null | 平台显示的 IP 属地（有的话）。 |
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

## 返回 Comment 的接口

- [抖音视频评论](https://okdata.online/zh/apis/douyin/videos/comments/list/) (`douyin.videos.comments.list`): $0.002/次 · 每页约 20 条评论
- [小红书笔记评论](https://okdata.online/zh/apis/xiaohongshu/notes/comments/list/) (`xiaohongshu.notes.comments.list`): $0.02/次 · 每页约 10 条评论
- [B站视频评论](https://okdata.online/zh/apis/bilibili/videos/comments/list/) (`bilibili.videos.comments.list`): $0.002/次 · 每页约 20 条评论
- [TikTok 视频评论](https://okdata.online/zh/apis/tiktok/videos/comments/list/) (`tiktok.videos.comments.list`): $0.002/次 · 每页约 50 条评论
- [YouTube 视频评论](https://okdata.online/zh/apis/youtube/videos/comments/list/) (`youtube.videos.comments.list`): $0.002/次 · 每页约 20 条评论
- [Instagram 帖子评论](https://okdata.online/zh/apis/instagram/posts/comments/list/) (`instagram.posts.comments.list`): $0.004/次 · 每页约 15 条评论
- [Instagram 评论回复](https://okdata.online/zh/apis/instagram/comments/replies/list/) (`instagram.comments.replies.list`): $0.004/次 · 每页约 15 条评论
- [Reddit 帖子评论](https://okdata.online/zh/apis/reddit/posts/comments/list/) (`reddit.posts.comments.list`): $0.002/次 · 每页约 10 条评论
- [快手作品评论](https://okdata.online/zh/apis/kuaishou/videos/comments/list/) (`kuaishou.videos.comments.list`): $0.002/次 · 每页约 10 条评论
- [快手评论回复](https://okdata.online/zh/apis/kuaishou/comments/replies/list/) (`kuaishou.comments.replies.list`): $0.002/次 · 每页约 20 条评论
- [视频号作品评论](https://okdata.online/zh/apis/wechat_channels/videos/comments/list/) (`wechat_channels.videos.comments.list`): $0.015/次 · 每页约 25 条评论
- [视频号评论回复](https://okdata.online/zh/apis/wechat_channels/comments/replies/list/) (`wechat_channels.comments.replies.list`): $0.015/次 · 每页约 20 条评论
- [抖音评论回复](https://okdata.online/zh/apis/douyin/comments/replies/list/) (`douyin.comments.replies.list`): $0.002/次 · 每页约 20 条评论
- [小红书评论回复](https://okdata.online/zh/apis/xiaohongshu/comments/replies/list/) (`xiaohongshu.comments.replies.list`): $0.02/次 · 每页约 5 条评论
- [微博评论](https://okdata.online/zh/apis/weibo/posts/comments/list/) (`weibo.posts.comments.list`): $0.002/次 · 每页约 20 条评论
- [微博评论回复](https://okdata.online/zh/apis/weibo/comments/replies/list/) (`weibo.comments.replies.list`): $0.002/次 · 每页约 20 条评论
- [B站评论回复](https://okdata.online/zh/apis/bilibili/comments/replies/list/) (`bilibili.comments.replies.list`): $0.002/次 · 每页约 20 条评论
- [公众号文章评论](https://okdata.online/zh/apis/wechat_mp/articles/comments/list/) (`wechat_mp.articles.comments.list`): $0.02/次 · 每页约 20 条评论
- [公众号评论回复](https://okdata.online/zh/apis/wechat_mp/comments/replies/list/) (`wechat_mp.comments.replies.list`): $0.02/次 · 每页约 3 条评论
- [YouTube 评论回复](https://okdata.online/zh/apis/youtube/comments/replies/list/) (`youtube.comments.replies.list`): $0.002/次 · 每页约 10 条评论
- [TikTok 评论回复](https://okdata.online/zh/apis/tiktok/comments/replies/list/) (`tiktok.comments.replies.list`): $0.002/次 · 每页约 20 条评论
