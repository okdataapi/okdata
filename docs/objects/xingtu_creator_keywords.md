# XingtuCreatorKeywords

> The words that come up most in a Xingtu creator's content.

Canonical page: https://okdata.online/docs/objects/xingtu_creator_keywords/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `creator_id` | string | Xingtu creator ID. |
| `keywords` | CreatorKeyword[] | One entry per keyword. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### CreatorKeyword

| Field | Type | Description |
|---|---|---|
| `keyword` | string | The keyword. |
| `mentions` | integer \| null | How often the marketplace counted it; small numbers, good for ordering only. |

## Endpoints that return a XingtuCreatorKeywords

- [Douyin Xingtu creator keywords](https://okdata.online/apis/douyin/xingtu/creators/keywords/get/) (`douyin.xingtu.creators.keywords.get`): $0.002 per call
