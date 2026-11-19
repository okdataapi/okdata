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
- [Amazon product search](https://okdata.online/apis/amazon/products/search/) (`amazon.products.search`): $0.006 per call · about 48 products per page
- [Amazon product details](https://okdata.online/apis/amazon/products/get/) (`amazon.products.get`): $0.006 per call
- [Amazon Best Sellers](https://okdata.online/apis/amazon/bestsellers/list/) (`amazon.bestsellers.list`): $0.006 per call · about 50 products per page
- [AliExpress product search](https://okdata.online/apis/aliexpress/products/search/) (`aliexpress.products.search`): $0.002 per call · about 20 products per page
- [AliExpress product details](https://okdata.online/apis/aliexpress/products/get/) (`aliexpress.products.get`): $0.002 per call
- [Taobao product search](https://okdata.online/apis/taobao/products/search/) (`taobao.products.search`): $0.043 per call · about 10 products per page
- [Taobao product details](https://okdata.online/apis/taobao/products/get/) (`taobao.products.get`): $0.033 per call
- [Taobao shop products](https://okdata.online/apis/taobao/shops/products/list/) (`taobao.shops.products.list`): $0.043 per call · about 60 products per page
- [1688 product search](https://okdata.online/apis/alibaba_1688/products/search/) (`alibaba_1688.products.search`): $0.022 per call · about 20 products per page
- [1688 product details](https://okdata.online/apis/alibaba_1688/products/get/) (`alibaba_1688.products.get`): $0.022 per call
- [1688 supplier products](https://okdata.online/apis/alibaba_1688/shops/products/list/) (`alibaba_1688.shops.products.list`): $0.022 per call · about 20 products per page
- [Xianyu listing search](https://okdata.online/apis/xianyu/products/search/) (`xianyu.products.search`): $0.022 per call · about 10 products per page
- [Xianyu listing details](https://okdata.online/apis/xianyu/products/get/) (`xianyu.products.get`): $0.022 per call
- [Douyin Shop product search](https://okdata.online/apis/douyin_shop/products/search/) (`douyin_shop.products.search`): $0.054 per call · about 30 products per page
- [Douyin Shop product details](https://okdata.online/apis/douyin_shop/products/get/) (`douyin_shop.products.get`): $0.039 per call
- [Douyin Shop store products](https://okdata.online/apis/douyin_shop/shops/products/list/) (`douyin_shop.shops.products.list`): $0.043 per call · about 10 products per page
- [App Store app details](https://okdata.online/apis/app_store/apps/get/) (`app_store.apps.get`): $0.001 per call
