# 1688 API

> 批发货源：商品、阶梯价、供应商和采购商评价。

网页版：https://okdata.online/zh/apis/alibaba_1688/

4 个接口，每次 $0.022 到 $0.022。地区：中国大陆。不需要1688账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [1688 商品搜索](https://okdata.online/zh/apis/alibaba_1688/products/search/) | `alibaba_1688.products.search` | Product[] | $0.022/次 · 每页约 20 个商品 |
| [1688 商品详情](https://okdata.online/zh/apis/alibaba_1688/products/get/) | `alibaba_1688.products.get` | Product | $0.022/次 |
| [1688 商品评价](https://okdata.online/zh/apis/alibaba_1688/products/reviews/list/) | `alibaba_1688.products.reviews.list` | Review[] | $0.022/次 · 每页约 10 条评价 |
| [1688 店铺商品](https://okdata.online/zh/apis/alibaba_1688/shops/products/list/) | `alibaba_1688.shops.products.list` | Product[] | $0.022/次 · 每页约 20 个商品 |

## 适合做什么

- 选品定价: `alibaba_1688.products.search`, `alibaba_1688.products.get`, `alibaba_1688.products.reviews.list`, `alibaba_1688.shops.products.list`
- 竞品监控: `alibaba_1688.products.search`, `alibaba_1688.shops.products.list`
- 口碑分析: `alibaba_1688.products.reviews.list`
