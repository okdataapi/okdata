# Bilibili API

> Videos, comments and the popular board.

Canonical page: https://okdata.online/apis/bilibili/

9 endpoints, $0.002 to $0.0025 per call. Region: Mainland China. No Bilibili login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Bilibili video search](https://okdata.online/apis/bilibili/videos/search/) | `bilibili.videos.search` | Post[] | $0.002 per call · about 20 videos per page |
| [Bilibili video detail](https://okdata.online/apis/bilibili/videos/get/) | `bilibili.videos.get` | Post | $0.002 per call |
| [Bilibili video comments](https://okdata.online/apis/bilibili/videos/comments/list/) | `bilibili.videos.comments.list` | Comment[] | $0.002 per call · about 20 comments per page |
| [Bilibili hot searches](https://okdata.online/apis/bilibili/trends/list/) | `bilibili.trends.list` | Trend[] | $0.002 per call · about 50 board entries per page |
| [Bilibili account profile](https://okdata.online/apis/bilibili/users/get/) | `bilibili.users.get` | Account | $0.002 per call |
| [Bilibili account videos](https://okdata.online/apis/bilibili/users/videos/list/) | `bilibili.users.videos.list` | Post[] | $0.002 per call · about 30 videos per page |
| [Bilibili comment replies](https://okdata.online/apis/bilibili/comments/replies/list/) | `bilibili.comments.replies.list` | Comment[] | $0.002 per call · about 20 comments per page |
| [Bilibili popular videos](https://okdata.online/apis/bilibili/videos/trending/) | `bilibili.videos.trending` | Post[] | $0.002 per call · about 20 videos per page |
| [Bilibili account videos (backup)](https://okdata.online/apis/bilibili/backup/users/videos/list/) | `bilibili.backup.users.videos.list` | Post[] | $0.0025 per call · about 20 videos per page |

## Good for

- Content research: `bilibili.videos.search`, `bilibili.users.videos.list`, `bilibili.videos.trending`, `bilibili.backup.users.videos.list`
- Competitor monitoring: `bilibili.videos.get`, `bilibili.users.get`, `bilibili.users.videos.list`, `bilibili.backup.users.videos.list`
- Word of mouth: `bilibili.videos.comments.list`, `bilibili.comments.replies.list`
- Trend research: `bilibili.trends.list`, `bilibili.videos.trending`
- Creator discovery: `bilibili.users.get`
