# Weibo API

> Posts, accounts and the hot search list.

Canonical page: https://okdata.online/apis/weibo/

3 endpoints, $0.002 to $0.002 per call. Region: Mainland China. No Weibo login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Weibo post search](https://okdata.online/apis/weibo/posts/search/) | `weibo.posts.search` | Post[] | $0.002 per call · about 10 posts per page |
| [Weibo hot search](https://okdata.online/apis/weibo/trends/list/) | `weibo.trends.list` | Trend[] | $0.002 per call · about 50 board entries per page |
| [Weibo account profile](https://okdata.online/apis/weibo/users/get/) | `weibo.users.get` | Account | $0.002 per call |

## Good for

- Word of mouth: `weibo.posts.search`
- Trend research: `weibo.posts.search`, `weibo.trends.list`
- Competitor monitoring: `weibo.users.get`
- Creator discovery: `weibo.users.get`
