# 今日头条 API

> 头条文章全文、视频、评论和头条号资料。

网页版：https://okdata.online/zh/apis/toutiao/

5 个接口，每次 $0.002 到 $0.002。地区：中国大陆。不需要今日头条账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [头条文章详情](https://okdata.online/zh/apis/toutiao/articles/get/) | `toutiao.articles.get` | Post | $0.002/次 |
| [头条视频详情](https://okdata.online/zh/apis/toutiao/videos/get/) | `toutiao.videos.get` | Post | $0.002/次 |
| [头条评论](https://okdata.online/zh/apis/toutiao/posts/comments/list/) | `toutiao.posts.comments.list` | Comment[] | $0.002/次 · 每页约 20 条评论 |
| [头条号资料](https://okdata.online/zh/apis/toutiao/users/get/) | `toutiao.users.get` | Account | $0.002/次 |
| [头条热榜](https://okdata.online/zh/apis/toutiao/trends/list/) | `toutiao.trends.list` | Trend[] | $0.002/次 · 每页约 50 条榜单 |

## 适合做什么

- 内容调研: `toutiao.articles.get`, `toutiao.videos.get`
- 竞品监控: `toutiao.articles.get`, `toutiao.videos.get`, `toutiao.users.get`
- 口碑分析: `toutiao.posts.comments.list`
- 找博主: `toutiao.users.get`
- 热点研究: `toutiao.trends.list`
