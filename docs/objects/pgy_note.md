# PgyNote

> One note as PGY shows it: text, pictures, creator, sponsoring brand and figures.

Canonical page: https://okdata.online/docs/objects/pgy_note/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | Note ID. |
| `url` | string \| null | Link to the note, with the access token that makes it open. |
| `type` | string \| null | Image note or video note. |
| `title` | string \| null | The note's title. |
| `text` | string \| null | The note's text. |
| `published_at` | string \| null | When it was published. |
| `images` | string[] \| null | Picture links in order. |
| `creator_id` | string \| null | The creator's PGY ID. |
| `creator_name` | string \| null | The creator's name. |
| `brand` | string \| null | The sponsoring brand, in the platform's words; null when it is not a reported sponsored note. |
| `brand_id` | string \| null | That brand's Xiaohongshu account ID; null when none. |
| `metrics` | PgyNoteMetrics | The note's figures on PGY. |
| `component_clicks` | PgyComponentClicks \| null | Click-through bands of the components the brand added; null when there are none. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### PgyNoteMetrics

| Field | Type | Description |
|---|---|---|
| `impressions` | integer \| null | Impressions. |
| `views` | integer \| null | Reads. |
| `likes` | integer \| null | Likes. |
| `favorites` | integer \| null | Saves. |
| `comments` | integer \| null | Comments. |
| `shares` | integer \| null | Shares. |
| `follows` | integer \| null | New followers the note brought. |

### PgyComponentClicks

| Field | Type | Description |
|---|---|---|
| `comment_area` | string \| null | Click-through band of the comment-area component: normal (under 2%), high (2-10%) or very_high (over 10%); null when the note has none. |
| `content` | string \| null | Click-through band of the in-text component: normal (under 2%), high (2-10%) or very_high (over 10%); null when the note has none. |
| `note_bottom` | string \| null | Click-through band of the component at the end of the note: normal (under 2%), high (2-10%) or very_high (over 10%); null when the note has none. |

## Endpoints that return a PgyNote

- [Xiaohongshu PGY note figures](https://okdata.online/apis/xiaohongshu/pgy/notes/get/) (`xiaohongshu.pgy.notes.get`): $0.04 per call
