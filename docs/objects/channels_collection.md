# ChannelsCollection

> A collection (playlist) of a WeChat Channels account.

Canonical page: https://okdata.online/docs/objects/channels_collection/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | The collection's ID; pass it as is to the endpoint that lists its videos. |
| `name` | string | Name of the collection. |
| `description` | string \| null | What the collection says it is about; null when nothing. |
| `cover_url` | string \| null | Cover image. |
| `updated_at` | string \| null | When the collection was last updated. |
| `metrics` | CollectionMetrics | Counts at fetch time. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### CollectionMetrics

| Field | Type | Description |
|---|---|---|
| `videos` | integer \| null | Videos in the collection. |

## Endpoints that return a ChannelsCollection

- [WeChat Channels account collections](https://okdata.online/apis/wechat_channels/users/collections/list/) (`wechat_channels.users.collections.list`): $0.02 per call · about 7 results per page
