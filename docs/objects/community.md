# Community

> A community or group on a platform, such as a subreddit or an X community.

Canonical page: https://okdata.online/docs/objects/community/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | ID; pass it as is to the endpoints that take one. |
| `name` | string | Name of the community. |
| `url` | string \| null | Link to the community. |
| `description` | string \| null | What the community says it is about. |
| `avatar_url` | string \| null | Icon of the community. |
| `nsfw` | boolean \| null | Whether it is marked as adult content. |
| `created_at` | string \| null | When the community was created. |
| `metrics` | CommunityMetrics | Counts at fetch time. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### CommunityMetrics

| Field | Type | Description |
|---|---|---|
| `members` | integer \| null | Members. |

## Endpoints that return a Community

- [X community profile](https://okdata.online/apis/x/communities/get/) (`x.communities.get`): $0.0004 per call
