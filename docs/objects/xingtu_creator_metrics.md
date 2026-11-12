# XingtuCreatorMetrics

> How a Douyin creator's videos perform on Xingtu: views, interactions, completion, and the expected cost per thousand views and per interaction.

Canonical page: https://okdata.online/docs/objects/xingtu_creator_metrics/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `creator_id` | string | Xingtu creator ID. |
| `videos` | integer \| null | Videos in the period. |
| `median_views` | integer \| null | Median views of a video. |
| `average_likes` | integer \| null | Average likes of a video. |
| `average_comments` | integer \| null | Average comments of a video. |
| `average_shares` | integer \| null | Average shares of a video. |
| `engagement_rate` | number \| null | Interactions per view, 0 to 1. |
| `engagement_rate_percentile` | number \| null | Share of comparable creators this one beats on engagement rate, 0 to 1. |
| `completion_rate` | number \| null | Share of views watched to the end, 0 to 1. |
| `completion_rate_percentile` | number \| null | Share of comparable creators this one beats on completion rate, 0 to 1. |
| `currency` | string \| null | Currency of the costs below (ISO 4217). |
| `cpm_integrated` | number \| null | Expected cost per thousand views of an integrated video (植入视频). |
| `cpm_custom` | number \| null | Expected cost per thousand views of a custom video (定制视频). |
| `cpe_integrated` | number \| null | Expected cost per interaction of an integrated video. |
| `cpe_custom` | number \| null | Expected cost per interaction of a custom video. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Endpoints that return a XingtuCreatorMetrics

- [Douyin Xingtu creator reach](https://okdata.online/apis/douyin/xingtu/creators/metrics/) (`douyin.xingtu.creators.metrics`): $0.004 per call
