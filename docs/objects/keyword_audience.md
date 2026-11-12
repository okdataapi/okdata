# KeywordAudience

> Who searches for or reads about a keyword, by age, gender, place and interest.

Canonical page: https://okdata.online/docs/objects/keyword_audience/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `keyword` | string | The keyword. |
| `age` | KeywordSegment[] \| null | By age group. |
| `gender` | KeywordSegment[] \| null | By gender. |
| `province` | KeywordSegment[] \| null | By province. |
| `city` | KeywordSegment[] \| null | By city: the largest only, so the shares need not add up to 1. |
| `city_tier` | KeywordSegment[] \| null | By city tier. |
| `interest` | KeywordSegment[] \| null | By interest; the shares need not add up to 1. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### KeywordSegment

| Field | Type | Description |
|---|---|---|
| `label` | string | The group, in the platform's words. |
| `share` | number \| null | The group's share of the keyword's audience, 0 to 1. |
| `tgi` | number \| null | TGI: how strongly the group leans to the keyword; 100 is the platform average. |

## Endpoints that return a KeywordAudience

- [Douyin index: keyword audience](https://okdata.online/apis/douyin/index/keywords/audience/get/) (`douyin.index.keywords.audience.get`): $0.002 per call
