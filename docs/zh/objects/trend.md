# Trend

> 热搜榜或趋势榜上的一条。

网页版：https://okdata.online/zh/docs/objects/trend/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `rank` | integer | 榜单排名，1 为第一。 |
| `name` | string | 话题或搜索词。 |
| `heat` | number \| null | 平台给出的热度值，各平台口径不同。 |
| `url` | string \| null | 话题页链接（有的话）。 |

## 返回 Trend 的接口

- [抖音热搜榜](https://okdata.online/zh/apis/douyin/trends/list/) (`douyin.trends.list`): $0.002/次 · 每页约 50 条榜单
- [小红书热点话题](https://okdata.online/zh/apis/xiaohongshu/trends/list/) (`xiaohongshu.trends.list`): $0.02/次 · 每页约 20 条榜单
- [B站热搜榜](https://okdata.online/zh/apis/bilibili/trends/list/) (`bilibili.trends.list`): $0.002/次 · 每页约 50 条榜单
- [微博热搜](https://okdata.online/zh/apis/weibo/trends/list/) (`weibo.trends.list`): $0.002/次 · 每页约 50 条榜单
- [X 趋势](https://okdata.online/zh/apis/x/trends/list/) (`x.trends.list`): $0.009/次 · 每页约 30 条榜单
- [Reddit 趋势搜索](https://okdata.online/zh/apis/reddit/trends/list/) (`reddit.trends.list`): $0.002/次 · 每页约 6 条榜单
- [快手热榜](https://okdata.online/zh/apis/kuaishou/trends/list/) (`kuaishou.trends.list`): $0.002/次 · 每页约 51 条榜单
- [抖音巨量算数实时热点](https://okdata.online/zh/apis/douyin/index/trends/list/) (`douyin.index.trends.list`): $0.002/次 · 每页约 30 条榜单
- [微博热搜榜（备用版）](https://okdata.online/zh/apis/weibo/backup/trends/list/) (`weibo.backup.trends.list`): $0.0025/次 · 每页约 50 条榜单
