# PgyCreatorCosts

> What working with a PGY creator is estimated to cost per impression, interaction, read and shop visit, with medians, standing among peers and responsiveness.

Canonical page: https://okdata.online/docs/objects/pgy_creator_costs/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `creator_id` | string | PGY creator ID. |
| `date` | string \| null | The day the figures are of: a calendar day in China time (UTC+8), written as 00:00 UTC of that date. |
| `currency` | string \| null | Currency of the costs (ISO 4217). |
| `image_cpm` | number \| null | Estimated CPM (cost of a thousand impressions) of a image note, in yuan; null where PGY has no estimate. |
| `image_cpm_percentile` | number \| null | Share of comparable creators whose image note CPM (cost of a thousand impressions) is higher, 0 to 1. |
| `video_cpm` | number \| null | Estimated CPM (cost of a thousand impressions) of a video note, in yuan; null where PGY has no estimate. |
| `video_cpm_percentile` | number \| null | Share of comparable creators whose video note CPM (cost of a thousand impressions) is higher, 0 to 1. |
| `image_cpe` | number \| null | Estimated cost per interaction of a image note, in yuan; null where PGY has no estimate. |
| `image_cpe_percentile` | number \| null | Share of comparable creators whose image note cost per interaction is higher, 0 to 1. |
| `video_cpe` | number \| null | Estimated cost per interaction of a video note, in yuan; null where PGY has no estimate. |
| `video_cpe_percentile` | number \| null | Share of comparable creators whose video note cost per interaction is higher, 0 to 1. |
| `image_read_cost` | number \| null | Estimated cost per read of a image note, in yuan; null where PGY has no estimate. |
| `image_read_cost_percentile` | number \| null | Share of comparable creators whose image note cost per read is higher, 0 to 1. |
| `video_read_cost` | number \| null | Estimated cost per read of a video note, in yuan; null where PGY has no estimate. |
| `video_read_cost_percentile` | number \| null | Share of comparable creators whose video note cost per read is higher, 0 to 1. |
| `image_shop_visit_cost` | number \| null | Estimated cost per shop visitor of a image note, in yuan; null where PGY has no estimate. |
| `image_shop_visit_cost_percentile` | number \| null | Share of comparable creators whose image note cost per shop visitor is higher, 0 to 1. |
| `video_shop_visit_cost` | number \| null | Estimated cost per shop visitor of a video note, in yuan; null where PGY has no estimate. |
| `video_shop_visit_cost_percentile` | number \| null | Share of comparable creators whose video note cost per shop visitor is higher, 0 to 1. |
| `median_impressions` | integer \| null | Median impressions of a note. |
| `median_impressions_percentile` | number \| null | Share of comparable creators this one beats on median impressions, 0 to 1. |
| `median_reads` | integer \| null | Median reads of a note. |
| `median_reads_percentile` | number \| null | Share of comparable creators this one beats on median reads, 0 to 1. |
| `median_engagements` | integer \| null | Median interactions of a note. |
| `median_engagements_percentile` | number \| null | Share of comparable creators this one beats on median interactions, 0 to 1. |
| `median_shop_visits` | integer \| null | Median shop visitors a note brings. |
| `median_shop_visits_percentile` | number \| null | Share of comparable creators this one beats on median shop visitors, 0 to 1. |
| `follower_growth` | number \| null | Follower growth over the last 30 days: 0.037 is 3.7% more; negative when followers were lost. |
| `follower_growth_percentile` | number \| null | Share of comparable creators this one beats on follower growth, 0 to 1. |
| `invite_reply_rate` | number \| null | Share of collaboration invitations answered within 48 hours, 0 to 1. |
| `easy_to_reach` | boolean \| null | Whether PGY marks the creator as easy to reach (好联系). |
| `active_days_7d` | integer \| null | Days active in the last 7. |
| `is_active` | boolean \| null | Whether PGY marks the creator as active (活跃). |
| `notes_30d` | integer \| null | Notes published in the last 30 days, everyday and sponsored alike. |
| `highlight` | string \| null | The strength PGY credits the creator with, in its words; null when none. |
| `highlight_reason` | string \| null | PGY's reason for that strength, in its words. |
| `content_mix` | CategoryShare[] \| null | Share of the creator's notes per content category, largest first. |
| `industries` | string[] \| null | Industries the creator has worked with, in the platform's words. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### CategoryShare

| Field | Type | Description |
|---|---|---|
| `category` | string | The content category, in the platform's words. |
| `share` | number \| null | The category's share of the creator's notes, 0 to 1. |

## Endpoints that return a PgyCreatorCosts

- [Xiaohongshu PGY creator costs and summary](https://okdata.online/apis/xiaohongshu/pgy/creators/costs/metrics/) (`xiaohongshu.pgy.creators.costs.metrics`): $0.04 per call
