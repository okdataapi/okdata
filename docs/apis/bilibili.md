# Bilibili API

> Videos, comments and the popular board.

Canonical page: https://okdata.online/apis/bilibili/

4 endpoints, $0.002 to $0.002 per call. Region: Mainland China. No Bilibili login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Bilibili video search](https://okdata.online/apis/bilibili/videos/search/) | `bilibili.videos.search` | Post[] | $0.002 per call · about 20 videos per page |
| [Bilibili video detail](https://okdata.online/apis/bilibili/videos/get/) | `bilibili.videos.get` | Post | $0.002 per call |
| [Bilibili video comments](https://okdata.online/apis/bilibili/videos/comments/list/) | `bilibili.videos.comments.list` | Comment[] | $0.002 per call · about 20 comments per page |
| [Bilibili popular board](https://okdata.online/apis/bilibili/trends/list/) | `bilibili.trends.list` | Trend[] | $0.002 per call · about 50 board entries per page |

## Good for

- Content research: `bilibili.videos.search`
- Competitor monitoring: `bilibili.videos.get`
- Word of mouth: `bilibili.videos.comments.list`
- Trend research: `bilibili.trends.list`
