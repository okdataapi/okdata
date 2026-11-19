# Review

> 买家对商品的一条评价：星级、内容和购买的款式。

网页版：https://okdata.online/zh/docs/objects/review/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 评价 ID。 |
| `product_id` | string | 被评价商品的 ID。 |
| `rating` | number \| null | 星级，1 到 5。 |
| `text` | string | 评价内容；只打星没写字时为空字符串。 |
| `translation` | string \| null | 商城给出的英文译文；商城没给译文时为 null。 |
| `published_at` | string \| null | 发布时间，ISO 8601，UTC（平台只显示日期的为当天）。 |
| `author_name` | string \| null | 商城显示的评价人昵称，常为打码。 |
| `variant` | string \| null | 购买的款式规格。 |
| `images` | string[] \| null | 晒图地址。 |
| `likes` | integer \| null | 评价的点赞数。 |
| `verified_purchase` | boolean \| null | 商城是否标为已验证购买。 |

## 返回 Review 的接口

- [TikTok Shop 商品评价](https://okdata.online/zh/apis/tiktok/shop/products/reviews/list/) (`tiktok.shop.products.reviews.list`): $0.002/次 · 每页约 20 条评价
- [小红书商城商品评价](https://okdata.online/zh/apis/xiaohongshu/shop/products/reviews/list/) (`xiaohongshu.shop.products.reviews.list`): $0.02/次 · 每页约 12 条评价
- [亚马逊商品评论](https://okdata.online/zh/apis/amazon/products/reviews/list/) (`amazon.products.reviews.list`): $0.006/次 · 每页约 10 条评价
- [速卖通商品评价](https://okdata.online/zh/apis/aliexpress/products/reviews/list/) (`aliexpress.products.reviews.list`): $0.002/次 · 每页约 20 条评价
- [淘宝商品评价](https://okdata.online/zh/apis/taobao/products/reviews/list/) (`taobao.products.reviews.list`): $0.043/次 · 每页约 20 条评价
- [1688 商品评价](https://okdata.online/zh/apis/alibaba_1688/products/reviews/list/) (`alibaba_1688.products.reviews.list`): $0.022/次 · 每页约 10 条评价
- [抖音电商商品评价](https://okdata.online/zh/apis/douyin_shop/products/reviews/list/) (`douyin_shop.products.reviews.list`): $0.039/次 · 每页约 20 条评价
- [App Store 用户评论](https://okdata.online/zh/apis/app_store/apps/reviews/list/) (`app_store.apps.reviews.list`): $0.001/次 · 每页约 50 条评价
