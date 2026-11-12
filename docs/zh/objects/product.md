# Product

> 平台商城里的一个商品：价格、销量、评分和店铺。

网页版：https://okdata.online/zh/docs/objects/product/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 商品在商城里的 ID。 |
| `url` | string | 商品页面。 |
| `title` | string | 商品标题。 |
| `price` | number \| null | 现价（最低规格），单位见 currency。 |
| `original_price` | number \| null | 折前原价（有的话）。 |
| `currency` | string \| null | ISO 4217 货币代码。 |
| `sold` | integer \| null | 销量，以商城显示为准。 |
| `rating` | number \| null | 平均星级，0 到 5。 |
| `reviews` | integer \| null | 评价数。 |
| `images` | string[] \| null | 商品图片地址。 |
| `shop` | ShopRef | 卖家店铺。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### ShopRef

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string \| null | 店铺或商家 ID。 |
| `name` | string \| null | 店铺名。 |
| `url` | string \| null | 店铺页面。 |

## 返回 Product 的接口

- [TikTok Shop 商品搜索](https://okdata.online/zh/apis/tiktok/shop/products/search/) (`tiktok.shop.products.search`): $0.004/次 · 每页约 20 个商品
- [TikTok Shop 商品详情](https://okdata.online/zh/apis/tiktok/shop/products/get/) (`tiktok.shop.products.get`): $0.002/次
- [小红书商城商品搜索](https://okdata.online/zh/apis/xiaohongshu/shop/products/search/) (`xiaohongshu.shop.products.search`): $0.02/次 · 每页约 20 个商品
- [小红书商城商品详情](https://okdata.online/zh/apis/xiaohongshu/shop/products/get/) (`xiaohongshu.shop.products.get`): $0.02/次
- [TikTok Shop 店铺商品](https://okdata.online/zh/apis/tiktok/shop/sellers/products/list/) (`tiktok.shop.sellers.products.list`): $0.002/次 · 每页约 20 个商品
