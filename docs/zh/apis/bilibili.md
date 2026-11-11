# B站 API

> 视频、评论和热门榜。

网页版：https://okdata.online/zh/apis/bilibili/

4 个接口，每次 $0.002 到 $0.002。地区：中国大陆。不需要B站账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [B站视频搜索](https://okdata.online/zh/apis/bilibili/videos/search/) | `bilibili.videos.search` | Post[] | $0.002/次 · 每页约 20 条视频 |
| [B站视频详情](https://okdata.online/zh/apis/bilibili/videos/get/) | `bilibili.videos.get` | Post | $0.002/次 |
| [B站视频评论](https://okdata.online/zh/apis/bilibili/videos/comments/list/) | `bilibili.videos.comments.list` | Comment[] | $0.002/次 · 每页约 20 条评论 |
| [B站热门榜](https://okdata.online/zh/apis/bilibili/trends/list/) | `bilibili.trends.list` | Trend[] | $0.002/次 · 每页约 50 条榜单 |

## 适合做什么

- 内容调研: `bilibili.videos.search`
- 竞品监控: `bilibili.videos.get`
- 口碑分析: `bilibili.videos.comments.list`
- 热点研究: `bilibili.trends.list`
