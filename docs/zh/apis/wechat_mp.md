# 微信公众号 API

> 公众号文章和历史文章，不用扫码。

网页版：https://okdata.online/zh/apis/wechat_mp/

3 个接口，每次 $0.02 到 $0.058。地区：中国大陆。不需要微信公众号账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [公众号搜索](https://okdata.online/zh/apis/wechat_mp/accounts/search/) | `wechat_mp.accounts.search` | Account[] | $0.058/条 · 每次最多 $0.58 |
| [公众号历史文章](https://okdata.online/zh/apis/wechat_mp/accounts/articles/list/) | `wechat_mp.accounts.articles.list` | Post[] | $0.04/次 · 每页约 10 篇文章 |
| [公众号文章详情](https://okdata.online/zh/apis/wechat_mp/articles/get/) | `wechat_mp.articles.get` | Post | $0.02/次 |

## 适合做什么

- 竞品监控: `wechat_mp.accounts.search`, `wechat_mp.accounts.articles.list`
- 内容调研: `wechat_mp.accounts.articles.list`, `wechat_mp.articles.get`
