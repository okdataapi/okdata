# 1688 API

> China's wholesale marketplace: offers, tiered prices, suppliers and buyer reviews.

Canonical page: https://okdata.online/apis/alibaba_1688/

4 endpoints, $0.022 to $0.022 per call. Region: Mainland China. No 1688 login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [1688 product search](https://okdata.online/apis/alibaba_1688/products/search/) | `alibaba_1688.products.search` | Product[] | $0.022 per call · about 20 products per page |
| [1688 product details](https://okdata.online/apis/alibaba_1688/products/get/) | `alibaba_1688.products.get` | Product | $0.022 per call |
| [1688 product reviews](https://okdata.online/apis/alibaba_1688/products/reviews/list/) | `alibaba_1688.products.reviews.list` | Review[] | $0.022 per call · about 10 reviews per page |
| [1688 supplier products](https://okdata.online/apis/alibaba_1688/shops/products/list/) | `alibaba_1688.shops.products.list` | Product[] | $0.022 per call · about 20 products per page |

## Good for

- Product research: `alibaba_1688.products.search`, `alibaba_1688.products.get`, `alibaba_1688.products.reviews.list`, `alibaba_1688.shops.products.list`
- Competitor monitoring: `alibaba_1688.products.search`, `alibaba_1688.shops.products.list`
- Word of mouth: `alibaba_1688.products.reviews.list`
