# Transcript

> Timed text of a video.

Canonical page: https://okdata.online/docs/objects/transcript/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `video_id` | string | ID of the video. |
| `lang` | string | Language of this transcript. |
| `segments` | Segment[] | Timed segments in order. |
| `text` | string | All segments joined as plain text. |

### Segment

| Field | Type | Description |
|---|---|---|
| `start` | number | Start, in seconds from the beginning. |
| `end` | number | End, in seconds from the beginning. |
| `text` | string | What is said in this segment. |

## Endpoints that return a Transcript

- [YouTube video transcript](https://okdata.online/apis/youtube/videos/transcript/get/) (`youtube.videos.transcript.get`): $0.004 per call
- [Instagram reel transcript](https://okdata.online/apis/instagram/posts/transcript/get/) (`instagram.posts.transcript.get`): $0.004 per call
- [Reddit video transcript](https://okdata.online/apis/reddit/posts/transcript/get/) (`reddit.posts.transcript.get`): $0.004 per call
- [TikTok video transcript](https://okdata.online/apis/tiktok/videos/transcript/get/) (`tiktok.videos.transcript.get`): $0.002 per call
