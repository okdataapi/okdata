# XingtuCreatorConversion

> 星图达人带货视频的转化能力（星图给出的区间）。

网页版：https://okdata.online/zh/docs/objects/xingtu_creator_conversion/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `creator_id` | string | 星图达人 ID。 |
| `videos` | integer \| null | 统计的视频数：挂了商品的视频。 |
| `median_views` | integer \| null | 这些视频的播放中位数。 |
| `products` | integer \| null | 推荐的商品数。 |
| `currency` | string \| null | 金额区间的货币（ISO 4217）。 |
| `sales_range` | string \| null | 单条视频平均销售额区间，平台原文。 |
| `gpm_range` | string \| null | 千次播放成交额（GPM）区间，平台原文。 |
| `product_price_range` | string \| null | 推荐商品价格区间，平台原文。 |
| `click_cost_range` | string \| null | 单次点击成本（CPC）区间，平台原文。 |
| `clicks_range` | string \| null | 视频商品链接点击数区间，平台原文。 |
| `click_rate_range` | string \| null | 视频商品链接点击率区间，平台原文。 |
| `categories` | SalesCategory[] \| null | 每个成交类目一条。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### SalesCategory

| 字段 | 类型 | 说明 |
|---|---|---|
| `name` | string | 商品类目，平台原文。 |
| `share` | number \| null | 该类目的占比，0 到 1。 |
| `sales_range` | string \| null | 该类目的销售额区间，平台原文。 |

## 返回 XingtuCreatorConversion 的接口

- [抖音星图达人转化能力](https://okdata.online/zh/apis/douyin/xingtu/creators/conversion/get/) (`douyin.xingtu.creators.conversion.get`): $0.004/次
