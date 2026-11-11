# X（推特） API

> 帖子、账号、搜索和趋势。

网页版：https://okdata.online/zh/apis/x/

5 个接口，每次 $0.001 到 $0.009。地区：海外。不需要X（推特）账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [X 帖子详情](https://okdata.online/zh/apis/x/posts/get/) | `x.posts.get` | Post | $0.001/次 |
| [X 帖子搜索](https://okdata.online/zh/apis/x/posts/search/) | `x.posts.search` | Post[] | $0.006/次 · 每页约 20 条帖子 |
| [X 账号信息](https://okdata.online/zh/apis/x/users/get/) | `x.users.get` | Account | $0.001/次 |
| [X 账号帖子列表](https://okdata.online/zh/apis/x/users/posts/list/) | `x.users.posts.list` | Post[] | $0.006/次 · 每页约 20 条帖子 |
| [X 趋势](https://okdata.online/zh/apis/x/trends/list/) | `x.trends.list` | Trend[] | $0.009/次 · 每页约 30 条榜单 |

## 适合做什么

- 竞品监控: `x.posts.get`, `x.users.get`, `x.users.posts.list`
- 内容调研: `x.posts.get`
- 口碑分析: `x.posts.search`
- 热点研究: `x.posts.search`, `x.trends.list`
- 找博主: `x.users.get`
