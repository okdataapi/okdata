# 苹果应用商店 API

> 各国家/地区 App Store 里的应用：价格、评分、版本、开发者，还有用户最新写下的评论。

网页版：https://okdata.online/zh/apis/app_store/

2 个接口，每次 $0.001 到 $0.001。地区：海外。不需要苹果应用商店账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [App Store 应用详情](https://okdata.online/zh/apis/app_store/apps/get/) | `app_store.apps.get` | Product | $0.001/次 |
| [App Store 用户评论](https://okdata.online/zh/apis/app_store/apps/reviews/list/) | `app_store.apps.reviews.list` | Review[] | $0.001/次 · 每页约 50 条评价 |

## 适合做什么

- 选品定价: `app_store.apps.get`, `app_store.apps.reviews.list`
- 竞品监控: `app_store.apps.get`
- 口碑分析: `app_store.apps.reviews.list`
