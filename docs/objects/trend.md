# Trend

> One row of a hot search or trending board.

Canonical page: https://okdata.online/docs/objects/trend/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `rank` | integer | Position on the board, 1 is the top. |
| `name` | string | The topic or search term. |
| `heat` | number \| null | The heat score the platform shows; scales differ by platform. |
| `url` | string \| null | Link to the topic page, if there is one. |

## Endpoints that return a Trend

- [Douyin hot search board](https://okdata.online/apis/douyin/trends/list/) (`douyin.trends.list`): $0.002 per call · about 50 board entries per page
- [Xiaohongshu hot topics](https://okdata.online/apis/xiaohongshu/trends/list/) (`xiaohongshu.trends.list`): $0.02 per call · about 20 board entries per page
- [Bilibili popular board](https://okdata.online/apis/bilibili/trends/list/) (`bilibili.trends.list`): $0.002 per call · about 50 board entries per page
- [Weibo hot search](https://okdata.online/apis/weibo/trends/list/) (`weibo.trends.list`): $0.002 per call · about 50 board entries per page
- [X trending topics](https://okdata.online/apis/x/trends/list/) (`x.trends.list`): $0.009 per call · about 30 board entries per page
