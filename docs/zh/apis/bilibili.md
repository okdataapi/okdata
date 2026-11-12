# B站 API

> 视频、评论和热门榜。

网页版：https://okdata.online/zh/apis/bilibili/

9 个接口，每次 $0.002 到 $0.0025。地区：中国大陆。不需要B站账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [B站视频搜索](https://okdata.online/zh/apis/bilibili/videos/search/) | `bilibili.videos.search` | Post[] | $0.002/次 · 每页约 20 条视频 |
| [B站视频详情](https://okdata.online/zh/apis/bilibili/videos/get/) | `bilibili.videos.get` | Post | $0.002/次 |
| [B站视频评论](https://okdata.online/zh/apis/bilibili/videos/comments/list/) | `bilibili.videos.comments.list` | Comment[] | $0.002/次 · 每页约 20 条评论 |
| [B站热搜榜](https://okdata.online/zh/apis/bilibili/trends/list/) | `bilibili.trends.list` | Trend[] | $0.002/次 · 每页约 50 条榜单 |
| [B站用户资料](https://okdata.online/zh/apis/bilibili/users/get/) | `bilibili.users.get` | Account | $0.002/次 |
| [B站用户投稿](https://okdata.online/zh/apis/bilibili/users/videos/list/) | `bilibili.users.videos.list` | Post[] | $0.002/次 · 每页约 30 条视频 |
| [B站评论回复](https://okdata.online/zh/apis/bilibili/comments/replies/list/) | `bilibili.comments.replies.list` | Comment[] | $0.002/次 · 每页约 20 条评论 |
| [B站综合热门](https://okdata.online/zh/apis/bilibili/videos/trending/) | `bilibili.videos.trending` | Post[] | $0.002/次 · 每页约 20 条视频 |
| [B站用户投稿（备用版）](https://okdata.online/zh/apis/bilibili/backup/users/videos/list/) | `bilibili.backup.users.videos.list` | Post[] | $0.0025/次 · 每页约 20 条视频 |

## 适合做什么

- 内容调研: `bilibili.videos.search`, `bilibili.users.videos.list`, `bilibili.videos.trending`, `bilibili.backup.users.videos.list`
- 竞品监控: `bilibili.videos.get`, `bilibili.users.get`, `bilibili.users.videos.list`, `bilibili.backup.users.videos.list`
- 口碑分析: `bilibili.videos.comments.list`, `bilibili.comments.replies.list`
- 热点研究: `bilibili.trends.list`, `bilibili.videos.trending`
- 找博主: `bilibili.users.get`
