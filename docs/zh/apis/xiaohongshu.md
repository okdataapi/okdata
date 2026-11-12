# 小红书 API

> 笔记、博主和大家在搜什么。

网页版：https://okdata.online/zh/apis/xiaohongshu/

30 个接口，每次 $0.02 到 $0.04。地区：中国大陆。不需要小红书账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [小红书笔记搜索](https://okdata.online/zh/apis/xiaohongshu/notes/search/) | `xiaohongshu.notes.search` | Post[] | $0.02/次 · 每页约 20 篇笔记 |
| [小红书笔记详情](https://okdata.online/zh/apis/xiaohongshu/notes/get/) | `xiaohongshu.notes.get` | Post | $0.02/次 |
| [小红书笔记评论](https://okdata.online/zh/apis/xiaohongshu/notes/comments/list/) | `xiaohongshu.notes.comments.list` | Comment[] | $0.02/次 · 每页约 10 条评论 |
| [小红书博主信息](https://okdata.online/zh/apis/xiaohongshu/users/get/) | `xiaohongshu.users.get` | Account | $0.02/次 |
| [小红书博主笔记列表](https://okdata.online/zh/apis/xiaohongshu/users/notes/list/) | `xiaohongshu.users.notes.list` | Post[] | $0.02/次 · 每页约 20 篇笔记 |
| [小红书热点话题](https://okdata.online/zh/apis/xiaohongshu/trends/list/) | `xiaohongshu.trends.list` | Trend[] | $0.02/次 · 每页约 20 条榜单 |
| [小红书蒲公英达人搜索](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/search/) | `xiaohongshu.pgy.creators.search` | Creator[] | $0.04/次 · 每页约 20 位达人 |
| [小红书蒲公英达人详情](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/get/) | `xiaohongshu.pgy.creators.get` | Creator | $0.04/次 |
| [小红书商城商品搜索](https://okdata.online/zh/apis/xiaohongshu/shop/products/search/) | `xiaohongshu.shop.products.search` | Product[] | $0.02/次 · 每页约 20 个商品 |
| [小红书商城商品评价](https://okdata.online/zh/apis/xiaohongshu/shop/products/reviews/list/) | `xiaohongshu.shop.products.reviews.list` | Review[] | $0.02/次 · 每页约 12 条评价 |
| [小红书图片搜索](https://okdata.online/zh/apis/xiaohongshu/images/search/) | `xiaohongshu.images.search` | Post[] | $0.02/次 · 每页约 20 条帖子 |
| [小红书评论回复](https://okdata.online/zh/apis/xiaohongshu/comments/replies/list/) | `xiaohongshu.comments.replies.list` | Comment[] | $0.02/次 · 每页约 5 条评论 |
| [小红书话题笔记](https://okdata.online/zh/apis/xiaohongshu/topics/notes/list/) | `xiaohongshu.topics.notes.list` | Post[] | $0.02/次 · 每页约 10 篇笔记 |
| [小红书话题详情](https://okdata.online/zh/apis/xiaohongshu/topics/get/) | `xiaohongshu.topics.get` | Topic | $0.02/次 |
| [小红书账号搜索](https://okdata.online/zh/apis/xiaohongshu/users/search/) | `xiaohongshu.users.search` | Account[] | $0.02/次 · 每页约 20 个账号 |
| [小红书商城商品详情](https://okdata.online/zh/apis/xiaohongshu/shop/products/get/) | `xiaohongshu.shop.products.get` | Product | $0.02/次 |
| [小红书搜索联想词](https://okdata.online/zh/apis/xiaohongshu/keywords/related/) | `xiaohongshu.keywords.related` | KeywordRelated[] | $0.02/次 · 每页约 10 条结果 |
| [小红书视频笔记详情（视频地址）](https://okdata.online/zh/apis/xiaohongshu/videos/get/) | `xiaohongshu.videos.get` | Post | $0.02/次 |
| [小红书蒲公英关键词搜索指数](https://okdata.online/zh/apis/xiaohongshu/pgy/keywords/history/) | `xiaohongshu.pgy.keywords.history` | KeywordHistory | $0.04/次 |
| [小红书蒲公英关联词](https://okdata.online/zh/apis/xiaohongshu/pgy/keywords/related/) | `xiaohongshu.pgy.keywords.related` | KeywordRelated[] | $0.04/次 · 每页约 98 条结果 |
| [小红书蒲公英达人粉丝画像](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/audience/get/) | `xiaohongshu.pgy.creators.audience.get` | Audience | $0.04/次 |
| [小红书蒲公英达人数据表现](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/metrics/) | `xiaohongshu.pgy.creators.metrics` | PgyCreatorMetrics | $0.04/次 |
| [小红书蒲公英达人笔记](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/notes/list/) | `xiaohongshu.pgy.creators.notes.list` | PgyCreatorPost[] | $0.04/次 · 每页约 8 篇笔记 |
| [小红书蒲公英达人粉丝趋势](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/followers/history/) | `xiaohongshu.pgy.creators.followers.history` | FollowerHistory | $0.04/次 |
| [小红书蒲公英相似达人](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/related/) | `xiaohongshu.pgy.creators.related` | Creator[] | $0.04/次 · 每页约 4 位达人 |
| [小红书蒲公英内容广场热门笔记](https://okdata.online/zh/apis/xiaohongshu/pgy/notes/trending/) | `xiaohongshu.pgy.notes.trending` | Post[] | $0.04/次 · 每页约 34 篇笔记 |
| [小红书蒲公英达人合作成本概览](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/costs/metrics/) | `xiaohongshu.pgy.creators.costs.metrics` | PgyCreatorCosts | $0.04/次 |
| [小红书蒲公英达人粉丝概览](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/followers/metrics/) | `xiaohongshu.pgy.creators.followers.metrics` | PgyCreatorFollowers | $0.04/次 |
| [小红书蒲公英达人核心数据趋势](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/costs/history/) | `xiaohongshu.pgy.creators.costs.history` | PgyCreatorCostHistory | $0.04/次 |
| [小红书蒲公英笔记数据](https://okdata.online/zh/apis/xiaohongshu/pgy/notes/get/) | `xiaohongshu.pgy.notes.get` | PgyNote | $0.04/次 |

## 适合做什么

- 内容调研: `xiaohongshu.notes.search`, `xiaohongshu.notes.get`, `xiaohongshu.images.search`, `xiaohongshu.topics.notes.list`, `xiaohongshu.keywords.related`, `xiaohongshu.videos.get`, `xiaohongshu.pgy.keywords.history`, `xiaohongshu.pgy.keywords.related`, `xiaohongshu.pgy.notes.trending`
- 口碑分析: `xiaohongshu.notes.search`, `xiaohongshu.notes.comments.list`, `xiaohongshu.shop.products.reviews.list`, `xiaohongshu.comments.replies.list`
- 竞品监控: `xiaohongshu.notes.search`, `xiaohongshu.notes.get`, `xiaohongshu.users.get`, `xiaohongshu.users.notes.list`, `xiaohongshu.shop.products.search`, `xiaohongshu.users.search`, `xiaohongshu.shop.products.get`, `xiaohongshu.pgy.creators.notes.list`, `xiaohongshu.pgy.notes.get`
- 找博主: `xiaohongshu.users.get`, `xiaohongshu.users.notes.list`, `xiaohongshu.pgy.creators.search`, `xiaohongshu.pgy.creators.get`, `xiaohongshu.users.search`, `xiaohongshu.pgy.creators.audience.get`, `xiaohongshu.pgy.creators.metrics`, `xiaohongshu.pgy.creators.notes.list`, `xiaohongshu.pgy.creators.followers.history`, `xiaohongshu.pgy.creators.related`, `xiaohongshu.pgy.creators.costs.metrics`, `xiaohongshu.pgy.creators.followers.metrics`, `xiaohongshu.pgy.creators.costs.history`, `xiaohongshu.pgy.notes.get`
- 热点研究: `xiaohongshu.trends.list`, `xiaohongshu.images.search`, `xiaohongshu.topics.notes.list`, `xiaohongshu.topics.get`, `xiaohongshu.keywords.related`, `xiaohongshu.pgy.keywords.history`, `xiaohongshu.pgy.keywords.related`, `xiaohongshu.pgy.notes.trending`
- 选品定价: `xiaohongshu.shop.products.search`, `xiaohongshu.shop.products.reviews.list`, `xiaohongshu.shop.products.get`
- 视频转文字: `xiaohongshu.videos.get`
