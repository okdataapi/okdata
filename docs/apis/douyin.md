# Douyin API

> China’s TikTok: videos, accounts, comments and the hot search board.

Canonical page: https://okdata.online/apis/douyin/

6 endpoints, $0.002 to $0.02 per call. Region: Mainland China. No Douyin login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Douyin video search](https://okdata.online/apis/douyin/videos/search/) | `douyin.videos.search` | Post[] | $0.02 per call · about 20 videos per page |
| [Douyin video detail](https://okdata.online/apis/douyin/videos/get/) | `douyin.videos.get` | Post | $0.002 per call |
| [Douyin video comments](https://okdata.online/apis/douyin/videos/comments/list/) | `douyin.videos.comments.list` | Comment[] | $0.002 per call · about 20 comments per page |
| [Douyin account profile](https://okdata.online/apis/douyin/users/get/) | `douyin.users.get` | Account | $0.002 per call |
| [Douyin account videos](https://okdata.online/apis/douyin/users/videos/list/) | `douyin.users.videos.list` | Post[] | $0.002 per call · about 20 videos per page |
| [Douyin hot search board](https://okdata.online/apis/douyin/trends/list/) | `douyin.trends.list` | Trend[] | $0.002 per call · about 50 board entries per page |

## Good for

- Content research: `douyin.videos.search`, `douyin.videos.get`
- Competitor monitoring: `douyin.videos.search`, `douyin.videos.get`, `douyin.users.get`, `douyin.users.videos.list`
- Word of mouth: `douyin.videos.comments.list`
- Creator discovery: `douyin.users.get`
- Trend research: `douyin.trends.list`
