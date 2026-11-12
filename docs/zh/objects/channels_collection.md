# ChannelsCollection

> 视频号账号的一个合集。

网页版：https://okdata.online/zh/docs/objects/channels_collection/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 合集 ID，可原样传给取合集视频的接口。 |
| `name` | string | 合集名称。 |
| `description` | string \| null | 合集简介；没有时为 null。 |
| `cover_url` | string \| null | 封面图。 |
| `updated_at` | string \| null | 最近更新时间。 |
| `metrics` | CollectionMetrics | 抓取时的数据。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### CollectionMetrics

| 字段 | 类型 | 说明 |
|---|---|---|
| `videos` | integer \| null | 合集里的视频数。 |

## 返回 ChannelsCollection 的接口

- [视频号账号合集](https://okdata.online/zh/apis/wechat_channels/users/collections/list/) (`wechat_channels.users.collections.list`): $0.02/次 · 每页约 7 条结果
