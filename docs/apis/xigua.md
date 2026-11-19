# Xigua Video API

> Longer videos from China: search, video stats, comments, creators and their uploads.

Canonical page: https://okdata.online/apis/xigua/

5 endpoints, $0.002 to $0.004 per call. Region: Mainland China. No Xigua Video login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Xigua Video search](https://okdata.online/apis/xigua/videos/search/) | `xigua.videos.search` | Post[] | $0.002 per call · about 10 videos per page |
| [Xigua Video detail](https://okdata.online/apis/xigua/videos/get/) | `xigua.videos.get` | Post | $0.004 per call |
| [Xigua Video comments](https://okdata.online/apis/xigua/videos/comments/list/) | `xigua.videos.comments.list` | Comment[] | $0.002 per call · about 20 comments per page |
| [Xigua Video creator profile](https://okdata.online/apis/xigua/users/get/) | `xigua.users.get` | Account | $0.002 per call |
| [Xigua Video creator videos](https://okdata.online/apis/xigua/users/videos/list/) | `xigua.users.videos.list` | Post[] | $0.002 per call · about 30 videos per page |

## Good for

- Content research: `xigua.videos.search`, `xigua.videos.get`, `xigua.users.videos.list`
- Competitor monitoring: `xigua.videos.search`, `xigua.videos.get`, `xigua.users.get`, `xigua.users.videos.list`
- Word of mouth: `xigua.videos.comments.list`
- Creator discovery: `xigua.users.get`
