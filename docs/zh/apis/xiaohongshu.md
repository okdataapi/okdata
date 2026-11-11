# 小红书 API

> 笔记、博主和大家在搜什么。

网页版：https://okdata.online/zh/apis/xiaohongshu/

6 个接口，每次 $0.02 到 $0.02。地区：中国大陆。不需要小红书账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [小红书笔记搜索](https://okdata.online/zh/apis/xiaohongshu/notes/search/) | `xiaohongshu.notes.search` | Post[] | $0.02/次 · 每页约 20 篇笔记 |
| [小红书笔记详情](https://okdata.online/zh/apis/xiaohongshu/notes/get/) | `xiaohongshu.notes.get` | Post | $0.02/次 |
| [小红书笔记评论](https://okdata.online/zh/apis/xiaohongshu/notes/comments/list/) | `xiaohongshu.notes.comments.list` | Comment[] | $0.02/次 · 每页约 10 条评论 |
| [小红书博主信息](https://okdata.online/zh/apis/xiaohongshu/users/get/) | `xiaohongshu.users.get` | Account | $0.02/次 |
| [小红书博主笔记列表](https://okdata.online/zh/apis/xiaohongshu/users/notes/list/) | `xiaohongshu.users.notes.list` | Post[] | $0.02/次 · 每页约 20 篇笔记 |
| [小红书热点话题](https://okdata.online/zh/apis/xiaohongshu/trends/list/) | `xiaohongshu.trends.list` | Trend[] | $0.02/次 · 每页约 20 条榜单 |

## 适合做什么

- 内容调研: `xiaohongshu.notes.search`, `xiaohongshu.notes.get`
- 口碑分析: `xiaohongshu.notes.search`, `xiaohongshu.notes.comments.list`
- 竞品监控: `xiaohongshu.notes.search`, `xiaohongshu.notes.get`, `xiaohongshu.users.get`, `xiaohongshu.users.notes.list`
- 找博主: `xiaohongshu.users.get`, `xiaohongshu.users.notes.list`
- 热点研究: `xiaohongshu.trends.list`
