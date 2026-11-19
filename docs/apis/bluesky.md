# Bluesky API

> The open social network: profiles, what an account posts, the replies under a post, and account search.

Canonical page: https://okdata.online/apis/bluesky/

5 endpoints, $0.001 to $0.001 per call. Region: Global. No Bluesky login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Bluesky profile](https://okdata.online/apis/bluesky/users/get/) | `bluesky.users.get` | Account | $0.001 per call |
| [Bluesky account search](https://okdata.online/apis/bluesky/users/search/) | `bluesky.users.search` | Account[] | $0.001 per call · about 25 accounts per page |
| [Bluesky account posts](https://okdata.online/apis/bluesky/users/posts/list/) | `bluesky.users.posts.list` | Post[] | $0.001 per call · about 30 posts per page |
| [Bluesky post](https://okdata.online/apis/bluesky/posts/get/) | `bluesky.posts.get` | Post | $0.001 per call |
| [Bluesky post replies](https://okdata.online/apis/bluesky/posts/comments/list/) | `bluesky.posts.comments.list` | Comment[] | $0.001 per call · about 200 comments per page |

## Good for

- Creator discovery: `bluesky.users.get`, `bluesky.users.search`
- Competitor monitoring: `bluesky.users.get`, `bluesky.users.posts.list`, `bluesky.posts.get`
- Content research: `bluesky.users.posts.list`, `bluesky.posts.get`
- Word of mouth: `bluesky.posts.comments.list`
