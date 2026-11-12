# AccountHistory

> How much an account gained over its last days, and how that compares with the period before.

Canonical page: https://okdata.online/docs/objects/account_history/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | The account's numeric ID (the one asked about). |
| `name` | string \| null | Display name. |
| `url` | string \| null | Profile link. |
| `avatar_url` | string \| null | Avatar. |
| `days` | integer | How many of the most recent days the figures cover. |
| `gained` | AccountGain | What the account gained over the period. |
| `change` | AccountChange | Each gain against the same length of time before, as a ratio: 0.3 is 30% more, -0.5 is half. |
| `totals` | AccountTotals \| null | Totals as of now. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### AccountGain

| Field | Type | Description |
|---|---|---|
| `followers` | integer \| null | Net followers gained; negative when the account lost followers. |
| `likes` | integer \| null | Likes received. |
| `comments` | integer \| null | Comments received. |
| `shares` | integer \| null | Shares received. |
| `posts` | integer \| null | Posts published. |

### AccountChange

| Field | Type | Description |
|---|---|---|
| `followers` | number \| null | Change in net followers gained. |
| `likes` | number \| null | Change in likes received. |
| `comments` | number \| null | Change in comments received. |
| `shares` | number \| null | Change in shares received. |
| `posts` | number \| null | Change in posts published. |

### AccountTotals

| Field | Type | Description |
|---|---|---|
| `followers` | integer \| null | Followers now. |
| `likes` | integer \| null | Likes received in all. |
| `posts` | integer \| null | Posts in all. |

## Endpoints that return a AccountHistory

- [Douyin account growth](https://okdata.online/apis/douyin/users/history/) (`douyin.users.history`): $0.002 per call
