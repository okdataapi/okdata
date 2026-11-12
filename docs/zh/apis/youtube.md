# YouTube API

> 视频、评论和字幕。

网页版：https://okdata.online/zh/apis/youtube/

7 个接口，每次 $0.002 到 $0.004。地区：海外。不需要YouTube账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [YouTube 视频搜索](https://okdata.online/zh/apis/youtube/videos/search/) | `youtube.videos.search` | Post[] | $0.004/次 · 每页约 20 条视频 |
| [YouTube 视频详情](https://okdata.online/zh/apis/youtube/videos/get/) | `youtube.videos.get` | Post | $0.002/次 |
| [YouTube 视频评论](https://okdata.online/zh/apis/youtube/videos/comments/list/) | `youtube.videos.comments.list` | Comment[] | $0.002/次 · 每页约 20 条评论 |
| [YouTube 视频字幕](https://okdata.online/zh/apis/youtube/videos/transcript/get/) | `youtube.videos.transcript.get` | Transcript | $0.004/次 |
| [YouTube 评论回复](https://okdata.online/zh/apis/youtube/comments/replies/list/) | `youtube.comments.replies.list` | Comment[] | $0.002/次 · 每页约 10 条评论 |
| [YouTube 频道帖子](https://okdata.online/zh/apis/youtube/channels/posts/list/) | `youtube.channels.posts.list` | Post[] | $0.002/次 · 每页约 10 条帖子 |
| [YouTube 帖子详情](https://okdata.online/zh/apis/youtube/posts/get/) | `youtube.posts.get` | Post | $0.002/次 |

## 适合做什么

- 内容调研: `youtube.videos.search`, `youtube.videos.transcript.get`, `youtube.channels.posts.list`, `youtube.posts.get`
- 竞品监控: `youtube.videos.get`, `youtube.channels.posts.list`, `youtube.posts.get`
- 口碑分析: `youtube.videos.comments.list`, `youtube.comments.replies.list`
- 视频转文字: `youtube.videos.transcript.get`
