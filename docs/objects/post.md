# Post

> A video, note, tweet or article, the same shape on every platform.

Canonical page: https://okdata.online/docs/objects/post/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | Post ID on the platform. |
| `url` | string | Link to the post. |
| `type` | string | What kind of post it is. |
| `title` | string \| null | Title, where the platform has one (videos, notes, articles). |
| `text` | string | Caption, body or description as plain text; articles come as Markdown. |
| `lang` | string \| null | Language code, as reported or detected. |
| `published_at` | string | When it was published, ISO 8601 in UTC. |
| `author` | AccountRef | Who posted it. |
| `metrics` | Metrics | Counts at fetch time; a count the platform hides is null. |
| `images` | string[] \| null | Image URLs for image posts and notes. |
| `hashtags` | string[] \| null | Hashtags or topics, without the # sign. |
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

### Metrics

| Field | Type | Description |
|---|---|---|
| `views` | integer \| null | Views or plays. |
| `likes` | integer \| null | Likes. |
| `comments` | integer \| null | Comments. |
| `shares` | integer \| null | Shares. |
| `favorites` | integer \| null | Saves or favorites. |
| `reposts` | integer \| null | Reposts, retweets or forwards. |

## Endpoints that return a Post

- [Douyin video search](https://okdata.online/apis/douyin/videos/search/) (`douyin.videos.search`): $0.02 per call · about 20 videos per page
- [Douyin video detail](https://okdata.online/apis/douyin/videos/get/) (`douyin.videos.get`): $0.002 per call
- [Douyin account videos](https://okdata.online/apis/douyin/users/videos/list/) (`douyin.users.videos.list`): $0.002 per call · about 20 videos per page
- [Xiaohongshu note search](https://okdata.online/apis/xiaohongshu/notes/search/) (`xiaohongshu.notes.search`): $0.02 per call · about 20 notes per page
- [Xiaohongshu note detail](https://okdata.online/apis/xiaohongshu/notes/get/) (`xiaohongshu.notes.get`): $0.02 per call
- [Xiaohongshu account notes](https://okdata.online/apis/xiaohongshu/users/notes/list/) (`xiaohongshu.users.notes.list`): $0.02 per call · about 20 notes per page
- [Official Account article history](https://okdata.online/apis/wechat_mp/accounts/articles/list/) (`wechat_mp.accounts.articles.list`): $0.04 per call · about 10 articles per page
- [Official Account article detail](https://okdata.online/apis/wechat_mp/articles/get/) (`wechat_mp.articles.get`): $0.02 per call
- [Bilibili video search](https://okdata.online/apis/bilibili/videos/search/) (`bilibili.videos.search`): $0.002 per call · about 20 videos per page
- [Bilibili video detail](https://okdata.online/apis/bilibili/videos/get/) (`bilibili.videos.get`): $0.002 per call
- [Weibo post search](https://okdata.online/apis/weibo/posts/search/) (`weibo.posts.search`): $0.002 per call · about 10 posts per page
- [TikTok video search](https://okdata.online/apis/tiktok/videos/search/) (`tiktok.videos.search`): $0.002 per call · about 30 videos per page
- [TikTok video detail](https://okdata.online/apis/tiktok/videos/get/) (`tiktok.videos.get`): $0.002 per call
- [X post detail](https://okdata.online/apis/x/posts/get/) (`x.posts.get`): $0.001 per call
- [X post search](https://okdata.online/apis/x/posts/search/) (`x.posts.search`): $0.006 per call · about 20 posts per page
- [X account posts](https://okdata.online/apis/x/users/posts/list/) (`x.users.posts.list`): $0.006 per call · about 20 posts per page
- [YouTube video search](https://okdata.online/apis/youtube/videos/search/) (`youtube.videos.search`): $0.004 per call · about 20 videos per page
- [YouTube video detail](https://okdata.online/apis/youtube/videos/get/) (`youtube.videos.get`): $0.004 per call
