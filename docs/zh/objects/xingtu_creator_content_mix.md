# XingtuCreatorContentMix

> 星图达人视频的内容类目分布。

网页版：https://okdata.online/zh/docs/objects/xingtu_creator_content_mix/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `creator_id` | string | 星图达人 ID。 |
| `categories` | ContentShare[] | 每个类目一条。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### ContentShare

| 字段 | 类型 | 说明 |
|---|---|---|
| `name` | string | 内容类目，平台原文。 |
| `share` | number \| null | 该类目在所统计视频中的占比，0 到 1。 |
| `videos` | integer \| null | 该类目的视频数。 |

## 返回 XingtuCreatorContentMix 的接口

- [抖音星图达人内容分布](https://okdata.online/zh/apis/douyin/xingtu/creators/content_mix/get/) (`douyin.xingtu.creators.content_mix.get`): $0.004/次
