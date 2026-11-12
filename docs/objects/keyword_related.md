# KeywordRelated

> A keyword related to the one asked about, how it is related and how big it is.

Canonical page: https://okdata.online/docs/objects/keyword_related/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `keyword` | string | The related keyword. |
| `related_to` | string | The keyword asked about. |
| `relation` | string \| null | How it relates: searched together (query), appears together in content (posts), searched before (prior) or after (after), or suggested as you type (suggestion). |
| `rank` | integer \| null | Position among the keywords of the same relation, from 1. |
| `relevance` | number \| null | How closely it is related, 0 to 1. |
| `search_index` | integer \| null | Its search index (the platform's measure, not a count); null where the platform gives none. |
| `composite_index` | integer \| null | Its composite index (the platform's measure of attention, not a count). |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Endpoints that return a KeywordRelated

- [Douyin search suggestions](https://okdata.online/apis/douyin/keywords/related/) (`douyin.keywords.related`): $0.02 per call · about 10 results per page
- [Douyin index: related keywords](https://okdata.online/apis/douyin/index/keywords/related/) (`douyin.index.keywords.related`): $0.002 per call · about 170 results per page
- [Xiaohongshu search suggestions](https://okdata.online/apis/xiaohongshu/keywords/related/) (`xiaohongshu.keywords.related`): $0.02 per call · about 10 results per page
- [Xiaohongshu PGY related keywords](https://okdata.online/apis/xiaohongshu/pgy/keywords/related/) (`xiaohongshu.pgy.keywords.related`): $0.04 per call · about 98 results per page
- [WeChat Search suggestions](https://okdata.online/apis/wechat/keywords/related/) (`wechat.keywords.related`): $0.15 per call · about 9 results per page
