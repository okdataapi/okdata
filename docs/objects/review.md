# Review

> A buyer's review of a product: stars, text and the variant bought.

Canonical page: https://okdata.online/docs/objects/review/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | Review ID. |
| `product_id` | string | ID of the product reviewed. |
| `rating` | number \| null | Stars, 1 to 5. |
| `text` | string | Review text; empty when the buyer left only stars. |
| `published_at` | string \| null | When it was posted, ISO 8601 in UTC (a day for platforms that show only the date). |
| `author_name` | string \| null | Reviewer name as the shop shows it, often masked. |
| `variant` | string \| null | The variant bought. |
| `images` | string[] \| null | Photos attached to the review. |
| `likes` | integer \| null | Likes on the review. |
| `verified_purchase` | boolean \| null | Whether the shop marks it as a verified purchase. |

## Endpoints that return a Review

- [TikTok Shop product reviews](https://okdata.online/apis/tiktok/shop/products/reviews/list/) (`tiktok.shop.products.reviews.list`): $0.002 per call · about 20 reviews per page
- [Xiaohongshu shop product reviews](https://okdata.online/apis/xiaohongshu/shop/products/reviews/list/) (`xiaohongshu.shop.products.reviews.list`): $0.02 per call · about 12 reviews per page
