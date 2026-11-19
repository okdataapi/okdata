# Taobao & Tmall API

> Product search, details with SKUs, buyer reviews and a shop's products.

Canonical page: https://okdata.online/apis/taobao/

4 endpoints, $0.033 to $0.043 per call. Region: Mainland China. No Taobao & Tmall login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Taobao product search](https://okdata.online/apis/taobao/products/search/) | `taobao.products.search` | Product[] | $0.043 per call · about 10 products per page |
| [Taobao product details](https://okdata.online/apis/taobao/products/get/) | `taobao.products.get` | Product | $0.033 per call |
| [Taobao product reviews](https://okdata.online/apis/taobao/products/reviews/list/) | `taobao.products.reviews.list` | Review[] | $0.043 per call · about 20 reviews per page |
| [Taobao shop products](https://okdata.online/apis/taobao/shops/products/list/) | `taobao.shops.products.list` | Product[] | $0.043 per call · about 60 products per page |

## Good for

- Product research: `taobao.products.search`, `taobao.products.get`, `taobao.products.reviews.list`, `taobao.shops.products.list`
- Competitor monitoring: `taobao.products.search`, `taobao.products.get`, `taobao.shops.products.list`
- Word of mouth: `taobao.products.reviews.list`
