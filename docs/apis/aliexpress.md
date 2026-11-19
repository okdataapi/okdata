# AliExpress API

> Product search and buyer reviews, priced in US dollars.

Canonical page: https://okdata.online/apis/aliexpress/

3 endpoints, $0.002 to $0.002 per call. Region: Global. No AliExpress login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [AliExpress product search](https://okdata.online/apis/aliexpress/products/search/) | `aliexpress.products.search` | Product[] | $0.002 per call · about 20 products per page |
| [AliExpress product details](https://okdata.online/apis/aliexpress/products/get/) | `aliexpress.products.get` | Product | $0.002 per call |
| [AliExpress product reviews](https://okdata.online/apis/aliexpress/products/reviews/list/) | `aliexpress.products.reviews.list` | Review[] | $0.002 per call · about 20 reviews per page |

## Good for

- Product research: `aliexpress.products.search`, `aliexpress.products.get`, `aliexpress.products.reviews.list`
- Competitor monitoring: `aliexpress.products.search`
- Word of mouth: `aliexpress.products.reviews.list`
