# Account

> A creator, brand or person.

Canonical page: https://okdata.online/docs/objects/account/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | Account ID on the platform. |
| `url` | string | Profile link. |
| `username` | string \| null | Handle, where the platform has one. |
| `name` | string | Display name. |
| `bio` | string \| null | Profile bio. |
| `avatar_url` | string \| null | Avatar image URL. |
| `verified` | boolean \| null | Whether the platform shows a verification badge. |
| `followers` | integer \| null | Followers. |
| `following` | integer \| null | Accounts it follows. |
| `posts` | integer \| null | Posts, videos, notes or articles published. |
| `likes` | integer \| null | Total likes received, where the platform shows it. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Endpoints that return a Account

- [Douyin account profile](https://okdata.online/apis/douyin/users/get/) (`douyin.users.get`): $0.002 per call
- [Xiaohongshu account profile](https://okdata.online/apis/xiaohongshu/users/get/) (`xiaohongshu.users.get`): $0.02 per call
- [Official Account search](https://okdata.online/apis/wechat_mp/accounts/search/) (`wechat_mp.accounts.search`): $0.058 per account · at most $0.58 per call
- [Weibo account profile](https://okdata.online/apis/weibo/users/get/) (`weibo.users.get`): $0.002 per call
- [TikTok account profile](https://okdata.online/apis/tiktok/users/get/) (`tiktok.users.get`): $0.002 per call
- [X account profile](https://okdata.online/apis/x/users/get/) (`x.users.get`): $0.001 per call
