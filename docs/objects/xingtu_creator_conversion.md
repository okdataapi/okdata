# XingtuCreatorConversion

> How well a Xingtu creator's product videos sell, as Xingtu bands it.

Canonical page: https://okdata.online/docs/objects/xingtu_creator_conversion/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `creator_id` | string | Xingtu creator ID. |
| `videos` | integer \| null | Videos counted: those that carry products. |
| `median_views` | integer \| null | Median views of those videos. |
| `products` | integer \| null | Products recommended. |
| `currency` | string \| null | Currency of the money bands (ISO 4217). |
| `sales_range` | string \| null | Band of the average sales of a video, in the platform's words. |
| `gpm_range` | string \| null | Band of sales per thousand views (GPM), in the platform's words. |
| `product_price_range` | string \| null | Band of the prices of the products recommended, in the platform's words. |
| `click_cost_range` | string \| null | Band of the cost per click (CPC), in the platform's words. |
| `clicks_range` | string \| null | Band of clicks on a video's product link, in the platform's words. |
| `click_rate_range` | string \| null | Band of the click rate of a video's product link, in the platform's words. |
| `categories` | SalesCategory[] \| null | One entry per category of goods sold. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### SalesCategory

| Field | Type | Description |
|---|---|---|
| `name` | string | The category of goods, in the platform's words. |
| `share` | number \| null | The category's share, 0 to 1. |
| `sales_range` | string \| null | Band of the category's sales, in the platform's words. |

## Endpoints that return a XingtuCreatorConversion

- [Douyin Xingtu creator conversion](https://okdata.online/apis/douyin/xingtu/creators/conversion/get/) (`douyin.xingtu.creators.conversion.get`): $0.004 per call
