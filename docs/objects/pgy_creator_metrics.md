# PgyCreatorMetrics

> How a Xiaohongshu creator's notes perform on PGY over a period: medians, rates, standing among peers and where the traffic came from.

Canonical page: https://okdata.online/docs/objects/pgy_creator_metrics/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `creator_id` | string | PGY creator ID. |
| `notes` | integer \| null | Notes in the period. |
| `median_impressions` | integer \| null | Median impressions of a note. |
| `median_reads` | integer \| null | Median reads of a note. |
| `median_engagements` | integer \| null | Median interactions of a note. |
| `median_likes` | integer \| null | Median likes of a note. |
| `median_favorites` | integer \| null | Median saves of a note. |
| `median_comments` | integer \| null | Median comments of a note. |
| `median_shares` | integer \| null | Median shares of a note. |
| `engagement_rate` | number \| null | Interactions per read, 0 to 1. |
| `video_completion_rate` | number \| null | Completion rate of video notes, 0 to 1. |
| `image_3s_read_rate` | number \| null | Share of image-note reads that lasted 3 seconds, 0 to 1. |
| `hundred_like_share` | number \| null | Share of notes with 100 likes or more, 0 to 1. |
| `thousand_like_share` | number \| null | Share of notes with 1,000 likes or more, 0 to 1. |
| `impressions_percentile` | number \| null | Share of comparable creators this one beats on median impressions, 0 to 1. |
| `reads_percentile` | number \| null | Share of comparable creators this one beats on median reads, 0 to 1. |
| `engagements_percentile` | number \| null | Share of comparable creators this one beats on median interactions, 0 to 1. |
| `video_notes` | integer \| null | Video notes in the period (included in notes). |
| `video_completion_percentile` | number \| null | Share of comparable creators this one beats on video completion rate, 0 to 1. |
| `median_follows` | integer \| null | Median new followers a note brought. |
| `traffic_sources` | PgyTrafficSources \| null | Where the notes got their impressions and reads; each set adds up to 1. |
| `long_term` | PgyLongTerm \| null | Long-term performance of notes from about half a year back: recent and long-term reads, standing and sources. |
| `note_list` | PgyNoteFigures[] \| null | The period's notes one by one, oldest first, 15 at most; null when there is none. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### PgyTrafficSources

| Field | Type | Description |
|---|---|---|
| `impressions` | PgySourceShares \| null | Where the impressions came from. |
| `reads` | PgySourceShares \| null | Where the reads came from. |

### PgyLongTerm

| Field | Type | Description |
|---|---|---|
| `published_from` | string \| null | First publication day of the notes counted: a calendar day in China time (UTC+8), written as 00:00 UTC of that date. |
| `published_to` | string \| null | Last publication day of the notes counted, written the same way. |
| `notes` | integer \| null | Notes published in that span; when 0 the figures below are null. |
| `recent_reads` | integer \| null | Reads of a typical note soon after publication, the platform's representative figure. |
| `recent_reads_percentile` | number \| null | Share of comparable creators this one beats on recent reads, 0 to 1. |
| `long_term_reads` | integer \| null | Reads of a typical note in the long term, after the recent part. |
| `long_term_reads_percentile` | number \| null | Share of comparable creators this one beats on long-term reads, 0 to 1. |
| `recent_sources` | PgyReadSources \| null | Where the recent reads came from. |
| `long_term_sources` | PgyReadSources \| null | Where the long-term reads came from. |

### PgyNoteFigures

| Field | Type | Description |
|---|---|---|
| `id` | string | Note ID. |
| `title` | string \| null | The note's title. |
| `type` | string \| null | Image note or video note. |
| `published_at` | string \| null | Publication day, as 00:00 China time (the platform gives the day only). |
| `cover_url` | string \| null | Cover image. |
| `impressions` | integer \| null | Impressions. |
| `reads` | integer \| null | Reads. |
| `engagements` | integer \| null | Interactions. |
| `likes` | integer \| null | Likes. |
| `favorites` | integer \| null | Saves. |
| `impressions_vs_median` | number \| null | The note's impressions against the creator's median for the period: 0.5 is 50% above, -0.3 is 30% below. |
| `reads_vs_median` | number \| null | The note's reads against the creator's median for the period: 0.5 is 50% above, -0.3 is 30% below. |
| `engagements_vs_median` | number \| null | The note's interactions against the creator's median for the period: 0.5 is 50% above, -0.3 is 30% below. |
| `likes_vs_median` | number \| null | The note's likes against the creator's median for the period: 0.5 is 50% above, -0.3 is 30% below. |
| `favorites_vs_median` | number \| null | The note's saves against the creator's median for the period: 0.5 is 50% above, -0.3 is 30% below. |

## Endpoints that return a PgyCreatorMetrics

- [Xiaohongshu PGY creator note metrics](https://okdata.online/apis/xiaohongshu/pgy/creators/metrics/) (`xiaohongshu.pgy.creators.metrics`): $0.04 per call
