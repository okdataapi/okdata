# KeywordHistory

> A keyword's index on a platform's trend tool, day by day.

Canonical page: https://okdata.online/docs/objects/keyword_history/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `keyword` | string | The keyword. |
| `points` | KeywordPoint[] | One entry a day, oldest first. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### KeywordPoint

| Field | Type | Description |
|---|---|---|
| `date` | string | The day: a calendar day in China time (UTC+8), written as 00:00 UTC of that date. |
| `search_index` | integer \| null | That day's search index: the platform's measure of search interest, not a count of searches. |
| `composite_index` | integer \| null | That day's composite index: the platform's measure of attention to content about the keyword, not a count. |
| `notes` | integer \| null | Posts about the keyword that day. |
| `impressions` | integer \| null | Times those posts were shown that day. |
| `views` | integer \| null | Times those posts were read that day. |
| `engagements` | integer \| null | Interactions with those posts that day. |

## Endpoints that return a KeywordHistory

- [Douyin index: keyword trends](https://okdata.online/apis/douyin/index/keywords/history/) (`douyin.index.keywords.history`): $0.006 per call · about 1 results per page
- [Xiaohongshu PGY keyword search index](https://okdata.online/apis/xiaohongshu/pgy/keywords/history/) (`xiaohongshu.pgy.keywords.history`): $0.04 per call
- [WeChat Index](https://okdata.online/apis/wechat/index/keywords/history/) (`wechat.index.keywords.history`): $0.15 per call · about 1 results per page
