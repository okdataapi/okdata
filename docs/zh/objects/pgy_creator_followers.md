# PgyCreatorFollowers

> 蒲公英达人的粉丝数、增长，以及活跃、互动、阅读和购买粉丝的数量和占比。

网页版：https://okdata.online/zh/docs/objects/pgy_creator_followers/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `creator_id` | string | 蒲公英达人 ID。 |
| `followers` | integer \| null | 粉丝数。 |
| `gained` | integer \| null | 近 30 天净增粉丝；掉粉时为负数。 |
| `growth` | number \| null | 近 30 天粉丝增长率：0.008 即增长 0.8%。 |
| `growth_percentile` | number \| null | 粉丝增长率超过的同类达人比例，0 到 1。 |
| `active_followers` | integer \| null | 活跃粉丝：近 28 天在小红书活跃。 |
| `active_share` | number \| null | 活跃粉丝占全部粉丝的比例，0 到 1。 |
| `active_percentile` | number \| null | 活跃粉丝占比超过的同类达人比例，0 到 1。 |
| `engaged_followers` | integer \| null | 互动粉丝：近 30 天与达人笔记有互动。 |
| `engaged_share` | number \| null | 互动粉丝占全部粉丝的比例，0 到 1。 |
| `engaged_percentile` | number \| null | 互动粉丝占比超过的同类达人比例，0 到 1。 |
| `reading_followers` | integer \| null | 阅读粉丝：近 30 天阅读过达人笔记。 |
| `reading_share` | number \| null | 阅读粉丝占全部粉丝的比例，0 到 1。 |
| `reading_percentile` | number \| null | 阅读粉丝占比超过的同类达人比例，0 到 1。 |
| `buying_followers` | integer \| null | 购买粉丝：近 30 天在小红书有购买。 |
| `buying_share` | number \| null | 购买粉丝占全部粉丝的比例，0 到 1。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 返回 PgyCreatorFollowers 的接口

- [小红书蒲公英达人粉丝概览](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/followers/metrics/) (`xiaohongshu.pgy.creators.followers.metrics`): $0.04/次
