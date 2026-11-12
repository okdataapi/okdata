# XingtuCreatorPost

> 星图达人的一条视频，以及星图给出的数据。

网页版：https://okdata.online/zh/docs/objects/xingtu_creator_post/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 视频 ID，抖音视频接口可直接使用。 |
| `url` | string \| null | 视频链接。 |
| `title` | string \| null | 视频文案。 |
| `published_at` | string \| null | 发布时间。 |
| `duration` | number \| null | 时长（秒）。 |
| `metrics` | XingtuPostMetrics | 视频数据。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### XingtuPostMetrics

| 字段 | 类型 | 说明 |
|---|---|---|
| `views` | integer \| null | 播放数。 |
| `likes` | integer \| null | 点赞数。 |
| `comments` | integer \| null | 评论数。 |
| `completion_rate` | number \| null | 完播率，0 到 1。 |
| `engagement_rate` | number \| null | 互动率，0 到 1。 |

## 返回 XingtuCreatorPost 的接口

- [抖音星图达人作品表现](https://okdata.online/zh/apis/douyin/xingtu/creators/videos/list/) (`douyin.xingtu.creators.videos.list`): $0.004/次 · 每页约 20 条视频
