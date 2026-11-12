# Topic

> A hashtag or topic page and its counts.

Canonical page: https://okdata.online/docs/objects/topic/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | ID; pass it as is to the endpoints that take one. |
| `name` | string | Name of the topic. |
| `url` | string \| null | Link to the topic page. |
| `description` | string \| null | What the topic page says it is about; null when it says nothing. |
| `metrics` | TopicMetrics | Counts at fetch time. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### TopicMetrics

| Field | Type | Description |
|---|---|---|
| `views` | integer \| null | Views of the topic page. |
| `posts` | integer \| null | Posts under the topic. |

## Endpoints that return a Topic

- [Xiaohongshu topic detail](https://okdata.online/apis/xiaohongshu/topics/get/) (`xiaohongshu.topics.get`): $0.02 per call
