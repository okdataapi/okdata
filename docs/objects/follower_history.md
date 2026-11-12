# FollowerHistory

> A creator's follower count day by day over a period.

Canonical page: https://okdata.online/docs/objects/follower_history/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `creator_id` | string | The creator ID asked about. |
| `days` | integer | How many of the most recent days the figures cover. |
| `gained` | integer \| null | Net followers gained over the period; negative when the creator lost followers. |
| `growth` | number \| null | The net gain as a share of the followers at the start: 0.01 is 1% more. |
| `points` | FollowerPoint[] | One entry a day, oldest first. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### FollowerPoint

| Field | Type | Description |
|---|---|---|
| `date` | string | The day: a calendar day in China time (UTC+8), written as 00:00 UTC of that date. |
| `followers` | integer \| null | Followers that day. |

## Endpoints that return a FollowerHistory

- [Xiaohongshu PGY creator follower history](https://okdata.online/apis/xiaohongshu/pgy/creators/followers/history/) (`xiaohongshu.pgy.creators.followers.history`): $0.04 per call
