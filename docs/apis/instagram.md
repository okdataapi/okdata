# Instagram API

> Profiles, posts and reels, comments, hashtags and what a reel says.

Canonical page: https://okdata.online/apis/instagram/

8 endpoints, $0.002 to $0.004 per call. Region: Global. No Instagram login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Instagram account profile](https://okdata.online/apis/instagram/users/get/) | `instagram.users.get` | Account | $0.004 per call |
| [Instagram account posts](https://okdata.online/apis/instagram/users/posts/list/) | `instagram.users.posts.list` | Post[] | $0.004 per call · about 12 posts per page |
| [Instagram post detail](https://okdata.online/apis/instagram/posts/get/) | `instagram.posts.get` | Post | $0.004 per call |
| [Instagram post comments](https://okdata.online/apis/instagram/posts/comments/list/) | `instagram.posts.comments.list` | Comment[] | $0.004 per call · about 15 comments per page |
| [Instagram comment replies](https://okdata.online/apis/instagram/comments/replies/list/) | `instagram.comments.replies.list` | Comment[] | $0.004 per call · about 15 comments per page |
| [Instagram hashtag posts](https://okdata.online/apis/instagram/hashtags/posts/list/) | `instagram.hashtags.posts.list` | Post[] | $0.004 per call · about 10 posts per page |
| [Instagram reel transcript](https://okdata.online/apis/instagram/posts/transcript/get/) | `instagram.posts.transcript.get` | Transcript | $0.004 per call |
| [Instagram account search](https://okdata.online/apis/instagram/users/search/) | `instagram.users.search` | Account[] | $0.002 per call · about 20 accounts per page |

## Good for

- Creator discovery: `instagram.users.get`, `instagram.users.search`
- Competitor monitoring: `instagram.users.get`, `instagram.users.posts.list`, `instagram.posts.get`, `instagram.users.search`
- Content research: `instagram.users.posts.list`, `instagram.posts.get`, `instagram.hashtags.posts.list`, `instagram.posts.transcript.get`
- Word of mouth: `instagram.posts.comments.list`, `instagram.comments.replies.list`
- Trend research: `instagram.hashtags.posts.list`
- Transcripts: `instagram.posts.transcript.get`
