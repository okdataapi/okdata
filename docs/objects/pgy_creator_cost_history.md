# PgyCreatorCostHistory

> A PGY creator's costs and note medians over a period, with the figures day by day.

Canonical page: https://okdata.online/docs/objects/pgy_creator_cost_history/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `creator_id` | string | PGY creator ID. |
| `days` | integer | How many of the most recent days the figures cover. |
| `currency` | string \| null | Currency of the costs (ISO 4217). |
| `date` | string \| null | The last day the figures run to: a calendar day in China time (UTC+8), written as 00:00 UTC of that date. |
| `cpm` | number \| null | Cost of a thousand impressions, in yuan; null where there is none. |
| `cpe` | number \| null | Cost of one interaction, in yuan; null where there is none. |
| `cpv` | number \| null | Cost of one read, in yuan, as the trend chart works it out; null where there is none. |
| `shop_visit_cost` | number \| null | Cost per shop visitor a note brings, in yuan; null where there is none. |
| `median_impressions` | integer \| null | Median impressions of a note. |
| `median_reads` | integer \| null | Median reads of a note. |
| `median_engagements` | integer \| null | Median interactions of a note. |
| `median_shop_visits` | integer \| null | Median shop visitors a note brings; a note that brought none counts as 0. |
| `points` | PgyCostPoint[] | The figures day by day, oldest first. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### PgyCostPoint

| Field | Type | Description |
|---|---|---|
| `date` | string | The day: a calendar day in China time (UTC+8), written as 00:00 UTC of that date. |
| `cpm` | number \| null | Cost of a thousand impressions, in yuan; null where there is none. |
| `cpe` | number \| null | Cost of one interaction, in yuan; null where there is none. |
| `cpv` | number \| null | Cost of one read, in yuan, as the trend chart works it out; null where there is none. |
| `shop_visit_cost` | number \| null | Cost per shop visitor a note brings, in yuan; null where there is none. |
| `median_impressions` | integer \| null | Median impressions of a note. |
| `median_reads` | integer \| null | Median reads of a note. |
| `median_engagements` | integer \| null | Median interactions of a note. |
| `median_shop_visits` | integer \| null | Median shop visitors a note brings; a note that brought none counts as 0. |

## Endpoints that return a PgyCreatorCostHistory

- [Xiaohongshu PGY creator core figures history](https://okdata.online/apis/xiaohongshu/pgy/creators/costs/history/) (`xiaohongshu.pgy.creators.costs.history`): $0.04 per call
