# XingtuCampaign

> 星图上达人和品牌可以报名的营销活动。

网页版：https://okdata.online/zh/docs/objects/xingtu_campaign/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 活动 ID。 |
| `name` | string | 活动名称。 |
| `description` | string \| null | 活动介绍。 |
| `category` | string \| null | 活动类型：平台活动、电商节点、节日热点、创意营销或行业活动。 |
| `stage` | string \| null | 活动阶段：筹备中、报名中、进行中或已结束。 |
| `signup_starts_at` | string \| null | 报名开始时间。 |
| `signup_ends_at` | string \| null | 报名截止时间。 |
| `starts_at` | string \| null | 活动开始时间。 |
| `ends_at` | string \| null | 活动结束时间。 |
| `image_url` | string \| null | 活动主图。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 返回 XingtuCampaign 的接口

- [抖音星图营销活动日历](https://okdata.online/zh/apis/douyin/xingtu/campaigns/list/) (`douyin.xingtu.campaigns.list`): $0.004/次 · 每页约 40 条结果
