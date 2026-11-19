# 速卖通 API

> 商品搜索和买家评价，价格以美元计。

网页版：https://okdata.online/zh/apis/aliexpress/

3 个接口，每次 $0.002 到 $0.002。地区：海外。不需要速卖通账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [速卖通商品搜索](https://okdata.online/zh/apis/aliexpress/products/search/) | `aliexpress.products.search` | Product[] | $0.002/次 · 每页约 20 个商品 |
| [速卖通商品详情](https://okdata.online/zh/apis/aliexpress/products/get/) | `aliexpress.products.get` | Product | $0.002/次 |
| [速卖通商品评价](https://okdata.online/zh/apis/aliexpress/products/reviews/list/) | `aliexpress.products.reviews.list` | Review[] | $0.002/次 · 每页约 20 条评价 |

## 适合做什么

- 选品定价: `aliexpress.products.search`, `aliexpress.products.get`, `aliexpress.products.reviews.list`
- 竞品监控: `aliexpress.products.search`
- 口碑分析: `aliexpress.products.reviews.list`
