# Creator

> A creator as a creator marketplace shows them to advertisers: reach, engagement and rates.

Canonical page: https://okdata.online/docs/objects/creator/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | The marketplace's creator ID; the other marketplace endpoints take it. |
| `url` | string | The creator's page on the marketplace. |
| `account_id` | string \| null | The creator's own account ID on the platform, where the marketplace gives it: on Douyin the sec_uid (MS4w…) that douyin.users.get takes, on Xiaohongshu the user ID. |
| `username` | string \| null | Handle on the platform, where given. |
| `name` | string | Display name. |
| `avatar_url` | string \| null | Avatar image URL. |
| `location` | string \| null | Where the creator says they are. |
| `gender` | string \| null | The creator's gender as the marketplace lists it. |
| `followers` | integer \| null | Followers. |
| `categories` | string[] \| null | Content categories in the marketplace’s own words. |
| `engagement_rate` | number \| null | Interactions per view of recent posts, 0 to 1 (0.038 is 3.8%). |
| `median_views` | integer \| null | Median views or reads of recent everyday posts. |
| `median_engagements` | integer \| null | Median interactions (likes, comments, saves, shares) of recent everyday posts. |
| `rates` | Rate[] \| null | Published rates for sponsored work; null when the marketplace hides them. |
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

## Endpoints that return a Creator

- [Douyin Xingtu creator search](https://okdata.online/apis/douyin/xingtu/creators/search/) (`douyin.xingtu.creators.search`): $0.004 per call · about 20 creators per page
- [Xiaohongshu PGY creator search](https://okdata.online/apis/xiaohongshu/pgy/creators/search/) (`xiaohongshu.pgy.creators.search`): $0.04 per call · about 20 creators per page
- [Xiaohongshu PGY creator detail](https://okdata.online/apis/xiaohongshu/pgy/creators/get/) (`xiaohongshu.pgy.creators.get`): $0.04 per call
- [Douyin Xingtu creator profile](https://okdata.online/apis/douyin/xingtu/creators/get/) (`douyin.xingtu.creators.get`): $0.004 per call
- [Xiaohongshu PGY similar creators](https://okdata.online/apis/xiaohongshu/pgy/creators/related/) (`xiaohongshu.pgy.creators.related`): $0.04 per call · about 4 creators per page
