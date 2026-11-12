# Ad

> One ad from a public ad library: advertiser, copy, creative, landing page and when it ran.

Canonical page: https://okdata.online/docs/objects/ad/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | Ad ID in the library. |
| `url` | string | Link to the ad in the library. |
| `advertiser` | AdvertiserRef | Who runs the ad. |
| `title` | string \| null | Headline, where the ad has one. |
| `text` | string | Ad copy as plain text; empty when the ad has none. |
| `format` | string \| null | Creative format; dynamic means the platform assembles it per viewer (catalog ads). |
| `images` | string[] \| null | Image URLs of the creative. |
| `videos` | string[] \| null | Video URLs of the creative. |
| `landing_url` | string \| null | Where the ad leads. |
| `cta` | string \| null | Call-to-action button text. |
| `platforms` | string[] \| null | Where it is delivered, e.g. facebook, instagram. |
| `active` | boolean \| null | Whether the ad is still running. |
| `first_shown_at` | string \| null | First time or day shown, ISO 8601 in UTC. |
| `last_shown_at` | string \| null | Last time or day shown, ISO 8601 in UTC. |
| `reach` | string \| null | People reached, as the library publishes it: a bracket such as 1K-10K, or a count (the EU reach of a Meta ad); null where none is published. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### AdvertiserRef

| Field | Type | Description |
|---|---|---|
| `id` | string \| null | The advertiser's ID in the library. |
| `name` | string \| null | The advertiser's name. |
| `url` | string \| null | The advertiser's page. |

## Endpoints that return a Ad

- [Meta Ad Library search](https://okdata.online/apis/meta/ads/search/) (`meta.ads.search`): $0.004 per call · about 30 ads per page
- [Meta Ad Library ad detail](https://okdata.online/apis/meta/ads/get/) (`meta.ads.get`): $0.004 per call
- [Meta advertiser ads](https://okdata.online/apis/meta/advertisers/ads/list/) (`meta.advertisers.ads.list`): $0.004 per call · about 30 ads per page
- [Google advertiser ads](https://okdata.online/apis/google/advertisers/ads/list/) (`google.advertisers.ads.list`): $0.004 per call · about 40 ads per page
- [TikTok Ads Library search](https://okdata.online/apis/tiktok/ads/search/) (`tiktok.ads.search`): $0.004 per call · about 12 ads per page
- [TikTok Creative Center top ads](https://okdata.online/apis/tiktok/creative_center/ads/search/) (`tiktok.creative_center.ads.search`): $0.002 per call · about 20 ads per page
- [TikTok Creative Center top ad](https://okdata.online/apis/tiktok/creative_center/ads/get/) (`tiktok.creative_center.ads.get`): $0.002 per call
