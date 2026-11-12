# 微博 API

> 微博、账号和热搜。

网页版：https://okdata.online/zh/apis/weibo/

11 个接口，每次 $0.002 到 $0.0025。地区：中国大陆。不需要微博账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [微博搜索](https://okdata.online/zh/apis/weibo/posts/search/) | `weibo.posts.search` | Post[] | $0.002/次 · 每页约 10 条帖子 |
| [微博热搜](https://okdata.online/zh/apis/weibo/trends/list/) | `weibo.trends.list` | Trend[] | $0.002/次 · 每页约 50 条榜单 |
| [微博账号信息](https://okdata.online/zh/apis/weibo/users/get/) | `weibo.users.get` | Account | $0.002/次 |
| [微博详情](https://okdata.online/zh/apis/weibo/posts/get/) | `weibo.posts.get` | Post | $0.002/次 |
| [微博评论](https://okdata.online/zh/apis/weibo/posts/comments/list/) | `weibo.posts.comments.list` | Comment[] | $0.002/次 · 每页约 20 条评论 |
| [微博评论回复](https://okdata.online/zh/apis/weibo/comments/replies/list/) | `weibo.comments.replies.list` | Comment[] | $0.002/次 · 每页约 20 条评论 |
| [微博点赞用户](https://okdata.online/zh/apis/weibo/posts/likers/list/) | `weibo.posts.likers.list` | Account[] | $0.002/次 · 每页约 50 个账号 |
| [微博用户微博](https://okdata.online/zh/apis/weibo/users/posts/list/) | `weibo.users.posts.list` | Post[] | $0.002/次 · 每页约 20 条帖子 |
| [微博用户粉丝列表](https://okdata.online/zh/apis/weibo/users/followers/list/) | `weibo.users.followers.list` | Account[] | $0.002/次 · 每页约 20 个账号 |
| [微博用户搜索](https://okdata.online/zh/apis/weibo/users/search/) | `weibo.users.search` | Account[] | $0.002/次 · 每页约 20 个账号 |
| [微博热搜榜（备用版）](https://okdata.online/zh/apis/weibo/backup/trends/list/) | `weibo.backup.trends.list` | Trend[] | $0.0025/次 · 每页约 50 条榜单 |

## 适合做什么

- 口碑分析: `weibo.posts.search`, `weibo.posts.comments.list`, `weibo.comments.replies.list`, `weibo.posts.likers.list`
- 热点研究: `weibo.posts.search`, `weibo.trends.list`, `weibo.backup.trends.list`
- 竞品监控: `weibo.users.get`, `weibo.posts.get`, `weibo.users.posts.list`, `weibo.users.followers.list`, `weibo.users.search`
- 找博主: `weibo.users.get`, `weibo.posts.likers.list`, `weibo.users.followers.list`, `weibo.users.search`
- 内容调研: `weibo.posts.get`, `weibo.users.posts.list`
