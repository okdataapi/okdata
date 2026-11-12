# CreatorRate

> A creator's full rate card on a creator marketplace.

Canonical page: https://okdata.online/docs/objects/creator_rate/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `creator_id` | string | The marketplace creator ID. |
| `url` | string | The creator's page on the marketplace. |
| `rates` | Rate[] | Every offering on the rate card. |
| `industries` | string[] \| null | Industries the marketplace files the creator under. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### Rate

| Field | Type | Description |
|---|---|---|
| `type` | string | Kind of sponsored work, normalised across platforms. |
| `name` | string | The platform's own name for it. |
| `price` | number \| null | Listed price, in the currency given; null when not published. |
| `currency` | string | ISO 4217 currency code. |
| `available` | boolean \| null | Whether the creator takes this kind of order now. |
| `settlement` | string \| null | How it is settled, in the platform’s words. |

## Endpoints that return a CreatorRate

- [Douyin Xingtu creator rate card](https://okdata.online/apis/douyin/xingtu/creators/rates/get/) (`douyin.xingtu.creators.rates.get`): $0.04 per call
