# Audience

> A creator's followers by gender, age, place, interest, device and shopping.

Canonical page: https://okdata.online/docs/objects/audience/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `creator_id` | string | The creator ID asked about. |
| `measured_at` | string \| null | The day the figures are of, as 00:00 China time. |
| `gender` | AudienceSegment[] \| null | By gender. |
| `age` | AudienceSegment[] \| null | By age group. |
| `province` | AudienceSegment[] \| null | By province. |
| `city` | AudienceSegment[] \| null | By city, the largest only. |
| `interest` | AudienceSegment[] \| null | By interest. |
| `device` | AudienceSegment[] \| null | By phone brand. |
| `city_tier` | AudienceSegment[] \| null | By city tier. |
| `crowd` | AudienceSegment[] \| null | By the consumer groups the platform sorts people into. |
| `purchase_category` | AudienceSegment[] \| null | By the category of goods bought. |
| `purchase_amount` | AudienceSegment[] \| null | By the amount spent per order. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### AudienceSegment

| Field | Type | Description |
|---|---|---|
| `name` | string | The segment, in the platform's words (genders come as lower-case English). |
| `share` | number \| null | The segment's share of the segments listed, 0 to 1. |
| `count` | integer \| null | Followers in the segment. |

## Endpoints that return a Audience

- [Douyin index: account followers](https://okdata.online/apis/douyin/index/creators/audience/get/) (`douyin.index.creators.audience.get`): $0.002 per call
- [Douyin Xingtu creator audience](https://okdata.online/apis/douyin/xingtu/creators/audience/get/) (`douyin.xingtu.creators.audience.get`): $0.004 per call
- [Xiaohongshu PGY creator audience](https://okdata.online/apis/xiaohongshu/pgy/creators/audience/get/) (`xiaohongshu.pgy.creators.audience.get`): $0.04 per call
