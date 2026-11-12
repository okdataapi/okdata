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
| `published_at` | string \| null | When it was published, ISO 8601 in UTC; null only where the source gives no time (wechat_mp.articles.metrics, wechat_channels.videos.metrics, youtube.channels.videos.list with type=short), then listed in meta.unavailable. |
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
- [Official Account article history](https://okdata.online/apis/wechat_mp/accounts/articles/list/) (`wechat_mp.accounts.articles.list`): $0.02 per call · about 10 articles per page
- [Official Account article detail](https://okdata.online/apis/wechat_mp/articles/get/) (`wechat_mp.articles.get`): $0.02 per call
- [Bilibili video search](https://okdata.online/apis/bilibili/videos/search/) (`bilibili.videos.search`): $0.002 per call · about 20 videos per page
- [Bilibili video detail](https://okdata.online/apis/bilibili/videos/get/) (`bilibili.videos.get`): $0.002 per call
- [Weibo post search](https://okdata.online/apis/weibo/posts/search/) (`weibo.posts.search`): $0.002 per call · about 10 posts per page
- [TikTok video search](https://okdata.online/apis/tiktok/videos/search/) (`tiktok.videos.search`): $0.002 per call · about 30 videos per page
- [TikTok video detail](https://okdata.online/apis/tiktok/videos/get/) (`tiktok.videos.get`): $0.002 per call
- [X post detail](https://okdata.online/apis/x/posts/get/) (`x.posts.get`): $0.0003 per call
- [X post search](https://okdata.online/apis/x/posts/search/) (`x.posts.search`): $0.002 per call · about 20 posts per page
- [X account posts](https://okdata.online/apis/x/users/posts/list/) (`x.users.posts.list`): $0.002 per call · about 20 posts per page
- [YouTube video search](https://okdata.online/apis/youtube/videos/search/) (`youtube.videos.search`): $0.004 per call · about 20 videos per page
- [YouTube video detail](https://okdata.online/apis/youtube/videos/get/) (`youtube.videos.get`): $0.002 per call
- [Instagram account posts](https://okdata.online/apis/instagram/users/posts/list/) (`instagram.users.posts.list`): $0.004 per call · about 12 posts per page
- [Instagram post detail](https://okdata.online/apis/instagram/posts/get/) (`instagram.posts.get`): $0.004 per call
- [Instagram hashtag posts](https://okdata.online/apis/instagram/hashtags/posts/list/) (`instagram.hashtags.posts.list`): $0.004 per call · about 10 posts per page
- [Reddit post search](https://okdata.online/apis/reddit/posts/search/) (`reddit.posts.search`): $0.004 per call · about 25 posts per page
- [Reddit post detail](https://okdata.online/apis/reddit/posts/get/) (`reddit.posts.get`): $0.002 per call
- [Reddit Popular feed](https://okdata.online/apis/reddit/popular/posts/list/) (`reddit.popular.posts.list`): $0.002 per call · about 10 posts per page
- [Reddit community posts](https://okdata.online/apis/reddit/subreddits/posts/list/) (`reddit.subreddits.posts.list`): $0.004 per call · about 25 posts per page
- [Reddit user posts](https://okdata.online/apis/reddit/users/posts/list/) (`reddit.users.posts.list`): $0.002 per call · about 25 posts per page
- [Kuaishou video search](https://okdata.online/apis/kuaishou/videos/search/) (`kuaishou.videos.search`): $0.02 per call · about 10 videos per page
- [Kuaishou video detail](https://okdata.online/apis/kuaishou/videos/get/) (`kuaishou.videos.get`): $0.002 per call
- [Kuaishou account videos](https://okdata.online/apis/kuaishou/users/videos/list/) (`kuaishou.users.videos.list`): $0.02 per call · about 20 videos per page
- [Zhihu search](https://okdata.online/apis/zhihu/posts/search/) (`zhihu.posts.search`): $0.002 per call · about 20 posts per page
- [Zhihu question answers](https://okdata.online/apis/zhihu/questions/answers/list/) (`zhihu.questions.answers.list`): $0.002 per call · about 20 posts per page
- [Zhihu question detail](https://okdata.online/apis/zhihu/questions/get/) (`zhihu.questions.get`): $0.002 per call
- [Zhihu answer detail](https://okdata.online/apis/zhihu/answers/get/) (`zhihu.answers.get`): $0.002 per call
- [Zhihu article detail](https://okdata.online/apis/zhihu/articles/get/) (`zhihu.articles.get`): $0.002 per call
- [Zhihu column articles](https://okdata.online/apis/zhihu/columns/articles/list/) (`zhihu.columns.articles.list`): $0.002 per call · about 20 articles per page
- [Zhihu pin detail](https://okdata.online/apis/zhihu/pins/get/) (`zhihu.pins.get`): $0.002 per call
- [Zhihu user answers](https://okdata.online/apis/zhihu/users/answers/list/) (`zhihu.users.answers.list`): $0.002 per call · about 20 posts per page
- [Zhihu user articles](https://okdata.online/apis/zhihu/users/articles/list/) (`zhihu.users.articles.list`): $0.002 per call · about 20 articles per page
- [Zhihu user pins](https://okdata.online/apis/zhihu/users/pins/list/) (`zhihu.users.pins.list`): $0.002 per call · about 20 posts per page
- [WeChat Channels video search](https://okdata.online/apis/wechat_channels/videos/search/) (`wechat_channels.videos.search`): $0.02 per call · about 10 videos per page
- [WeChat Channels account videos](https://okdata.online/apis/wechat_channels/users/videos/list/) (`wechat_channels.users.videos.list`): $0.02 per call · about 15 videos per page
- [WeChat Channels video detail](https://okdata.online/apis/wechat_channels/videos/get/) (`wechat_channels.videos.get`): $0.02 per call
- [WeChat Channels live replays](https://okdata.online/apis/wechat_channels/users/live_replays/list/) (`wechat_channels.users.live_replays.list`): $0.02 per call · about 48 posts per page
- [Douyin hashtag videos](https://okdata.online/apis/douyin/hashtags/videos/list/) (`douyin.hashtags.videos.list`): $0.002 per call · about 10 videos per page
- [Douyin video play count](https://okdata.online/apis/douyin/videos/metrics/) (`douyin.videos.metrics`): $0.002 per call
- [Douyin related videos](https://okdata.online/apis/douyin/videos/related/) (`douyin.videos.related`): $0.002 per call · about 10 videos per page
- [Douyin video boards](https://okdata.online/apis/douyin/videos/trending/) (`douyin.videos.trending`): $0.002 per call · about 9 videos per page
- [Douyin index: account top videos](https://okdata.online/apis/douyin/index/creators/videos/list/) (`douyin.index.creators.videos.list`): $0.002 per call · about 20 videos per page
- [Douyin index: top videos for a keyword](https://okdata.online/apis/douyin/index/videos/search/) (`douyin.index.videos.search`): $0.002 per call · about 20 videos per page
- [Douyin Xingtu video report](https://okdata.online/apis/douyin/xingtu/videos/get/) (`douyin.xingtu.videos.get`): $0.004 per call
- [Xiaohongshu image search](https://okdata.online/apis/xiaohongshu/images/search/) (`xiaohongshu.images.search`): $0.02 per call · about 20 posts per page
- [Xiaohongshu topic notes](https://okdata.online/apis/xiaohongshu/topics/notes/list/) (`xiaohongshu.topics.notes.list`): $0.02 per call · about 10 notes per page
- [Xiaohongshu video note with its video](https://okdata.online/apis/xiaohongshu/videos/get/) (`xiaohongshu.videos.get`): $0.02 per call
- [Xiaohongshu PGY trending notes](https://okdata.online/apis/xiaohongshu/pgy/notes/trending/) (`xiaohongshu.pgy.notes.trending`): $0.04 per call · about 34 notes per page
- [Weibo post detail](https://okdata.online/apis/weibo/posts/get/) (`weibo.posts.get`): $0.002 per call
- [Weibo account posts](https://okdata.online/apis/weibo/users/posts/list/) (`weibo.users.posts.list`): $0.002 per call · about 20 posts per page
- [Bilibili account videos](https://okdata.online/apis/bilibili/users/videos/list/) (`bilibili.users.videos.list`): $0.002 per call · about 30 videos per page
- [Bilibili popular videos](https://okdata.online/apis/bilibili/videos/trending/) (`bilibili.videos.trending`): $0.002 per call · about 20 videos per page
- [WeChat Channels collection videos](https://okdata.online/apis/wechat_channels/collections/videos/list/) (`wechat_channels.collections.videos.list`): $0.02 per call · about 20 videos per page
- [WeChat Search articles and videos](https://okdata.online/apis/wechat/posts/search/) (`wechat.posts.search`): $0.02 per call · about 20 posts per page
- [Official Account article stats](https://okdata.online/apis/wechat_mp/articles/metrics/) (`wechat_mp.articles.metrics`): $0.02 per call
- [WeChat Channels video stats](https://okdata.online/apis/wechat_channels/videos/metrics/) (`wechat_channels.videos.metrics`): $0.015 per call
- [WeChat Channels account videos (backup)](https://okdata.online/apis/wechat_channels/backup/users/videos/list/) (`wechat_channels.backup.users.videos.list`): $0.06 per call · about 15 videos per page
- [WeChat Channels video search (backup)](https://okdata.online/apis/wechat_channels/backup/videos/search/) (`wechat_channels.backup.videos.search`): $0.15 per call · about 10 videos per page
- [WeChat Search articles and videos (backup)](https://okdata.online/apis/wechat/backup/posts/search/) (`wechat.backup.posts.search`): $0.15 per call · about 20 posts per page
- [Telegram channel messages](https://okdata.online/apis/telegram/channels/messages/list/) (`telegram.channels.messages.list`): $0.002 per call · about 20 posts per page
- [Telegram message detail](https://okdata.online/apis/telegram/messages/get/) (`telegram.messages.get`): $0.002 per call
- [YouTube channel posts](https://okdata.online/apis/youtube/channels/posts/list/) (`youtube.channels.posts.list`): $0.002 per call · about 10 posts per page
- [YouTube post detail](https://okdata.online/apis/youtube/posts/get/) (`youtube.posts.get`): $0.002 per call
- [YouTube channel videos](https://okdata.online/apis/youtube/channels/videos/list/) (`youtube.channels.videos.list`): $0.002 per call · about 30 videos per page
- [TikTok account videos](https://okdata.online/apis/tiktok/users/videos/list/) (`tiktok.users.videos.list`): $0.002 per call · about 10 videos per page
- [TikTok hashtag videos](https://okdata.online/apis/tiktok/hashtags/videos/list/) (`tiktok.hashtags.videos.list`): $0.002 per call · about 20 videos per page
- [X post replies](https://okdata.online/apis/x/posts/replies/list/) (`x.posts.replies.list`): $0.002 per call · about 35 posts per page
- [X post quotes](https://okdata.online/apis/x/posts/quotes/list/) (`x.posts.quotes.list`): $0.0003 per post · at most $0.006 per call
- [X article](https://okdata.online/apis/x/posts/article/get/) (`x.posts.article.get`): $0.002 per call
- [X thread](https://okdata.online/apis/x/threads/posts/list/) (`x.threads.posts.list`): $0.0003 per post · at most $0.015 per call
- [X account mentions](https://okdata.online/apis/x/users/mentions/list/) (`x.users.mentions.list`): $0.0003 per post · at most $0.006 per call
- [X list posts](https://okdata.online/apis/x/lists/posts/list/) (`x.lists.posts.list`): $0.002 per call · about 100 posts per page
- [X community posts](https://okdata.online/apis/x/communities/posts/list/) (`x.communities.posts.list`): $0.0003 per post · at most $0.006 per call
- [Douyin account videos (backup)](https://okdata.online/apis/douyin/backup/users/videos/list/) (`douyin.backup.users.videos.list`): $0.0025 per call · about 20 videos per page
- [Douyin video search (backup)](https://okdata.online/apis/douyin/backup/videos/search/) (`douyin.backup.videos.search`): $0.03 per call · about 8 videos per page
- [Bilibili account videos (backup)](https://okdata.online/apis/bilibili/backup/users/videos/list/) (`bilibili.backup.users.videos.list`): $0.0025 per call · about 20 videos per page
