# TikTok API

> Videos, accounts and comments worldwide.

Canonical page: https://okdata.online/apis/tiktok/

4 endpoints, $0.002 to $0.002 per call. Region: Global. No TikTok login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [TikTok video search](https://okdata.online/apis/tiktok/videos/search/) | `tiktok.videos.search` | Post[] | $0.002 per call · about 30 videos per page |
| [TikTok video detail](https://okdata.online/apis/tiktok/videos/get/) | `tiktok.videos.get` | Post | $0.002 per call |
| [TikTok video comments](https://okdata.online/apis/tiktok/videos/comments/list/) | `tiktok.videos.comments.list` | Comment[] | $0.002 per call · about 50 comments per page |
| [TikTok account profile](https://okdata.online/apis/tiktok/users/get/) | `tiktok.users.get` | Account | $0.002 per call |

## Good for

- Content research: `tiktok.videos.search`
- Trend research: `tiktok.videos.search`
- Competitor monitoring: `tiktok.videos.get`, `tiktok.users.get`
- Word of mouth: `tiktok.videos.comments.list`
- Creator discovery: `tiktok.users.get`
