# XingtuCampaign

> A marketing campaign on Xingtu that creators and brands can sign up for.

Canonical page: https://okdata.online/docs/objects/xingtu_campaign/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | Campaign ID. |
| `name` | string | Name of the campaign. |
| `description` | string \| null | What the campaign is. |
| `category` | string \| null | Kind of campaign: platform event, e-commerce moment, seasonal moment, creative marketing or industry campaign. |
| `stage` | string \| null | Where it stands: being prepared, open for sign-up, live or ended. |
| `signup_starts_at` | string \| null | When sign-up opens. |
| `signup_ends_at` | string \| null | When sign-up closes. |
| `starts_at` | string \| null | When the campaign starts. |
| `ends_at` | string \| null | When the campaign ends. |
| `image_url` | string \| null | The campaign's main image. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Endpoints that return a XingtuCampaign

- [Douyin Xingtu marketing calendar](https://okdata.online/apis/douyin/xingtu/campaigns/list/) (`douyin.xingtu.campaigns.list`): $0.004 per call · about 40 results per page
