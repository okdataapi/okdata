# PgyCreatorMetrics

> 蒲公英达人一段时间内笔记的表现：中位数、比率、同类排名和流量来源。

网页版：https://okdata.online/zh/docs/objects/pgy_creator_metrics/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `creator_id` | string | 蒲公英达人 ID。 |
| `notes` | integer \| null | 期间笔记数。 |
| `median_impressions` | integer \| null | 笔记曝光中位数。 |
| `median_reads` | integer \| null | 笔记阅读中位数。 |
| `median_engagements` | integer \| null | 笔记互动中位数。 |
| `median_likes` | integer \| null | 笔记点赞中位数。 |
| `median_favorites` | integer \| null | 笔记收藏中位数。 |
| `median_comments` | integer \| null | 笔记评论中位数。 |
| `median_shares` | integer \| null | 笔记分享中位数。 |
| `engagement_rate` | number \| null | 互动率，0 到 1。 |
| `video_completion_rate` | number \| null | 视频笔记完播率，0 到 1。 |
| `image_3s_read_rate` | number \| null | 图文笔记 3 秒阅读率，0 到 1。 |
| `hundred_like_share` | number \| null | 点赞过百的笔记占比，0 到 1。 |
| `thousand_like_share` | number \| null | 点赞过千的笔记占比，0 到 1。 |
| `impressions_percentile` | number \| null | 曝光中位数超过的同类达人比例，0 到 1。 |
| `reads_percentile` | number \| null | 阅读中位数超过的同类达人比例，0 到 1。 |
| `engagements_percentile` | number \| null | 互动中位数超过的同类达人比例，0 到 1。 |
| `video_notes` | integer \| null | 期间视频笔记数（含在 notes 内）。 |
| `video_completion_percentile` | number \| null | 视频完播率超过的同类达人比例，0 到 1。 |
| `median_follows` | integer \| null | 笔记带来新增关注的中位数。 |
| `traffic_sources` | PgyTrafficSources \| null | 笔记曝光和阅读的来源分布；每组加起来为 1。 |
| `long_term` | PgyLongTerm \| null | 约半年前笔记的长尾表现：近期和长尾阅读、同类排名和来源。 |
| `note_list` | PgyNoteFigures[] \| null | 期间笔记逐条数据，从早到晚，最多 15 条；没有时为 null。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### PgyTrafficSources

| 字段 | 类型 | 说明 |
|---|---|---|
| `impressions` | PgySourceShares \| null | 曝光的来源分布。 |
| `reads` | PgySourceShares \| null | 阅读的来源分布。 |

### PgyLongTerm

| 字段 | 类型 | 说明 |
|---|---|---|
| `published_from` | string \| null | 统计笔记的首个发布日：中国时间（UTC+8）的一个自然日，写成该日期的 UTC 零点。 |
| `published_to` | string \| null | 统计笔记的最后发布日，写法同上。 |
| `notes` | integer \| null | 这段时间发布的笔记数；为 0 时下面各项为 null。 |
| `recent_reads` | integer \| null | 笔记发布后近期的阅读数，平台给出的代表值。 |
| `recent_reads_percentile` | number \| null | 近期阅读超过的同类达人比例，0 到 1。 |
| `long_term_reads` | integer \| null | 笔记在近期之后的长尾阅读数。 |
| `long_term_reads_percentile` | number \| null | 长尾阅读超过的同类达人比例，0 到 1。 |
| `recent_sources` | PgyReadSources \| null | 近期阅读的来源分布。 |
| `long_term_sources` | PgyReadSources \| null | 长尾阅读的来源分布。 |

### PgyNoteFigures

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 笔记 ID。 |
| `title` | string \| null | 笔记标题。 |
| `type` | string \| null | 图文笔记或视频笔记。 |
| `published_at` | string \| null | 发布日，写成中国时间当天零点（平台只给日期）。 |
| `cover_url` | string \| null | 封面图。 |
| `impressions` | integer \| null | 曝光数。 |
| `reads` | integer \| null | 阅读数。 |
| `engagements` | integer \| null | 互动数。 |
| `likes` | integer \| null | 点赞数。 |
| `favorites` | integer \| null | 收藏数。 |
| `impressions_vs_median` | number \| null | 该笔记曝光相对达人同期中位数的差：0.5 即高 50%，-0.3 即低 30%。 |
| `reads_vs_median` | number \| null | 该笔记阅读相对达人同期中位数的差：0.5 即高 50%，-0.3 即低 30%。 |
| `engagements_vs_median` | number \| null | 该笔记互动相对达人同期中位数的差：0.5 即高 50%，-0.3 即低 30%。 |
| `likes_vs_median` | number \| null | 该笔记点赞相对达人同期中位数的差：0.5 即高 50%，-0.3 即低 30%。 |
| `favorites_vs_median` | number \| null | 该笔记收藏相对达人同期中位数的差：0.5 即高 50%，-0.3 即低 30%。 |

## 返回 PgyCreatorMetrics 的接口

- [小红书蒲公英达人数据表现](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/metrics/) (`xiaohongshu.pgy.creators.metrics`): $0.04/次
