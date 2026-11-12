# PgyCreatorFollowers

> A PGY creator's follower count, growth and how many followers are active, engaged, reading and buying.

Canonical page: https://okdata.online/docs/objects/pgy_creator_followers/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `creator_id` | string | PGY creator ID. |
| `followers` | integer \| null | Followers. |
| `gained` | integer \| null | Net followers gained over the last 30 days; negative when followers were lost. |
| `growth` | number \| null | Follower growth over the last 30 days: 0.008 is 0.8% more. |
| `growth_percentile` | number \| null | Share of comparable creators this one beats on follower growth, 0 to 1. |
| `active_followers` | integer \| null | Active followers: active on Xiaohongshu in the last 28 days. |
| `active_share` | number \| null | Active followers as a share of all followers, 0 to 1. |
| `active_percentile` | number \| null | Share of comparable creators this one beats on share of active followers, 0 to 1. |
| `engaged_followers` | integer \| null | Engaged followers: interacted with the creator's notes in the last 30 days. |
| `engaged_share` | number \| null | Engaged followers as a share of all followers, 0 to 1. |
| `engaged_percentile` | number \| null | Share of comparable creators this one beats on share of engaged followers, 0 to 1. |
| `reading_followers` | integer \| null | Reading followers: read the creator's notes in the last 30 days. |
| `reading_share` | number \| null | Reading followers as a share of all followers, 0 to 1. |
| `reading_percentile` | number \| null | Share of comparable creators this one beats on share of reading followers, 0 to 1. |
| `buying_followers` | integer \| null | Buying followers: bought something on Xiaohongshu in the last 30 days. |
| `buying_share` | number \| null | Buying followers as a share of all followers, 0 to 1. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Endpoints that return a PgyCreatorFollowers

- [Xiaohongshu PGY creator follower quality](https://okdata.online/apis/xiaohongshu/pgy/creators/followers/metrics/) (`xiaohongshu.pgy.creators.followers.metrics`): $0.04 per call
