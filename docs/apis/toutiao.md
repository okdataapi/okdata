# Toutiao API

> China’s news-feed app: full article text, videos, comments and creator accounts.

Canonical page: https://okdata.online/apis/toutiao/

5 endpoints, $0.002 to $0.002 per call. Region: Mainland China. No Toutiao login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Toutiao article](https://okdata.online/apis/toutiao/articles/get/) | `toutiao.articles.get` | Post | $0.002 per call |
| [Toutiao video](https://okdata.online/apis/toutiao/videos/get/) | `toutiao.videos.get` | Post | $0.002 per call |
| [Toutiao comments](https://okdata.online/apis/toutiao/posts/comments/list/) | `toutiao.posts.comments.list` | Comment[] | $0.002 per call · about 20 comments per page |
| [Toutiao account profile](https://okdata.online/apis/toutiao/users/get/) | `toutiao.users.get` | Account | $0.002 per call |
| [Toutiao hot board](https://okdata.online/apis/toutiao/trends/list/) | `toutiao.trends.list` | Trend[] | $0.002 per call · about 50 board entries per page |

## Good for

- Content research: `toutiao.articles.get`, `toutiao.videos.get`
- Competitor monitoring: `toutiao.articles.get`, `toutiao.videos.get`, `toutiao.users.get`
- Word of mouth: `toutiao.posts.comments.list`
- Creator discovery: `toutiao.users.get`
- Trend research: `toutiao.trends.list`
