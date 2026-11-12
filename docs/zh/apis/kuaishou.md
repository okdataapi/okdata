# 快手 API

> 视频、账号、评论和热榜。

网页版：https://okdata.online/zh/apis/kuaishou/

8 个接口，每次 $0.002 到 $0.02。地区：中国大陆。不需要快手账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [快手视频搜索](https://okdata.online/zh/apis/kuaishou/videos/search/) | `kuaishou.videos.search` | Post[] | $0.02/次 · 每页约 10 条视频 |
| [快手作品详情](https://okdata.online/zh/apis/kuaishou/videos/get/) | `kuaishou.videos.get` | Post | $0.002/次 |
| [快手作品评论](https://okdata.online/zh/apis/kuaishou/videos/comments/list/) | `kuaishou.videos.comments.list` | Comment[] | $0.002/次 · 每页约 10 条评论 |
| [快手评论回复](https://okdata.online/zh/apis/kuaishou/comments/replies/list/) | `kuaishou.comments.replies.list` | Comment[] | $0.002/次 · 每页约 20 条评论 |
| [快手账号信息](https://okdata.online/zh/apis/kuaishou/users/get/) | `kuaishou.users.get` | Account | $0.02/次 |
| [快手账号搜索](https://okdata.online/zh/apis/kuaishou/users/search/) | `kuaishou.users.search` | Account[] | $0.02/次 · 每页约 20 个账号 |
| [快手账号作品](https://okdata.online/zh/apis/kuaishou/users/videos/list/) | `kuaishou.users.videos.list` | Post[] | $0.02/次 · 每页约 20 条视频 |
| [快手热榜](https://okdata.online/zh/apis/kuaishou/trends/list/) | `kuaishou.trends.list` | Trend[] | $0.002/次 · 每页约 51 条榜单 |

## 适合做什么

- 内容调研: `kuaishou.videos.search`, `kuaishou.videos.get`
- 竞品监控: `kuaishou.videos.search`, `kuaishou.videos.get`, `kuaishou.users.get`, `kuaishou.users.search`, `kuaishou.users.videos.list`
- 口碑分析: `kuaishou.videos.comments.list`, `kuaishou.comments.replies.list`
- 找博主: `kuaishou.users.get`, `kuaishou.users.search`
- 热点研究: `kuaishou.trends.list`
