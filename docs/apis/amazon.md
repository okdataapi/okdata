# Amazon API

> Product search, details, reviews and Best Sellers lists, in 22 Amazon stores.

Canonical page: https://okdata.online/apis/amazon/

4 endpoints, $0.006 to $0.006 per call. Region: Global. No Amazon login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Amazon product search](https://okdata.online/apis/amazon/products/search/) | `amazon.products.search` | Product[] | $0.006 per call · about 48 products per page |
| [Amazon product details](https://okdata.online/apis/amazon/products/get/) | `amazon.products.get` | Product | $0.006 per call |
| [Amazon product reviews](https://okdata.online/apis/amazon/products/reviews/list/) | `amazon.products.reviews.list` | Review[] | $0.006 per call · about 10 reviews per page |
| [Amazon Best Sellers](https://okdata.online/apis/amazon/bestsellers/list/) | `amazon.bestsellers.list` | Product[] | $0.006 per call · about 50 products per page |

## Good for

- Product research: `amazon.products.search`, `amazon.products.get`, `amazon.products.reviews.list`, `amazon.bestsellers.list`
- Competitor monitoring: `amazon.products.search`, `amazon.products.get`
- Word of mouth: `amazon.products.reviews.list`
- Trend research: `amazon.bestsellers.list`
