# 西瓜视频 API

> 西瓜视频的搜索、视频数据、评论、创作者资料和作品列表。

网页版：https://okdata.online/zh/apis/xigua/

5 个接口，每次 $0.002 到 $0.004。地区：中国大陆。不需要西瓜视频账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [西瓜视频搜索](https://okdata.online/zh/apis/xigua/videos/search/) | `xigua.videos.search` | Post[] | $0.002/次 · 每页约 10 条视频 |
| [西瓜视频详情](https://okdata.online/zh/apis/xigua/videos/get/) | `xigua.videos.get` | Post | $0.004/次 |
| [西瓜视频评论](https://okdata.online/zh/apis/xigua/videos/comments/list/) | `xigua.videos.comments.list` | Comment[] | $0.002/次 · 每页约 20 条评论 |
| [西瓜视频创作者资料](https://okdata.online/zh/apis/xigua/users/get/) | `xigua.users.get` | Account | $0.002/次 |
| [西瓜视频创作者作品](https://okdata.online/zh/apis/xigua/users/videos/list/) | `xigua.users.videos.list` | Post[] | $0.002/次 · 每页约 30 条视频 |

## 适合做什么

- 内容调研: `xigua.videos.search`, `xigua.videos.get`, `xigua.users.videos.list`
- 竞品监控: `xigua.videos.search`, `xigua.videos.get`, `xigua.users.get`, `xigua.users.videos.list`
- 口碑分析: `xigua.videos.comments.list`
- 找博主: `xigua.users.get`
