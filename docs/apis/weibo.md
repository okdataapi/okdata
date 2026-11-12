# Weibo API

> Posts, accounts and the hot search list.

Canonical page: https://okdata.online/apis/weibo/

11 endpoints, $0.002 to $0.0025 per call. Region: Mainland China. No Weibo login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Weibo post search](https://okdata.online/apis/weibo/posts/search/) | `weibo.posts.search` | Post[] | $0.002 per call · about 10 posts per page |
| [Weibo hot search](https://okdata.online/apis/weibo/trends/list/) | `weibo.trends.list` | Trend[] | $0.002 per call · about 50 board entries per page |
| [Weibo account profile](https://okdata.online/apis/weibo/users/get/) | `weibo.users.get` | Account | $0.002 per call |
| [Weibo post detail](https://okdata.online/apis/weibo/posts/get/) | `weibo.posts.get` | Post | $0.002 per call |
| [Weibo post comments](https://okdata.online/apis/weibo/posts/comments/list/) | `weibo.posts.comments.list` | Comment[] | $0.002 per call · about 20 comments per page |
| [Weibo comment replies](https://okdata.online/apis/weibo/comments/replies/list/) | `weibo.comments.replies.list` | Comment[] | $0.002 per call · about 20 comments per page |
| [Weibo post likers](https://okdata.online/apis/weibo/posts/likers/list/) | `weibo.posts.likers.list` | Account[] | $0.002 per call · about 50 accounts per page |
| [Weibo account posts](https://okdata.online/apis/weibo/users/posts/list/) | `weibo.users.posts.list` | Post[] | $0.002 per call · about 20 posts per page |
| [Weibo account followers](https://okdata.online/apis/weibo/users/followers/list/) | `weibo.users.followers.list` | Account[] | $0.002 per call · about 20 accounts per page |
| [Weibo account search](https://okdata.online/apis/weibo/users/search/) | `weibo.users.search` | Account[] | $0.002 per call · about 20 accounts per page |
| [Weibo hot search (backup)](https://okdata.online/apis/weibo/backup/trends/list/) | `weibo.backup.trends.list` | Trend[] | $0.0025 per call · about 50 board entries per page |

## Good for

- Word of mouth: `weibo.posts.search`, `weibo.posts.comments.list`, `weibo.comments.replies.list`, `weibo.posts.likers.list`
- Trend research: `weibo.posts.search`, `weibo.trends.list`, `weibo.backup.trends.list`
- Competitor monitoring: `weibo.users.get`, `weibo.posts.get`, `weibo.users.posts.list`, `weibo.users.followers.list`, `weibo.users.search`
- Creator discovery: `weibo.users.get`, `weibo.posts.likers.list`, `weibo.users.followers.list`, `weibo.users.search`
- Content research: `weibo.posts.get`, `weibo.users.posts.list`
