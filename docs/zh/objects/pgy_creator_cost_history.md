# PgyCreatorCostHistory

> 蒲公英达人一段时间内的成本和笔记中位数，以及逐日数据。

网页版：https://okdata.online/zh/docs/objects/pgy_creator_cost_history/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `creator_id` | string | 蒲公英达人 ID。 |
| `days` | integer | 数据覆盖最近多少天。 |
| `currency` | string \| null | 成本的货币（ISO 4217）。 |
| `date` | string \| null | 数据截止日：中国时间（UTC+8）的一个自然日，写成该日期的 UTC 零点。 |
| `cpm` | number \| null | 千次曝光成本（元）；没有时为 null。 |
| `cpe` | number \| null | 单次互动成本（元）；没有时为 null。 |
| `cpv` | number \| null | 单次阅读成本（元），按趋势图口径；没有时为 null。 |
| `shop_visit_cost` | number \| null | 笔记带来每个进店访客的成本（元）；没有时为 null。 |
| `median_impressions` | integer \| null | 笔记曝光中位数。 |
| `median_reads` | integer \| null | 笔记阅读中位数。 |
| `median_engagements` | integer \| null | 笔记互动中位数。 |
| `median_shop_visits` | integer \| null | 笔记带来进店人数的中位数；没带来的计为 0。 |
| `points` | PgyCostPoint[] | 逐日数据，从早到晚。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### PgyCostPoint

| 字段 | 类型 | 说明 |
|---|---|---|
| `date` | string | 日期：中国时间（UTC+8）的一个自然日，写成该日期的 UTC 零点。 |
| `cpm` | number \| null | 千次曝光成本（元）；没有时为 null。 |
| `cpe` | number \| null | 单次互动成本（元）；没有时为 null。 |
| `cpv` | number \| null | 单次阅读成本（元），按趋势图口径；没有时为 null。 |
| `shop_visit_cost` | number \| null | 笔记带来每个进店访客的成本（元）；没有时为 null。 |
| `median_impressions` | integer \| null | 笔记曝光中位数。 |
| `median_reads` | integer \| null | 笔记阅读中位数。 |
| `median_engagements` | integer \| null | 笔记互动中位数。 |
| `median_shop_visits` | integer \| null | 笔记带来进店人数的中位数；没带来的计为 0。 |

## 返回 PgyCreatorCostHistory 的接口

- [小红书蒲公英达人核心数据趋势](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/costs/history/) (`xiaohongshu.pgy.creators.costs.history`): $0.04/次
