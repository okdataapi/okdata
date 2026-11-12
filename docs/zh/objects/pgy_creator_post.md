# PgyCreatorPost

> 蒲公英达人的一篇笔记，带合作信息和数据。

网页版：https://okdata.online/zh/docs/objects/pgy_creator_post/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 笔记 ID。 |
| `title` | string \| null | 笔记标题。 |
| `type` | string \| null | 图文笔记或视频笔记。 |
| `published_at` | string \| null | 发布日，写成中国时间当天零点（平台只给日期）。 |
| `cover_url` | string \| null | 封面图。 |
| `is_sponsored` | boolean \| null | 是否为品牌合作笔记（见 brand）。 |
| `brand` | string \| null | 合作品牌，平台原文；非合作笔记为 null。 |
| `is_promoted` | boolean \| null | 是否含推广流量；与是否为合作笔记无关。 |
| `metrics` | PgyPostMetrics | 笔记数据。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### PgyPostMetrics

| 字段 | 类型 | 说明 |
|---|---|---|
| `views` | integer \| null | 阅读数。 |
| `likes` | integer \| null | 点赞数。 |
| `favorites` | integer \| null | 收藏数。 |
| `shop_visits` | integer \| null | 笔记带来的进店人数（仅跨域合作笔记有，其余为 0）。 |

## 返回 PgyCreatorPost 的接口

- [小红书蒲公英达人笔记](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/notes/list/) (`xiaohongshu.pgy.creators.notes.list`): $0.04/次 · 每页约 8 篇笔记
