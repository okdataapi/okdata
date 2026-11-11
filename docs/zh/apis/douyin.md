# 抖音 API

> 视频、账号、评论和热搜榜。

网页版：https://okdata.online/zh/apis/douyin/

6 个接口，每次 $0.002 到 $0.02。地区：中国大陆。不需要抖音账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [抖音视频搜索](https://okdata.online/zh/apis/douyin/videos/search/) | `douyin.videos.search` | Post[] | $0.02/次 · 每页约 20 条视频 |
| [抖音视频详情](https://okdata.online/zh/apis/douyin/videos/get/) | `douyin.videos.get` | Post | $0.002/次 |
| [抖音视频评论](https://okdata.online/zh/apis/douyin/videos/comments/list/) | `douyin.videos.comments.list` | Comment[] | $0.002/次 · 每页约 20 条评论 |
| [抖音账号信息](https://okdata.online/zh/apis/douyin/users/get/) | `douyin.users.get` | Account | $0.002/次 |
| [抖音账号作品列表](https://okdata.online/zh/apis/douyin/users/videos/list/) | `douyin.users.videos.list` | Post[] | $0.002/次 · 每页约 20 条视频 |
| [抖音热搜榜](https://okdata.online/zh/apis/douyin/trends/list/) | `douyin.trends.list` | Trend[] | $0.002/次 · 每页约 50 条榜单 |

## 适合做什么

- 内容调研: `douyin.videos.search`, `douyin.videos.get`
- 竞品监控: `douyin.videos.search`, `douyin.videos.get`, `douyin.users.get`, `douyin.users.videos.list`
- 口碑分析: `douyin.videos.comments.list`
- 找博主: `douyin.users.get`
- 热点研究: `douyin.trends.list`
