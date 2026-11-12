# AccountHistory

> 账号最近一段时间的增长，以及与上一段时间的对比。

网页版：https://okdata.online/zh/docs/objects/account_history/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 账号的数字 ID（即所查的那个）。 |
| `name` | string \| null | 昵称。 |
| `url` | string \| null | 主页链接。 |
| `avatar_url` | string \| null | 头像。 |
| `days` | integer | 数据覆盖最近多少天。 |
| `gained` | AccountGain | 这段时间的增量。 |
| `change` | AccountChange | 每项增量与上一段同样长时间相比的变化：0.3 即多 30%，-0.5 即减半。 |
| `totals` | AccountTotals \| null | 截至现在的总量。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### AccountGain

| 字段 | 类型 | 说明 |
|---|---|---|
| `followers` | integer \| null | 净增粉丝；掉粉时为负数。 |
| `likes` | integer \| null | 新增获赞。 |
| `comments` | integer \| null | 新增评论。 |
| `shares` | integer \| null | 新增分享。 |
| `posts` | integer \| null | 发布的作品数。 |

### AccountChange

| 字段 | 类型 | 说明 |
|---|---|---|
| `followers` | number \| null | 净增粉丝的变化。 |
| `likes` | number \| null | 新增获赞的变化。 |
| `comments` | number \| null | 新增评论的变化。 |
| `shares` | number \| null | 新增分享的变化。 |
| `posts` | number \| null | 发布作品数的变化。 |

### AccountTotals

| 字段 | 类型 | 说明 |
|---|---|---|
| `followers` | integer \| null | 当前粉丝数。 |
| `likes` | integer \| null | 累计获赞。 |
| `posts` | integer \| null | 作品总数。 |

## 返回 AccountHistory 的接口

- [抖音达人互动与粉丝趋势](https://okdata.online/zh/apis/douyin/users/history/) (`douyin.users.history`): $0.002/次
