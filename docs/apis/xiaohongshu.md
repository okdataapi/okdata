# Xiaohongshu (RedNote) API

> Lifestyle notes, creators and what people search for.

Canonical page: https://okdata.online/apis/xiaohongshu/

6 endpoints, $0.02 to $0.02 per call. Region: Mainland China. No Xiaohongshu (RedNote) login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Xiaohongshu note search](https://okdata.online/apis/xiaohongshu/notes/search/) | `xiaohongshu.notes.search` | Post[] | $0.02 per call · about 20 notes per page |
| [Xiaohongshu note detail](https://okdata.online/apis/xiaohongshu/notes/get/) | `xiaohongshu.notes.get` | Post | $0.02 per call |
| [Xiaohongshu note comments](https://okdata.online/apis/xiaohongshu/notes/comments/list/) | `xiaohongshu.notes.comments.list` | Comment[] | $0.02 per call · about 10 comments per page |
| [Xiaohongshu account profile](https://okdata.online/apis/xiaohongshu/users/get/) | `xiaohongshu.users.get` | Account | $0.02 per call |
| [Xiaohongshu account notes](https://okdata.online/apis/xiaohongshu/users/notes/list/) | `xiaohongshu.users.notes.list` | Post[] | $0.02 per call · about 20 notes per page |
| [Xiaohongshu hot topics](https://okdata.online/apis/xiaohongshu/trends/list/) | `xiaohongshu.trends.list` | Trend[] | $0.02 per call · about 20 board entries per page |

## Good for

- Content research: `xiaohongshu.notes.search`, `xiaohongshu.notes.get`
- Word of mouth: `xiaohongshu.notes.search`, `xiaohongshu.notes.comments.list`
- Competitor monitoring: `xiaohongshu.notes.search`, `xiaohongshu.notes.get`, `xiaohongshu.users.get`, `xiaohongshu.users.notes.list`
- Creator discovery: `xiaohongshu.users.get`, `xiaohongshu.users.notes.list`
- Trend research: `xiaohongshu.trends.list`
