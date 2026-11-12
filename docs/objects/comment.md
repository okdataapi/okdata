# Comment

> A comment or reply under a post.

Canonical page: https://okdata.online/docs/objects/comment/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | Comment ID. |
| `post_id` | string | ID of the post it is under. |
| `parent_id` | string \| null | The comment it replies to; null for top-level comments. |
| `text` | string | Comment text. |
| `published_at` | string | When it was posted, ISO 8601 in UTC. |
| `author` | AccountRef | Who wrote it. |
| `likes` | integer \| null | Likes on the comment. |
| `replies` | integer \| null | Replies under it. |
| `ip_location` | string \| null | Region label the platform shows next to the comment, if any. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### AccountRef

| Field | Type | Description |
|---|---|---|
| `id` | string | Account ID on the platform. |
| `username` | string \| null | Handle, where the platform has one. |
| `name` | string \| null | Display name. |
| `avatar_url` | string \| null | Avatar image URL. |
| `followers` | integer \| null | Follower count at fetch time. |
| `verified` | boolean \| null | Whether the platform shows a verification badge. |

## Endpoints that return a Comment

- [Douyin video comments](https://okdata.online/apis/douyin/videos/comments/list/) (`douyin.videos.comments.list`): $0.002 per call · about 20 comments per page
- [Xiaohongshu note comments](https://okdata.online/apis/xiaohongshu/notes/comments/list/) (`xiaohongshu.notes.comments.list`): $0.02 per call · about 10 comments per page
- [Bilibili video comments](https://okdata.online/apis/bilibili/videos/comments/list/) (`bilibili.videos.comments.list`): $0.002 per call · about 20 comments per page
- [TikTok video comments](https://okdata.online/apis/tiktok/videos/comments/list/) (`tiktok.videos.comments.list`): $0.002 per call · about 50 comments per page
- [YouTube video comments](https://okdata.online/apis/youtube/videos/comments/list/) (`youtube.videos.comments.list`): $0.002 per call · about 20 comments per page
- [Instagram post comments](https://okdata.online/apis/instagram/posts/comments/list/) (`instagram.posts.comments.list`): $0.004 per call · about 15 comments per page
- [Instagram comment replies](https://okdata.online/apis/instagram/comments/replies/list/) (`instagram.comments.replies.list`): $0.004 per call · about 15 comments per page
- [Reddit post comments](https://okdata.online/apis/reddit/posts/comments/list/) (`reddit.posts.comments.list`): $0.002 per call · about 10 comments per page
- [Kuaishou video comments](https://okdata.online/apis/kuaishou/videos/comments/list/) (`kuaishou.videos.comments.list`): $0.002 per call · about 10 comments per page
- [Kuaishou comment replies](https://okdata.online/apis/kuaishou/comments/replies/list/) (`kuaishou.comments.replies.list`): $0.002 per call · about 20 comments per page
- [WeChat Channels video comments](https://okdata.online/apis/wechat_channels/videos/comments/list/) (`wechat_channels.videos.comments.list`): $0.015 per call · about 25 comments per page
- [WeChat Channels comment replies](https://okdata.online/apis/wechat_channels/comments/replies/list/) (`wechat_channels.comments.replies.list`): $0.015 per call · about 20 comments per page
- [Douyin comment replies](https://okdata.online/apis/douyin/comments/replies/list/) (`douyin.comments.replies.list`): $0.002 per call · about 20 comments per page
- [Xiaohongshu comment replies](https://okdata.online/apis/xiaohongshu/comments/replies/list/) (`xiaohongshu.comments.replies.list`): $0.02 per call · about 5 comments per page
- [Weibo post comments](https://okdata.online/apis/weibo/posts/comments/list/) (`weibo.posts.comments.list`): $0.002 per call · about 20 comments per page
- [Weibo comment replies](https://okdata.online/apis/weibo/comments/replies/list/) (`weibo.comments.replies.list`): $0.002 per call · about 20 comments per page
- [Bilibili comment replies](https://okdata.online/apis/bilibili/comments/replies/list/) (`bilibili.comments.replies.list`): $0.002 per call · about 20 comments per page
- [Official Account article comments](https://okdata.online/apis/wechat_mp/articles/comments/list/) (`wechat_mp.articles.comments.list`): $0.02 per call · about 20 comments per page
- [Official Account comment replies](https://okdata.online/apis/wechat_mp/comments/replies/list/) (`wechat_mp.comments.replies.list`): $0.02 per call · about 3 comments per page
- [YouTube comment replies](https://okdata.online/apis/youtube/comments/replies/list/) (`youtube.comments.replies.list`): $0.002 per call · about 10 comments per page
- [TikTok comment replies](https://okdata.online/apis/tiktok/comments/replies/list/) (`tiktok.comments.replies.list`): $0.002 per call · about 20 comments per page
