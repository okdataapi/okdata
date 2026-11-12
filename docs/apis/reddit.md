# Reddit API

> Posts, comments, communities, people and what is trending.

Canonical page: https://okdata.online/apis/reddit/

11 endpoints, $0.002 to $0.004 per call. Region: Global. No Reddit login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Reddit post search](https://okdata.online/apis/reddit/posts/search/) | `reddit.posts.search` | Post[] | $0.004 per call · about 25 posts per page |
| [Reddit post detail](https://okdata.online/apis/reddit/posts/get/) | `reddit.posts.get` | Post | $0.002 per call |
| [Reddit post comments](https://okdata.online/apis/reddit/posts/comments/list/) | `reddit.posts.comments.list` | Comment[] | $0.002 per call · about 10 comments per page |
| [Reddit Popular feed](https://okdata.online/apis/reddit/popular/posts/list/) | `reddit.popular.posts.list` | Post[] | $0.002 per call · about 10 posts per page |
| [Reddit community posts](https://okdata.online/apis/reddit/subreddits/posts/list/) | `reddit.subreddits.posts.list` | Post[] | $0.004 per call · about 25 posts per page |
| [Reddit community profile](https://okdata.online/apis/reddit/subreddits/get/) | `reddit.subreddits.get` | Account | $0.002 per call |
| [Reddit trending searches](https://okdata.online/apis/reddit/trends/list/) | `reddit.trends.list` | Trend[] | $0.002 per call · about 6 board entries per page |
| [Reddit user profile](https://okdata.online/apis/reddit/users/get/) | `reddit.users.get` | Account | $0.002 per call |
| [Reddit user posts](https://okdata.online/apis/reddit/users/posts/list/) | `reddit.users.posts.list` | Post[] | $0.002 per call · about 25 posts per page |
| [Reddit user active communities](https://okdata.online/apis/reddit/users/subreddits/list/) | `reddit.users.subreddits.list` | Account[] | $0.002 per call · about 30 accounts per page |
| [Reddit video transcript](https://okdata.online/apis/reddit/posts/transcript/get/) | `reddit.posts.transcript.get` | Transcript | $0.004 per call |

## Good for

- Word of mouth: `reddit.posts.search`, `reddit.posts.comments.list`
- Content research: `reddit.posts.search`, `reddit.posts.get`, `reddit.subreddits.posts.list`, `reddit.subreddits.get`, `reddit.posts.transcript.get`
- Competitor monitoring: `reddit.posts.get`, `reddit.subreddits.posts.list`, `reddit.subreddits.get`, `reddit.users.get`, `reddit.users.posts.list`
- Trend research: `reddit.popular.posts.list`, `reddit.trends.list`
- Creator discovery: `reddit.users.get`, `reddit.users.subreddits.list`
- Transcripts: `reddit.posts.transcript.get`
