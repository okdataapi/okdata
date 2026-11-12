# YouTube API

> Videos, comments and transcripts.

Canonical page: https://okdata.online/apis/youtube/

7 endpoints, $0.002 to $0.004 per call. Region: Global. No YouTube login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [YouTube video search](https://okdata.online/apis/youtube/videos/search/) | `youtube.videos.search` | Post[] | $0.004 per call · about 20 videos per page |
| [YouTube video detail](https://okdata.online/apis/youtube/videos/get/) | `youtube.videos.get` | Post | $0.002 per call |
| [YouTube video comments](https://okdata.online/apis/youtube/videos/comments/list/) | `youtube.videos.comments.list` | Comment[] | $0.002 per call · about 20 comments per page |
| [YouTube video transcript](https://okdata.online/apis/youtube/videos/transcript/get/) | `youtube.videos.transcript.get` | Transcript | $0.004 per call |
| [YouTube comment replies](https://okdata.online/apis/youtube/comments/replies/list/) | `youtube.comments.replies.list` | Comment[] | $0.002 per call · about 10 comments per page |
| [YouTube channel posts](https://okdata.online/apis/youtube/channels/posts/list/) | `youtube.channels.posts.list` | Post[] | $0.002 per call · about 10 posts per page |
| [YouTube post detail](https://okdata.online/apis/youtube/posts/get/) | `youtube.posts.get` | Post | $0.002 per call |

## Good for

- Content research: `youtube.videos.search`, `youtube.videos.transcript.get`, `youtube.channels.posts.list`, `youtube.posts.get`
- Competitor monitoring: `youtube.videos.get`, `youtube.channels.posts.list`, `youtube.posts.get`
- Word of mouth: `youtube.videos.comments.list`, `youtube.comments.replies.list`
- Transcripts: `youtube.videos.transcript.get`
