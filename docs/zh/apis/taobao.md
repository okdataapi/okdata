# 淘宝天猫 API

> 商品搜索、带 SKU 的详情、买家评价和店铺商品。

网页版：https://okdata.online/zh/apis/taobao/

4 个接口，每次 $0.033 到 $0.043。地区：中国大陆。不需要淘宝天猫账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [淘宝商品搜索](https://okdata.online/zh/apis/taobao/products/search/) | `taobao.products.search` | Product[] | $0.043/次 · 每页约 10 个商品 |
| [淘宝商品详情](https://okdata.online/zh/apis/taobao/products/get/) | `taobao.products.get` | Product | $0.033/次 |
| [淘宝商品评价](https://okdata.online/zh/apis/taobao/products/reviews/list/) | `taobao.products.reviews.list` | Review[] | $0.043/次 · 每页约 20 条评价 |
| [淘宝店铺商品](https://okdata.online/zh/apis/taobao/shops/products/list/) | `taobao.shops.products.list` | Product[] | $0.043/次 · 每页约 60 个商品 |

## 适合做什么

- 选品定价: `taobao.products.search`, `taobao.products.get`, `taobao.products.reviews.list`, `taobao.shops.products.list`
- 竞品监控: `taobao.products.search`, `taobao.products.get`, `taobao.shops.products.list`
- 口碑分析: `taobao.products.reviews.list`
