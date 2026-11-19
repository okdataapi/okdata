# 抖音电商 API

> 精选联盟商品和佣金比例、销量、评价和店铺。

网页版：https://okdata.online/zh/apis/douyin_shop/

4 个接口，每次 $0.039 到 $0.054。地区：中国大陆。不需要抖音电商账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [抖音电商商品搜索](https://okdata.online/zh/apis/douyin_shop/products/search/) | `douyin_shop.products.search` | Product[] | $0.054/次 · 每页约 30 个商品 |
| [抖音电商商品详情](https://okdata.online/zh/apis/douyin_shop/products/get/) | `douyin_shop.products.get` | Product | $0.039/次 |
| [抖音电商商品评价](https://okdata.online/zh/apis/douyin_shop/products/reviews/list/) | `douyin_shop.products.reviews.list` | Review[] | $0.039/次 · 每页约 20 条评价 |
| [抖音电商店铺商品](https://okdata.online/zh/apis/douyin_shop/shops/products/list/) | `douyin_shop.shops.products.list` | Product[] | $0.043/次 · 每页约 10 个商品 |

## 适合做什么

- 选品定价: `douyin_shop.products.search`, `douyin_shop.products.get`, `douyin_shop.products.reviews.list`, `douyin_shop.shops.products.list`
- 找博主: `douyin_shop.products.search`
- 口碑分析: `douyin_shop.products.reviews.list`
- 竞品监控: `douyin_shop.shops.products.list`
