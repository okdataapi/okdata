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
- [X 账号信息](https://okdata.online/zh/apis/x/users/get/) (`x.users.get`): $0.0004/条 · 每次最多 $0.04
- [Instagram 账号信息](https://okdata.online/zh/apis/instagram/users/get/) (`instagram.users.get`): $0.004/次
- [Instagram 账号搜索](https://okdata.online/zh/apis/instagram/users/search/) (`instagram.users.search`): $0.002/次 · 每页约 20 个账号
- [Reddit 社区资料](https://okdata.online/zh/apis/reddit/subreddits/get/) (`reddit.subreddits.get`): $0.002/次
- [Reddit 用户资料](https://okdata.online/zh/apis/reddit/users/get/) (`reddit.users.get`): $0.002/次
- [Reddit 用户活跃社区](https://okdata.online/zh/apis/reddit/users/subreddits/list/) (`reddit.users.subreddits.list`): $0.002/次 · 每页约 30 个账号
- [快手账号信息](https://okdata.online/zh/apis/kuaishou/users/get/) (`kuaishou.users.get`): $0.02/次
- [快手账号搜索](https://okdata.online/zh/apis/kuaishou/users/search/) (`kuaishou.users.search`): $0.02/次 · 每页约 20 个账号
- [知乎用户资料](https://okdata.online/zh/apis/zhihu/users/get/) (`zhihu.users.get`): $0.002/次
- [知乎用户搜索](https://okdata.online/zh/apis/zhihu/users/search/) (`zhihu.users.search`): $0.002/次 · 每页约 20 个账号
- [知乎用户粉丝列表](https://okdata.online/zh/apis/zhihu/users/followers/list/) (`zhihu.users.followers.list`): $0.002/次 · 每页约 20 个账号
- [视频号账号搜索](https://okdata.online/zh/apis/wechat_channels/users/search/) (`wechat_channels.users.search`): $0.02/次 · 每页约 1 个账号
- [视频号账号信息](https://okdata.online/zh/apis/wechat_channels/users/get/) (`wechat_channels.users.get`): $0.02/次
- [抖音账号搜索](https://okdata.online/zh/apis/douyin/users/search/) (`douyin.users.search`): $0.002/次 · 每页约 30 个账号
- [小红书账号搜索](https://okdata.online/zh/apis/xiaohongshu/users/search/) (`xiaohongshu.users.search`): $0.02/次 · 每页约 20 个账号
- [微博点赞用户](https://okdata.online/zh/apis/weibo/posts/likers/list/) (`weibo.posts.likers.list`): $0.002/次 · 每页约 50 个账号
- [微博用户粉丝列表](https://okdata.online/zh/apis/weibo/users/followers/list/) (`weibo.users.followers.list`): $0.002/次 · 每页约 20 个账号
- [微博用户搜索](https://okdata.online/zh/apis/weibo/users/search/) (`weibo.users.search`): $0.002/次 · 每页约 20 个账号
- [B站用户资料](https://okdata.online/zh/apis/bilibili/users/get/) (`bilibili.users.get`): $0.002/次
- [微信公众号实时查找](https://okdata.online/zh/apis/wechat/accounts/search/) (`wechat.accounts.search`): $0.02/次 · 每页约 8 个账号
- [公众号资料](https://okdata.online/zh/apis/wechat_mp/accounts/get/) (`wechat_mp.accounts.get`): $0.02/次
- [视频号账号信息（备用版）](https://okdata.online/zh/apis/wechat_channels/backup/users/get/) (`wechat_channels.backup.users.get`): $0.03/次
- [Telegram 频道资料](https://okdata.online/zh/apis/telegram/channels/get/) (`telegram.channels.get`): $0.002/次
- [YouTube 频道资料](https://okdata.online/zh/apis/youtube/channels/get/) (`youtube.channels.get`): $0.002/次
- [YouTube 频道搜索](https://okdata.online/zh/apis/youtube/channels/search/) (`youtube.channels.search`): $0.004/次 · 每页约 20 个账号
- [TikTok 账号搜索](https://okdata.online/zh/apis/tiktok/users/search/) (`tiktok.users.search`): $0.002/次 · 每页约 30 个账号
- [TikTok 账号粉丝列表](https://okdata.online/zh/apis/tiktok/users/followers/list/) (`tiktok.users.followers.list`): $0.002/次 · 每页约 20 个账号
- [X 帖子转推用户](https://okdata.online/zh/apis/x/posts/retweeters/list/) (`x.posts.retweeters.list`): $0.002/次 · 每页约 100 个账号
- [X 账号搜索](https://okdata.online/zh/apis/x/users/search/) (`x.users.search`): $0.0004/条 · 每次最多 $0.008
- [X 账号粉丝](https://okdata.online/zh/apis/x/users/followers/list/) (`x.users.followers.list`): $0.0001/条 · 每次最多 $0.02
- [X 账号关注](https://okdata.online/zh/apis/x/users/following/list/) (`x.users.following.list`): $0.0001/条 · 每次最多 $0.02
- [X 列表成员](https://okdata.online/zh/apis/x/lists/members/list/) (`x.lists.members.list`): $0.0004/条 · 每次最多 $0.008
- [X 列表关注者](https://okdata.online/zh/apis/x/lists/followers/list/) (`x.lists.followers.list`): $0.0004/条 · 每次最多 $0.008
- [X 社群成员](https://okdata.online/zh/apis/x/communities/members/list/) (`x.communities.members.list`): $0.0004/条 · 每次最多 $0.008
