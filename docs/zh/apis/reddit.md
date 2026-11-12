# Reddit API

> 帖子、评论、社区、用户和正在热的内容。

网页版：https://okdata.online/zh/apis/reddit/

11 个接口，每次 $0.002 到 $0.004。地区：海外。不需要Reddit账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [Reddit 帖子搜索](https://okdata.online/zh/apis/reddit/posts/search/) | `reddit.posts.search` | Post[] | $0.004/次 · 每页约 25 条帖子 |
| [Reddit 帖子详情](https://okdata.online/zh/apis/reddit/posts/get/) | `reddit.posts.get` | Post | $0.002/次 |
| [Reddit 帖子评论](https://okdata.online/zh/apis/reddit/posts/comments/list/) | `reddit.posts.comments.list` | Comment[] | $0.002/次 · 每页约 10 条评论 |
| [Reddit 热门帖子](https://okdata.online/zh/apis/reddit/popular/posts/list/) | `reddit.popular.posts.list` | Post[] | $0.002/次 · 每页约 10 条帖子 |
| [Reddit 社区帖子](https://okdata.online/zh/apis/reddit/subreddits/posts/list/) | `reddit.subreddits.posts.list` | Post[] | $0.004/次 · 每页约 25 条帖子 |
| [Reddit 社区资料](https://okdata.online/zh/apis/reddit/subreddits/get/) | `reddit.subreddits.get` | Account | $0.002/次 |
| [Reddit 趋势搜索](https://okdata.online/zh/apis/reddit/trends/list/) | `reddit.trends.list` | Trend[] | $0.002/次 · 每页约 6 条榜单 |
| [Reddit 用户资料](https://okdata.online/zh/apis/reddit/users/get/) | `reddit.users.get` | Account | $0.002/次 |
| [Reddit 用户帖子](https://okdata.online/zh/apis/reddit/users/posts/list/) | `reddit.users.posts.list` | Post[] | $0.002/次 · 每页约 25 条帖子 |
| [Reddit 用户活跃社区](https://okdata.online/zh/apis/reddit/users/subreddits/list/) | `reddit.users.subreddits.list` | Account[] | $0.002/次 · 每页约 30 个账号 |
| [Reddit 视频字幕](https://okdata.online/zh/apis/reddit/posts/transcript/get/) | `reddit.posts.transcript.get` | Transcript | $0.004/次 |

## 适合做什么

- 口碑分析: `reddit.posts.search`, `reddit.posts.comments.list`
- 内容调研: `reddit.posts.search`, `reddit.posts.get`, `reddit.subreddits.posts.list`, `reddit.subreddits.get`, `reddit.posts.transcript.get`
- 竞品监控: `reddit.posts.get`, `reddit.subreddits.posts.list`, `reddit.subreddits.get`, `reddit.users.get`, `reddit.users.posts.list`
- 热点研究: `reddit.popular.posts.list`, `reddit.trends.list`
- 找博主: `reddit.users.get`, `reddit.users.subreddits.list`
- 视频转文字: `reddit.posts.transcript.get`
