# Xianyu (Goofish) API

> Second-hand listings: search, asking prices and sellers.

Canonical page: https://okdata.online/apis/xianyu/

2 endpoints, $0.022 to $0.022 per call. Region: Mainland China. No Xianyu (Goofish) login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Xianyu listing search](https://okdata.online/apis/xianyu/products/search/) | `xianyu.products.search` | Product[] | $0.022 per call · about 10 products per page |
| [Xianyu listing details](https://okdata.online/apis/xianyu/products/get/) | `xianyu.products.get` | Product | $0.022 per call |

## Good for

- Product research: `xianyu.products.search`, `xianyu.products.get`
- Trend research: `xianyu.products.search`
