# Bluesky API

> Bluesky 上的公开账号、发帖和帖子下的回复，也能按关键词找人。

网页版：https://okdata.online/zh/apis/bluesky/

5 个接口，每次 $0.001 到 $0.001。地区：海外。不需要Bluesky账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [Bluesky 账号资料](https://okdata.online/zh/apis/bluesky/users/get/) | `bluesky.users.get` | Account | $0.001/次 |
| [Bluesky 找账号](https://okdata.online/zh/apis/bluesky/users/search/) | `bluesky.users.search` | Account[] | $0.001/次 · 每页约 25 个账号 |
| [Bluesky 账号发帖](https://okdata.online/zh/apis/bluesky/users/posts/list/) | `bluesky.users.posts.list` | Post[] | $0.001/次 · 每页约 30 条帖子 |
| [Bluesky 帖子详情](https://okdata.online/zh/apis/bluesky/posts/get/) | `bluesky.posts.get` | Post | $0.001/次 |
| [Bluesky 帖子回复](https://okdata.online/zh/apis/bluesky/posts/comments/list/) | `bluesky.posts.comments.list` | Comment[] | $0.001/次 · 每页约 200 条评论 |

## 适合做什么

- 找博主: `bluesky.users.get`, `bluesky.users.search`
- 竞品监控: `bluesky.users.get`, `bluesky.users.posts.list`, `bluesky.posts.get`
- 内容调研: `bluesky.users.posts.list`, `bluesky.posts.get`
- 口碑分析: `bluesky.posts.comments.list`
