# Douyin Shop API

> Affiliate-marketplace products with commission rates, sales, reviews and shops.

Canonical page: https://okdata.online/apis/douyin_shop/

4 endpoints, $0.039 to $0.054 per call. Region: Mainland China. No Douyin Shop login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Douyin Shop product search](https://okdata.online/apis/douyin_shop/products/search/) | `douyin_shop.products.search` | Product[] | $0.054 per call · about 30 products per page |
| [Douyin Shop product details](https://okdata.online/apis/douyin_shop/products/get/) | `douyin_shop.products.get` | Product | $0.039 per call |
| [Douyin Shop product reviews](https://okdata.online/apis/douyin_shop/products/reviews/list/) | `douyin_shop.products.reviews.list` | Review[] | $0.039 per call · about 20 reviews per page |
| [Douyin Shop store products](https://okdata.online/apis/douyin_shop/shops/products/list/) | `douyin_shop.shops.products.list` | Product[] | $0.043 per call · about 10 products per page |

## Good for

- Product research: `douyin_shop.products.search`, `douyin_shop.products.get`, `douyin_shop.products.reviews.list`, `douyin_shop.shops.products.list`
- Creator discovery: `douyin_shop.products.search`
- Word of mouth: `douyin_shop.products.reviews.list`
- Competitor monitoring: `douyin_shop.shops.products.list`
