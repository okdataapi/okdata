# XingtuCreatorPost

> A video of a Xingtu creator with the figures Xingtu shows for it.

Canonical page: https://okdata.online/docs/objects/xingtu_creator_post/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | Video ID, the one the Douyin video endpoints take. |
| `url` | string \| null | Link to the video. |
| `title` | string \| null | The video's caption. |
| `published_at` | string \| null | When it was published. |
| `duration` | number \| null | Length in seconds. |
| `metrics` | XingtuPostMetrics | The video's figures. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### XingtuPostMetrics

| Field | Type | Description |
|---|---|---|
| `views` | integer \| null | Views. |
| `likes` | integer \| null | Likes. |
| `comments` | integer \| null | Comments. |
| `completion_rate` | number \| null | Share of views watched to the end, 0 to 1. |
| `engagement_rate` | number \| null | Interactions per view, 0 to 1. |

## Endpoints that return a XingtuCreatorPost

- [Douyin Xingtu creator videos](https://okdata.online/apis/douyin/xingtu/creators/videos/list/) (`douyin.xingtu.creators.videos.list`): $0.004 per call · about 20 videos per page
