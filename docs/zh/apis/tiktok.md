# TikTok API

> 全球的视频、账号和评论。

网页版：https://okdata.online/zh/apis/tiktok/

4 个接口，每次 $0.002 到 $0.002。地区：海外。不需要TikTok账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [TikTok 视频搜索](https://okdata.online/zh/apis/tiktok/videos/search/) | `tiktok.videos.search` | Post[] | $0.002/次 · 每页约 30 条视频 |
| [TikTok 视频详情](https://okdata.online/zh/apis/tiktok/videos/get/) | `tiktok.videos.get` | Post | $0.002/次 |
| [TikTok 视频评论](https://okdata.online/zh/apis/tiktok/videos/comments/list/) | `tiktok.videos.comments.list` | Comment[] | $0.002/次 · 每页约 50 条评论 |
| [TikTok 账号信息](https://okdata.online/zh/apis/tiktok/users/get/) | `tiktok.users.get` | Account | $0.002/次 |

## 适合做什么

- 内容调研: `tiktok.videos.search`
- 热点研究: `tiktok.videos.search`
- 竞品监控: `tiktok.videos.get`, `tiktok.users.get`
- 口碑分析: `tiktok.videos.comments.list`
- 找博主: `tiktok.users.get`
