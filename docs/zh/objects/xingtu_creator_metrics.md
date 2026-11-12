# XingtuCreatorMetrics

> 星图达人视频的表现：播放、互动、完播，以及预估千次播放成本和单次互动成本。

网页版：https://okdata.online/zh/docs/objects/xingtu_creator_metrics/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `creator_id` | string | 星图达人 ID。 |
| `videos` | integer \| null | 期间视频数。 |
| `median_views` | integer \| null | 视频播放中位数。 |
| `average_likes` | integer \| null | 视频平均点赞。 |
| `average_comments` | integer \| null | 视频平均评论。 |
| `average_shares` | integer \| null | 视频平均分享。 |
| `engagement_rate` | number \| null | 互动率，0 到 1。 |
| `engagement_rate_percentile` | number \| null | 互动率超过的同类达人比例，0 到 1。 |
| `completion_rate` | number \| null | 完播率，0 到 1。 |
| `completion_rate_percentile` | number \| null | 完播率超过的同类达人比例，0 到 1。 |
| `currency` | string \| null | 下面成本的货币（ISO 4217）。 |
| `cpm_integrated` | number \| null | 植入视频的预估千次播放成本。 |
| `cpm_custom` | number \| null | 定制视频的预估千次播放成本。 |
| `cpe_integrated` | number \| null | 植入视频的预估单次互动成本。 |
| `cpe_custom` | number \| null | 定制视频的预估单次互动成本。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 返回 XingtuCreatorMetrics 的接口

- [抖音星图达人传播数据](https://okdata.online/zh/apis/douyin/xingtu/creators/metrics/) (`douyin.xingtu.creators.metrics`): $0.004/次
