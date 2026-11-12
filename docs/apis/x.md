# X (Twitter) API

> Posts, accounts, search and trends.

Canonical page: https://okdata.online/apis/x/

20 endpoints, $0.0001 to $0.009 per call. Region: Global. No X (Twitter) login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [X post detail](https://okdata.online/apis/x/posts/get/) | `x.posts.get` | Post | $0.0003 per call |
| [X post search](https://okdata.online/apis/x/posts/search/) | `x.posts.search` | Post[] | $0.002 per call · about 20 posts per page |
| [X account profile](https://okdata.online/apis/x/users/get/) | `x.users.get` | Account | $0.0004 per account · at most $0.04 per call |
| [X account posts](https://okdata.online/apis/x/users/posts/list/) | `x.users.posts.list` | Post[] | $0.002 per call · about 20 posts per page |
| [X trending topics](https://okdata.online/apis/x/trends/list/) | `x.trends.list` | Trend[] | $0.009 per call · about 30 board entries per page |
| [X post replies](https://okdata.online/apis/x/posts/replies/list/) | `x.posts.replies.list` | Post[] | $0.002 per call · about 35 posts per page |
| [X post quotes](https://okdata.online/apis/x/posts/quotes/list/) | `x.posts.quotes.list` | Post[] | $0.0003 per post · at most $0.006 per call |
| [X post retweeters](https://okdata.online/apis/x/posts/retweeters/list/) | `x.posts.retweeters.list` | Account[] | $0.002 per call · about 100 accounts per page |
| [X article](https://okdata.online/apis/x/posts/article/get/) | `x.posts.article.get` | Post | $0.002 per call |
| [X thread](https://okdata.online/apis/x/threads/posts/list/) | `x.threads.posts.list` | Post[] | $0.0003 per post · at most $0.015 per call |
| [X account search](https://okdata.online/apis/x/users/search/) | `x.users.search` | Account[] | $0.0004 per account · at most $0.008 per call |
| [X account followers](https://okdata.online/apis/x/users/followers/list/) | `x.users.followers.list` | Account[] | $0.0001 per account · at most $0.02 per call |
| [X account following](https://okdata.online/apis/x/users/following/list/) | `x.users.following.list` | Account[] | $0.0001 per account · at most $0.02 per call |
| [X account mentions](https://okdata.online/apis/x/users/mentions/list/) | `x.users.mentions.list` | Post[] | $0.0003 per post · at most $0.006 per call |
| [X list posts](https://okdata.online/apis/x/lists/posts/list/) | `x.lists.posts.list` | Post[] | $0.002 per call · about 100 posts per page |
| [X list members](https://okdata.online/apis/x/lists/members/list/) | `x.lists.members.list` | Account[] | $0.0004 per account · at most $0.008 per call |
| [X list followers](https://okdata.online/apis/x/lists/followers/list/) | `x.lists.followers.list` | Account[] | $0.0004 per account · at most $0.008 per call |
| [X community profile](https://okdata.online/apis/x/communities/get/) | `x.communities.get` | Community | $0.0004 per call |
| [X community posts](https://okdata.online/apis/x/communities/posts/list/) | `x.communities.posts.list` | Post[] | $0.0003 per post · at most $0.006 per call |
| [X community members](https://okdata.online/apis/x/communities/members/list/) | `x.communities.members.list` | Account[] | $0.0004 per account · at most $0.008 per call |

## Good for

- Competitor monitoring: `x.posts.get`, `x.users.get`, `x.users.posts.list`, `x.users.search`, `x.users.followers.list`, `x.users.following.list`, `x.users.mentions.list`, `x.lists.posts.list`
- Content research: `x.posts.get`, `x.posts.article.get`, `x.threads.posts.list`, `x.communities.get`, `x.communities.posts.list`
- Word of mouth: `x.posts.search`, `x.posts.replies.list`, `x.posts.quotes.list`, `x.posts.retweeters.list`, `x.users.mentions.list`, `x.communities.posts.list`
- Trend research: `x.posts.search`, `x.trends.list`
- Creator discovery: `x.users.get`, `x.posts.retweeters.list`, `x.users.search`, `x.users.followers.list`, `x.users.following.list`, `x.lists.members.list`, `x.lists.followers.list`, `x.communities.members.list`
