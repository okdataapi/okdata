# Account

> 博主、品牌或个人账号。

网页版：https://okdata.online/zh/docs/objects/account/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 账号在平台上的 ID。 |
| `url` | string | 主页链接。 |
| `username` | string \| null | 用户名（平台有的话）。 |
| `name` | string | 昵称。 |
| `bio` | string \| null | 简介。 |
| `avatar_url` | string \| null | 头像图片地址。 |
| `verified` | boolean \| null | 平台是否显示认证标识。 |
| `followers` | integer \| null | 粉丝数。 |
| `following` | integer \| null | 关注数。 |
| `posts` | integer \| null | 发布的作品、笔记或文章数。 |
| `likes` | integer \| null | 累计获赞（平台展示的话）。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 返回 Account 的接口

- [抖音账号信息](https://okdata.online/zh/apis/douyin/users/get/) (`douyin.users.get`): $0.002/次
- [小红书博主信息](https://okdata.online/zh/apis/xiaohongshu/users/get/) (`xiaohongshu.users.get`): $0.02/次
- [公众号搜索](https://okdata.online/zh/apis/wechat_mp/accounts/search/) (`wechat_mp.accounts.search`): $0.058/条 · 每次最多 $0.58
- [微博账号信息](https://okdata.online/zh/apis/weibo/users/get/) (`weibo.users.get`): $0.002/次
- [TikTok 账号信息](https://okdata.online/zh/apis/tiktok/users/get/) (`tiktok.users.get`): $0.002/次
- [X 账号信息](https://okdata.online/zh/apis/x/users/get/) (`x.users.get`): $0.001/次
