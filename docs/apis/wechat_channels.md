# WeChat Channels API

> Channels videos, accounts, comments and live replays, without a QR login.

Canonical page: https://okdata.online/apis/wechat_channels/

15 endpoints, $0.015 to $0.15 per call. Region: Mainland China. No WeChat Channels login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [WeChat Channels video search](https://okdata.online/apis/wechat_channels/videos/search/) | `wechat_channels.videos.search` | Post[] | $0.02 per call · about 10 videos per page |
| [WeChat Channels account search](https://okdata.online/apis/wechat_channels/users/search/) | `wechat_channels.users.search` | Account[] | $0.02 per call · about 1 accounts per page |
| [WeChat Channels account profile](https://okdata.online/apis/wechat_channels/users/get/) | `wechat_channels.users.get` | Account | $0.02 per call |
| [WeChat Channels account videos](https://okdata.online/apis/wechat_channels/users/videos/list/) | `wechat_channels.users.videos.list` | Post[] | $0.02 per call · about 15 videos per page |
| [WeChat Channels video detail](https://okdata.online/apis/wechat_channels/videos/get/) | `wechat_channels.videos.get` | Post | $0.02 per call |
| [WeChat Channels video comments](https://okdata.online/apis/wechat_channels/videos/comments/list/) | `wechat_channels.videos.comments.list` | Comment[] | $0.015 per call · about 25 comments per page |
| [WeChat Channels comment replies](https://okdata.online/apis/wechat_channels/comments/replies/list/) | `wechat_channels.comments.replies.list` | Comment[] | $0.015 per call · about 20 comments per page |
| [WeChat Channels live replays](https://okdata.online/apis/wechat_channels/users/live_replays/list/) | `wechat_channels.users.live_replays.list` | Post[] | $0.02 per call · about 48 posts per page |
| [WeChat Channels video share link](https://okdata.online/apis/wechat_channels/videos/share_link/get/) | `wechat_channels.videos.share_link.get` | ChannelsShareLink | $0.02 per call |
| [WeChat Channels account collections](https://okdata.online/apis/wechat_channels/users/collections/list/) | `wechat_channels.users.collections.list` | ChannelsCollection[] | $0.02 per call · about 7 results per page |
| [WeChat Channels collection videos](https://okdata.online/apis/wechat_channels/collections/videos/list/) | `wechat_channels.collections.videos.list` | Post[] | $0.02 per call · about 20 videos per page |
| [WeChat Channels video stats](https://okdata.online/apis/wechat_channels/videos/metrics/) | `wechat_channels.videos.metrics` | Post | $0.015 per call |
| [WeChat Channels account profile (backup)](https://okdata.online/apis/wechat_channels/backup/users/get/) | `wechat_channels.backup.users.get` | Account | $0.03 per call |
| [WeChat Channels account videos (backup)](https://okdata.online/apis/wechat_channels/backup/users/videos/list/) | `wechat_channels.backup.users.videos.list` | Post[] | $0.06 per call · about 15 videos per page |
| [WeChat Channels video search (backup)](https://okdata.online/apis/wechat_channels/backup/videos/search/) | `wechat_channels.backup.videos.search` | Post[] | $0.15 per call · about 10 videos per page |

## Good for

- Content research: `wechat_channels.videos.search`, `wechat_channels.users.videos.list`, `wechat_channels.videos.get`, `wechat_channels.users.live_replays.list`, `wechat_channels.videos.share_link.get`, `wechat_channels.users.collections.list`, `wechat_channels.collections.videos.list`, `wechat_channels.videos.metrics`, `wechat_channels.backup.users.videos.list`, `wechat_channels.backup.videos.search`
- Competitor monitoring: `wechat_channels.videos.search`, `wechat_channels.users.search`, `wechat_channels.users.get`, `wechat_channels.users.videos.list`, `wechat_channels.videos.get`, `wechat_channels.users.live_replays.list`, `wechat_channels.users.collections.list`, `wechat_channels.collections.videos.list`, `wechat_channels.videos.metrics`, `wechat_channels.backup.users.get`, `wechat_channels.backup.users.videos.list`, `wechat_channels.backup.videos.search`
- Creator discovery: `wechat_channels.users.search`, `wechat_channels.users.get`, `wechat_channels.backup.users.get`
- Word of mouth: `wechat_channels.videos.comments.list`, `wechat_channels.comments.replies.list`
