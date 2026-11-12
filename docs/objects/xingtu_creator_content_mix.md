# XingtuCreatorContentMix

> What a Xingtu creator's videos are about, by content category.

Canonical page: https://okdata.online/docs/objects/xingtu_creator_content_mix/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `creator_id` | string | Xingtu creator ID. |
| `categories` | ContentShare[] | One entry per content category. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### ContentShare

| Field | Type | Description |
|---|---|---|
| `name` | string | The content category, in the platform's words. |
| `share` | number \| null | The category's share of the videos counted, 0 to 1. |
| `videos` | integer \| null | Videos in the category. |

## Endpoints that return a XingtuCreatorContentMix

- [Douyin Xingtu creator content mix](https://okdata.online/apis/douyin/xingtu/creators/content_mix/get/) (`douyin.xingtu.creators.content_mix.get`): $0.004 per call
