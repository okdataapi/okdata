# PgyCreatorPost

> A note of a PGY creator with its sponsorship and figures.

Canonical page: https://okdata.online/docs/objects/pgy_creator_post/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | Note ID. |
| `title` | string \| null | The note's title. |
| `type` | string \| null | Image note or video note. |
| `published_at` | string \| null | Publication day, as 00:00 China time (the platform gives the day only). |
| `cover_url` | string \| null | Cover image. |
| `is_sponsored` | boolean \| null | Whether it was made for a brand (see brand). |
| `brand` | string \| null | The brand it was made for, in the platform's words; null when not sponsored. |
| `is_promoted` | boolean \| null | Whether paid promotion sent traffic to it (含推广流量); not the same as sponsored. |
| `metrics` | PgyPostMetrics | The note's figures. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### PgyPostMetrics

| Field | Type | Description |
|---|---|---|
| `views` | integer \| null | Reads. |
| `likes` | integer \| null | Likes. |
| `favorites` | integer \| null | Saves. |
| `shop_visits` | integer \| null | Shop visitors the note brought (cross-domain sponsored notes only; 0 for others). |

## Endpoints that return a PgyCreatorPost

- [Xiaohongshu PGY creator notes](https://okdata.online/apis/xiaohongshu/pgy/creators/notes/list/) (`xiaohongshu.pgy.creators.notes.list`): $0.04 per call · about 8 notes per page
