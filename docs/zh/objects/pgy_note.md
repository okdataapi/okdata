# PgyNote

> 蒲公英里的一篇笔记：正文、图片、达人、合作品牌和数据。

网页版：https://okdata.online/zh/docs/objects/pgy_note/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 笔记 ID。 |
| `url` | string \| null | 笔记链接，带可直接打开的访问令牌。 |
| `type` | string \| null | 图文笔记或视频笔记。 |
| `title` | string \| null | 笔记标题。 |
| `text` | string \| null | 笔记正文。 |
| `published_at` | string \| null | 发布时间。 |
| `images` | string[] \| null | 图片地址，按笔记顺序。 |
| `creator_id` | string \| null | 达人的蒲公英 ID。 |
| `creator_name` | string \| null | 达人昵称。 |
| `brand` | string \| null | 报备的合作品牌，平台原文；非报备合作笔记为 null。 |
| `brand_id` | string \| null | 该品牌的小红书账号 ID；没有时为 null。 |
| `metrics` | PgyNoteMetrics | 蒲公英给出的笔记数据。 |
| `component_clicks` | PgyComponentClicks \| null | 品牌组件的点击率档位；没有时为 null。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### PgyNoteMetrics

| 字段 | 类型 | 说明 |
|---|---|---|
| `impressions` | integer \| null | 曝光数。 |
| `views` | integer \| null | 阅读数。 |
| `likes` | integer \| null | 点赞数。 |
| `favorites` | integer \| null | 收藏数。 |
| `comments` | integer \| null | 评论数。 |
| `shares` | integer \| null | 分享数。 |
| `follows` | integer \| null | 笔记带来的新增关注。 |

### PgyComponentClicks

| 字段 | 类型 | 说明 |
|---|---|---|
| `comment_area` | string \| null | 评论区组件的点击率档位：normal（2% 以下）、high（2%-10%）或 very_high（10% 以上）；没有该组件时为 null。 |
| `content` | string \| null | 正文组件的点击率档位：normal（2% 以下）、high（2%-10%）或 very_high（10% 以上）；没有该组件时为 null。 |
| `note_bottom` | string \| null | 笔记底部组件的点击率档位：normal（2% 以下）、high（2%-10%）或 very_high（10% 以上）；没有该组件时为 null。 |

## 返回 PgyNote 的接口

- [小红书蒲公英笔记数据](https://okdata.online/zh/apis/xiaohongshu/pgy/notes/get/) (`xiaohongshu.pgy.notes.get`): $0.04/次
