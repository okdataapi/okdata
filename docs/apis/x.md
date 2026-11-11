# X (Twitter) API

> Posts, accounts, search and trends.

Canonical page: https://okdata.online/apis/x/

5 endpoints, $0.001 to $0.009 per call. Region: Global. No X (Twitter) login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [X post detail](https://okdata.online/apis/x/posts/get/) | `x.posts.get` | Post | $0.001 per call |
| [X post search](https://okdata.online/apis/x/posts/search/) | `x.posts.search` | Post[] | $0.006 per call · about 20 posts per page |
| [X account profile](https://okdata.online/apis/x/users/get/) | `x.users.get` | Account | $0.001 per call |
| [X account posts](https://okdata.online/apis/x/users/posts/list/) | `x.users.posts.list` | Post[] | $0.006 per call · about 20 posts per page |
| [X trending topics](https://okdata.online/apis/x/trends/list/) | `x.trends.list` | Trend[] | $0.009 per call · about 30 board entries per page |

## Good for

- Competitor monitoring: `x.posts.get`, `x.users.get`, `x.users.posts.list`
- Content research: `x.posts.get`
- Word of mouth: `x.posts.search`
- Trend research: `x.posts.search`, `x.trends.list`
- Creator discovery: `x.users.get`
