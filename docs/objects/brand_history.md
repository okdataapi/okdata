# BrandHistory

> A brand's search, content and spread indexes on a platform's trend tool, day by day.

Canonical page: https://okdata.online/docs/objects/brand_history/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `brand` | string | The brand's name. |
| `category` | string \| null | The industry the platform files the brand under, in its words. |
| `points` | BrandPoint[] | One entry a day, oldest first. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### BrandPoint

| Field | Type | Description |
|---|---|---|
| `date` | string | The day: a calendar day in China time (UTC+8), written as 00:00 UTC of that date. |
| `search_index` | integer \| null | Search index: search interest in the brand, not a count of searches. |
| `content_index` | integer \| null | Content index: how much content there was about the brand, not a count of posts. |
| `spread_index` | integer \| null | Spread index: how far that content travelled, not a count. |

## Endpoints that return a BrandHistory

- [Douyin index: brand trends](https://okdata.online/apis/douyin/index/brands/history/) (`douyin.index.brands.history`): $0.002 per call
