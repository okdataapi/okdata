# 微博 API

> 微博、账号和热搜。

网页版：https://okdata.online/zh/apis/weibo/

3 个接口，每次 $0.002 到 $0.002。地区：中国大陆。不需要微博账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [微博搜索](https://okdata.online/zh/apis/weibo/posts/search/) | `weibo.posts.search` | Post[] | $0.002/次 · 每页约 10 条帖子 |
| [微博热搜](https://okdata.online/zh/apis/weibo/trends/list/) | `weibo.trends.list` | Trend[] | $0.002/次 · 每页约 50 条榜单 |
| [微博账号信息](https://okdata.online/zh/apis/weibo/users/get/) | `weibo.users.get` | Account | $0.002/次 |

## 适合做什么

- 口碑分析: `weibo.posts.search`
- 热点研究: `weibo.posts.search`, `weibo.trends.list`
- 竞品监控: `weibo.users.get`
- 找博主: `weibo.users.get`
