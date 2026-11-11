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
- [YouTube video comments](https://okdata.online/apis/youtube/videos/comments/list/) (`youtube.videos.comments.list`): $0.004 per call · about 20 comments per page
