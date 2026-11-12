# 微信搜一搜 API

> 微信搜一搜：公众号文章、视频号视频和小程序。

网页版：https://okdata.online/zh/apis/wechat/

6 个接口，每次 $0.02 到 $0.15。地区：中国大陆。不需要微信搜一搜账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [微信搜一搜综合搜索](https://okdata.online/zh/apis/wechat/posts/search/) | `wechat.posts.search` | Post[] | $0.02/次 · 每页约 20 条帖子 |
| [微信公众号实时查找](https://okdata.online/zh/apis/wechat/accounts/search/) | `wechat.accounts.search` | Account[] | $0.02/次 · 每页约 8 个账号 |
| [微信指数](https://okdata.online/zh/apis/wechat/index/keywords/history/) | `wechat.index.keywords.history` | KeywordHistory[] | $0.15/次 · 每页约 1 条结果 |
| [微信搜一搜推荐词](https://okdata.online/zh/apis/wechat/keywords/related/) | `wechat.keywords.related` | KeywordRelated[] | $0.15/次 · 每页约 9 条结果 |
| [微信小程序搜索](https://okdata.online/zh/apis/wechat/miniprograms/search/) | `wechat.miniprograms.search` | Miniprogram[] | $0.15/次 · 每页约 25 条结果 |
| [微信搜一搜综合搜索（备用版）](https://okdata.online/zh/apis/wechat/backup/posts/search/) | `wechat.backup.posts.search` | Post[] | $0.15/次 · 每页约 20 条帖子 |

## 适合做什么

- 内容调研: `wechat.posts.search`, `wechat.keywords.related`, `wechat.backup.posts.search`
- 热点研究: `wechat.posts.search`, `wechat.index.keywords.history`, `wechat.keywords.related`, `wechat.backup.posts.search`
- 口碑分析: `wechat.posts.search`, `wechat.backup.posts.search`
- 竞品监控: `wechat.accounts.search`, `wechat.miniprograms.search`
- 找博主: `wechat.accounts.search`
- 选品定价: `wechat.miniprograms.search`
