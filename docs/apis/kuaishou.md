# Kuaishou API

> Videos, accounts, comments and the hot list.

Canonical page: https://okdata.online/apis/kuaishou/

8 endpoints, $0.002 to $0.02 per call. Region: Mainland China. No Kuaishou login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Kuaishou video search](https://okdata.online/apis/kuaishou/videos/search/) | `kuaishou.videos.search` | Post[] | $0.02 per call · about 10 videos per page |
| [Kuaishou video detail](https://okdata.online/apis/kuaishou/videos/get/) | `kuaishou.videos.get` | Post | $0.002 per call |
| [Kuaishou video comments](https://okdata.online/apis/kuaishou/videos/comments/list/) | `kuaishou.videos.comments.list` | Comment[] | $0.002 per call · about 10 comments per page |
| [Kuaishou comment replies](https://okdata.online/apis/kuaishou/comments/replies/list/) | `kuaishou.comments.replies.list` | Comment[] | $0.002 per call · about 20 comments per page |
| [Kuaishou account profile](https://okdata.online/apis/kuaishou/users/get/) | `kuaishou.users.get` | Account | $0.02 per call |
| [Kuaishou account search](https://okdata.online/apis/kuaishou/users/search/) | `kuaishou.users.search` | Account[] | $0.02 per call · about 20 accounts per page |
| [Kuaishou account videos](https://okdata.online/apis/kuaishou/users/videos/list/) | `kuaishou.users.videos.list` | Post[] | $0.02 per call · about 20 videos per page |
| [Kuaishou hot list](https://okdata.online/apis/kuaishou/trends/list/) | `kuaishou.trends.list` | Trend[] | $0.002 per call · about 51 board entries per page |

## Good for

- Content research: `kuaishou.videos.search`, `kuaishou.videos.get`
- Competitor monitoring: `kuaishou.videos.search`, `kuaishou.videos.get`, `kuaishou.users.get`, `kuaishou.users.search`, `kuaishou.users.videos.list`
- Word of mouth: `kuaishou.videos.comments.list`, `kuaishou.comments.replies.list`
- Creator discovery: `kuaishou.users.get`, `kuaishou.users.search`
- Trend research: `kuaishou.trends.list`
