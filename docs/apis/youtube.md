# YouTube API

> Videos, comments and transcripts.

Canonical page: https://okdata.online/apis/youtube/

4 endpoints, $0.004 to $0.004 per call. Region: Global. No YouTube login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [YouTube video search](https://okdata.online/apis/youtube/videos/search/) | `youtube.videos.search` | Post[] | $0.004 per call · about 20 videos per page |
| [YouTube video detail](https://okdata.online/apis/youtube/videos/get/) | `youtube.videos.get` | Post | $0.004 per call |
| [YouTube video comments](https://okdata.online/apis/youtube/videos/comments/list/) | `youtube.videos.comments.list` | Comment[] | $0.004 per call · about 20 comments per page |
| [YouTube video transcript](https://okdata.online/apis/youtube/videos/transcript/get/) | `youtube.videos.transcript.get` | Transcript | $0.004 per call |

## Good for

- Content research: `youtube.videos.search`, `youtube.videos.transcript.get`
- Competitor monitoring: `youtube.videos.get`
- Word of mouth: `youtube.videos.comments.list`
- Transcripts: `youtube.videos.transcript.get`
