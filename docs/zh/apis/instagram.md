# Instagram API

> 账号、帖子和 Reels、评论、话题，以及 Reel 里说了什么。

网页版：https://okdata.online/zh/apis/instagram/

8 个接口，每次 $0.002 到 $0.004。地区：海外。不需要Instagram账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [Instagram 账号信息](https://okdata.online/zh/apis/instagram/users/get/) | `instagram.users.get` | Account | $0.004/次 |
| [Instagram 账号帖子](https://okdata.online/zh/apis/instagram/users/posts/list/) | `instagram.users.posts.list` | Post[] | $0.004/次 · 每页约 12 条帖子 |
| [Instagram 帖子详情](https://okdata.online/zh/apis/instagram/posts/get/) | `instagram.posts.get` | Post | $0.004/次 |
| [Instagram 帖子评论](https://okdata.online/zh/apis/instagram/posts/comments/list/) | `instagram.posts.comments.list` | Comment[] | $0.004/次 · 每页约 15 条评论 |
| [Instagram 评论回复](https://okdata.online/zh/apis/instagram/comments/replies/list/) | `instagram.comments.replies.list` | Comment[] | $0.004/次 · 每页约 15 条评论 |
| [Instagram 话题帖子](https://okdata.online/zh/apis/instagram/hashtags/posts/list/) | `instagram.hashtags.posts.list` | Post[] | $0.004/次 · 每页约 10 条帖子 |
| [Instagram 视频字幕](https://okdata.online/zh/apis/instagram/posts/transcript/get/) | `instagram.posts.transcript.get` | Transcript | $0.004/次 |
| [Instagram 账号搜索](https://okdata.online/zh/apis/instagram/users/search/) | `instagram.users.search` | Account[] | $0.002/次 · 每页约 20 个账号 |

## 适合做什么

- 找博主: `instagram.users.get`, `instagram.users.search`
- 竞品监控: `instagram.users.get`, `instagram.users.posts.list`, `instagram.posts.get`, `instagram.users.search`
- 内容调研: `instagram.users.posts.list`, `instagram.posts.get`, `instagram.hashtags.posts.list`, `instagram.posts.transcript.get`
- 口碑分析: `instagram.posts.comments.list`, `instagram.comments.replies.list`
- 热点研究: `instagram.hashtags.posts.list`
- 视频转文字: `instagram.posts.transcript.get`
