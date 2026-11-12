# Transcript

> 带时间戳的视频文字。

网页版：https://okdata.online/zh/docs/objects/transcript/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `video_id` | string | 视频 ID。 |
| `lang` | string | 字幕语言。 |
| `segments` | Segment[] | 按时间排列的字幕段。 |
| `text` | string | 全部字幕拼成的纯文本。 |

### Segment

| 字段 | 类型 | 说明 |
|---|---|---|
| `start` | number | 开始时间，单位秒。 |
| `end` | number | 结束时间，单位秒。 |
| `text` | string | 这一段说的话。 |

## 返回 Transcript 的接口

- [YouTube 视频字幕](https://okdata.online/zh/apis/youtube/videos/transcript/get/) (`youtube.videos.transcript.get`): $0.004/次
- [Instagram 视频字幕](https://okdata.online/zh/apis/instagram/posts/transcript/get/) (`instagram.posts.transcript.get`): $0.004/次
- [Reddit 视频字幕](https://okdata.online/zh/apis/reddit/posts/transcript/get/) (`reddit.posts.transcript.get`): $0.004/次
- [TikTok 视频字幕](https://okdata.online/zh/apis/tiktok/videos/transcript/get/) (`tiktok.videos.transcript.get`): $0.002/次
