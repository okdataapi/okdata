# PgyCreatorCosts

> 与蒲公英达人合作的预估成本（每曝光、互动、阅读、进店），以及中位数、同类排名和响应情况。

网页版：https://okdata.online/zh/docs/objects/pgy_creator_costs/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `creator_id` | string | 蒲公英达人 ID。 |
| `date` | string \| null | 数据所属日期：中国时间（UTC+8）的一个自然日，写成该日期的 UTC 零点。 |
| `currency` | string \| null | 成本的货币（ISO 4217）。 |
| `image_cpm` | number \| null | 图文笔记的预估千次曝光成本（CPM）（元）；蒲公英没有估值时为 null。 |
| `image_cpm_percentile` | number \| null | 图文笔记千次曝光成本（CPM）高于该达人的同类达人比例，0 到 1。 |
| `video_cpm` | number \| null | 视频笔记的预估千次曝光成本（CPM）（元）；蒲公英没有估值时为 null。 |
| `video_cpm_percentile` | number \| null | 视频笔记千次曝光成本（CPM）高于该达人的同类达人比例，0 到 1。 |
| `image_cpe` | number \| null | 图文笔记的预估单次互动成本（元）；蒲公英没有估值时为 null。 |
| `image_cpe_percentile` | number \| null | 图文笔记单次互动成本高于该达人的同类达人比例，0 到 1。 |
| `video_cpe` | number \| null | 视频笔记的预估单次互动成本（元）；蒲公英没有估值时为 null。 |
| `video_cpe_percentile` | number \| null | 视频笔记单次互动成本高于该达人的同类达人比例，0 到 1。 |
| `image_read_cost` | number \| null | 图文笔记的预估单次阅读成本（元）；蒲公英没有估值时为 null。 |
| `image_read_cost_percentile` | number \| null | 图文笔记单次阅读成本高于该达人的同类达人比例，0 到 1。 |
| `video_read_cost` | number \| null | 视频笔记的预估单次阅读成本（元）；蒲公英没有估值时为 null。 |
| `video_read_cost_percentile` | number \| null | 视频笔记单次阅读成本高于该达人的同类达人比例，0 到 1。 |
| `image_shop_visit_cost` | number \| null | 图文笔记的预估单个进店访客成本（元）；蒲公英没有估值时为 null。 |
| `image_shop_visit_cost_percentile` | number \| null | 图文笔记单个进店访客成本高于该达人的同类达人比例，0 到 1。 |
| `video_shop_visit_cost` | number \| null | 视频笔记的预估单个进店访客成本（元）；蒲公英没有估值时为 null。 |
| `video_shop_visit_cost_percentile` | number \| null | 视频笔记单个进店访客成本高于该达人的同类达人比例，0 到 1。 |
| `median_impressions` | integer \| null | 笔记曝光中位数。 |
| `median_impressions_percentile` | number \| null | 曝光中位数超过的同类达人比例，0 到 1。 |
| `median_reads` | integer \| null | 笔记阅读中位数。 |
| `median_reads_percentile` | number \| null | 阅读中位数超过的同类达人比例，0 到 1。 |
| `median_engagements` | integer \| null | 笔记互动中位数。 |
| `median_engagements_percentile` | number \| null | 互动中位数超过的同类达人比例，0 到 1。 |
| `median_shop_visits` | integer \| null | 笔记带来进店人数的中位数。 |
| `median_shop_visits_percentile` | number \| null | 进店人数中位数超过的同类达人比例，0 到 1。 |
| `follower_growth` | number \| null | 近 30 天粉丝增长率：0.037 即增长 3.7%；掉粉时为负数。 |
| `follower_growth_percentile` | number \| null | 粉丝增长率超过的同类达人比例，0 到 1。 |
| `invite_reply_rate` | number \| null | 48 小时内回复合作邀约的比例，0 到 1。 |
| `easy_to_reach` | boolean \| null | 蒲公英是否标注「好联系」。 |
| `active_days_7d` | integer \| null | 近 7 天活跃天数。 |
| `is_active` | boolean \| null | 蒲公英是否标注「活跃」。 |
| `notes_30d` | integer \| null | 近 30 天发布的笔记数，日常和合作都算。 |
| `highlight` | string \| null | 蒲公英标注的达人亮点，平台原文；没有时为 null。 |
| `highlight_reason` | string \| null | 蒲公英给出的亮点理由，平台原文。 |
| `content_mix` | CategoryShare[] \| null | 达人笔记的内容类目占比，从大到小。 |
| `industries` | string[] \| null | 达人合作过的行业，平台原文。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### CategoryShare

| 字段 | 类型 | 说明 |
|---|---|---|
| `category` | string | 内容类目，平台原文。 |
| `share` | number \| null | 该类目在达人笔记中的占比，0 到 1。 |

## 返回 PgyCreatorCosts 的接口

- [小红书蒲公英达人合作成本概览](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/costs/metrics/) (`xiaohongshu.pgy.creators.costs.metrics`): $0.04/次
