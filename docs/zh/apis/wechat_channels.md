# 微信视频号 API

> 视频号的视频、账号、评论和直播回放，不用扫码。

网页版：https://okdata.online/zh/apis/wechat_channels/

15 个接口，每次 $0.015 到 $0.15。地区：中国大陆。不需要微信视频号账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [视频号视频搜索](https://okdata.online/zh/apis/wechat_channels/videos/search/) | `wechat_channels.videos.search` | Post[] | $0.02/次 · 每页约 10 条视频 |
| [视频号账号搜索](https://okdata.online/zh/apis/wechat_channels/users/search/) | `wechat_channels.users.search` | Account[] | $0.02/次 · 每页约 1 个账号 |
| [视频号账号信息](https://okdata.online/zh/apis/wechat_channels/users/get/) | `wechat_channels.users.get` | Account | $0.02/次 |
| [视频号账号作品](https://okdata.online/zh/apis/wechat_channels/users/videos/list/) | `wechat_channels.users.videos.list` | Post[] | $0.02/次 · 每页约 15 条视频 |
| [视频号作品详情](https://okdata.online/zh/apis/wechat_channels/videos/get/) | `wechat_channels.videos.get` | Post | $0.02/次 |
| [视频号作品评论](https://okdata.online/zh/apis/wechat_channels/videos/comments/list/) | `wechat_channels.videos.comments.list` | Comment[] | $0.015/次 · 每页约 25 条评论 |
| [视频号评论回复](https://okdata.online/zh/apis/wechat_channels/comments/replies/list/) | `wechat_channels.comments.replies.list` | Comment[] | $0.015/次 · 每页约 20 条评论 |
| [视频号直播回放](https://okdata.online/zh/apis/wechat_channels/users/live_replays/list/) | `wechat_channels.users.live_replays.list` | Post[] | $0.02/次 · 每页约 48 条帖子 |
| [视频号作品分享链接](https://okdata.online/zh/apis/wechat_channels/videos/share_link/get/) | `wechat_channels.videos.share_link.get` | ChannelsShareLink | $0.02/次 |
| [视频号账号合集](https://okdata.online/zh/apis/wechat_channels/users/collections/list/) | `wechat_channels.users.collections.list` | ChannelsCollection[] | $0.02/次 · 每页约 7 条结果 |
| [视频号合集视频](https://okdata.online/zh/apis/wechat_channels/collections/videos/list/) | `wechat_channels.collections.videos.list` | Post[] | $0.02/次 · 每页约 20 条视频 |
| [视频号作品互动数据](https://okdata.online/zh/apis/wechat_channels/videos/metrics/) | `wechat_channels.videos.metrics` | Post | $0.015/次 |
| [视频号账号信息（备用版）](https://okdata.online/zh/apis/wechat_channels/backup/users/get/) | `wechat_channels.backup.users.get` | Account | $0.03/次 |
| [视频号账号作品（备用版）](https://okdata.online/zh/apis/wechat_channels/backup/users/videos/list/) | `wechat_channels.backup.users.videos.list` | Post[] | $0.06/次 · 每页约 15 条视频 |
| [视频号视频搜索（备用版）](https://okdata.online/zh/apis/wechat_channels/backup/videos/search/) | `wechat_channels.backup.videos.search` | Post[] | $0.15/次 · 每页约 10 条视频 |

## 适合做什么

- 内容调研: `wechat_channels.videos.search`, `wechat_channels.users.videos.list`, `wechat_channels.videos.get`, `wechat_channels.users.live_replays.list`, `wechat_channels.videos.share_link.get`, `wechat_channels.users.collections.list`, `wechat_channels.collections.videos.list`, `wechat_channels.videos.metrics`, `wechat_channels.backup.users.videos.list`, `wechat_channels.backup.videos.search`
- 竞品监控: `wechat_channels.videos.search`, `wechat_channels.users.search`, `wechat_channels.users.get`, `wechat_channels.users.videos.list`, `wechat_channels.videos.get`, `wechat_channels.users.live_replays.list`, `wechat_channels.users.collections.list`, `wechat_channels.collections.videos.list`, `wechat_channels.videos.metrics`, `wechat_channels.backup.users.get`, `wechat_channels.backup.users.videos.list`, `wechat_channels.backup.videos.search`
- 找博主: `wechat_channels.users.search`, `wechat_channels.users.get`, `wechat_channels.backup.users.get`
- 口碑分析: `wechat_channels.videos.comments.list`, `wechat_channels.comments.replies.list`
