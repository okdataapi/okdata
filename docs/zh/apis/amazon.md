# 亚马逊 API

> 22 个国家站点的商品搜索、详情、评论和畅销榜。

网页版：https://okdata.online/zh/apis/amazon/

4 个接口，每次 $0.006 到 $0.006。地区：海外。不需要亚马逊账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [亚马逊商品搜索](https://okdata.online/zh/apis/amazon/products/search/) | `amazon.products.search` | Product[] | $0.006/次 · 每页约 48 个商品 |
| [亚马逊商品详情](https://okdata.online/zh/apis/amazon/products/get/) | `amazon.products.get` | Product | $0.006/次 |
| [亚马逊商品评论](https://okdata.online/zh/apis/amazon/products/reviews/list/) | `amazon.products.reviews.list` | Review[] | $0.006/次 · 每页约 10 条评价 |
| [亚马逊畅销榜](https://okdata.online/zh/apis/amazon/bestsellers/list/) | `amazon.bestsellers.list` | Product[] | $0.006/次 · 每页约 50 个商品 |

## 适合做什么

- 选品定价: `amazon.products.search`, `amazon.products.get`, `amazon.products.reviews.list`, `amazon.bestsellers.list`
- 竞品监控: `amazon.products.search`, `amazon.products.get`
- 口碑分析: `amazon.products.reviews.list`
- 热点研究: `amazon.bestsellers.list`
