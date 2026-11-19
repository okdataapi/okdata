# 闲鱼 API

> 二手商品：搜索、标价和卖家。

网页版：https://okdata.online/zh/apis/xianyu/

2 个接口，每次 $0.022 到 $0.022。地区：中国大陆。不需要闲鱼账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [闲鱼商品搜索](https://okdata.online/zh/apis/xianyu/products/search/) | `xianyu.products.search` | Product[] | $0.022/次 · 每页约 10 个商品 |
| [闲鱼商品详情](https://okdata.online/zh/apis/xianyu/products/get/) | `xianyu.products.get` | Product | $0.022/次 |

## 适合做什么

- 选品定价: `xianyu.products.search`, `xianyu.products.get`
- 热点研究: `xianyu.products.search`
