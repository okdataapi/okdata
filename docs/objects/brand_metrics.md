# BrandMetrics

> A brand's average indexes over a period, with its industry's averages to compare.

Canonical page: https://okdata.online/docs/objects/brand_metrics/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `brand` | string | The brand's name. |
| `category` | string \| null | The industry the platform files the brand under, in its words. |
| `search_index` | integer \| null | Daily average search index over the period. |
| `content_index` | integer \| null | Daily average content index over the period. |
| `spread_index` | integer \| null | Daily average spread index over the period. |
| `benchmarks` | BrandBenchmark[] \| null | The same averages for the whole industry and for its leading brands. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### BrandBenchmark

| Field | Type | Description |
|---|---|---|
| `scope` | string | Which brands the average is over: the whole industry, or its top 3, 5, 10, 15 or 30. |
| `search_index` | integer \| null | Their daily average search index. |
| `content_index` | integer \| null | Their daily average content index. |
| `spread_index` | integer \| null | Their daily average spread index. |

## Endpoints that return a BrandMetrics

- [Douyin index: brand vs industry](https://okdata.online/apis/douyin/index/brands/metrics/) (`douyin.index.brands.metrics`): $0.002 per call
