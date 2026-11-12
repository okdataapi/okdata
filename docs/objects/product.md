# Product

> A product in a platform shop: price, units sold, rating and shop.

Canonical page: https://okdata.online/docs/objects/product/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | Product ID in the shop. |
| `url` | string | Product page. |
| `title` | string | Product title. |
| `price` | number \| null | Current price (the lowest variant), in the currency given. |
| `original_price` | number \| null | List price before discount, where shown. |
| `currency` | string \| null | ISO 4217 currency code. |
| `sold` | integer \| null | Units sold, as the shop shows it. |
| `rating` | number \| null | Average stars, 0 to 5. |
| `reviews` | integer \| null | Number of reviews. |
| `images` | string[] \| null | Product image URLs. |
| `shop` | ShopRef | Who sells it. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### ShopRef

| Field | Type | Description |
|---|---|---|
| `id` | string \| null | Shop or seller ID. |
| `name` | string \| null | Shop name. |
| `url` | string \| null | Shop page. |

## Endpoints that return a Product

- [TikTok Shop product search](https://okdata.online/apis/tiktok/shop/products/search/) (`tiktok.shop.products.search`): $0.004 per call · about 20 products per page
- [TikTok Shop product detail](https://okdata.online/apis/tiktok/shop/products/get/) (`tiktok.shop.products.get`): $0.002 per call
- [Xiaohongshu shop product search](https://okdata.online/apis/xiaohongshu/shop/products/search/) (`xiaohongshu.shop.products.search`): $0.02 per call · about 20 products per page
- [Xiaohongshu shop product detail](https://okdata.online/apis/xiaohongshu/shop/products/get/) (`xiaohongshu.shop.products.get`): $0.02 per call
- [TikTok Shop seller products](https://okdata.online/apis/tiktok/shop/sellers/products/list/) (`tiktok.shop.sellers.products.list`): $0.002 per call · about 20 products per page
