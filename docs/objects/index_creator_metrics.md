# IndexCreatorMetrics

> An account's daily averages on a platform's trend tool over the last week and month, and how they moved.

Canonical page: https://okdata.online/docs/objects/index_creator_metrics/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `creator_id` | string | The account's numeric ID (the one asked about). |
| `average_7d` | IndexDailyAverages \| null | Daily averages over the last 7 days. |
| `average_30d` | IndexDailyAverages \| null | Daily averages over the last 30 days. |
| `change_7d` | IndexDailyChange \| null | The last 7 days against the 7 before, as a ratio: 0.3 is 30% more. |
| `change_30d` | IndexDailyChange \| null | The last 30 days against the 30 before, as a ratio. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### IndexDailyAverages

| Field | Type | Description |
|---|---|---|
| `likes` | number \| null | New likes a day, on average. |
| `follows` | number \| null | Follows a day, on average (the platform's own count of follows, not the net change in followers). |
| `shares` | number \| null | New shares a day, on average. |
| `comments` | number \| null | New comments a day, on average. |

### IndexDailyChange

| Field | Type | Description |
|---|---|---|
| `likes` | number \| null | Change in new likes a day. |
| `follows` | number \| null | Change in follows a day (the platform's own count of follows, not the net change in followers). |
| `shares` | number \| null | Change in new shares a day. |
| `comments` | number \| null | Change in new comments a day. |

## Endpoints that return a IndexCreatorMetrics

- [Douyin index: account daily averages](https://okdata.online/apis/douyin/index/creators/metrics/) (`douyin.index.creators.metrics`): $0.002 per call
