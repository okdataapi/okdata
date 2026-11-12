# 抖音热搜榜 API

> 当前热搜榜，带排名和热度。

网页版：https://okdata.online/zh/apis/douyin/trends/list/

- **接口**：`GET /v1/douyin/trends/list`
- **ID**：`douyin.trends.list`
- **价格**：$0.002/次 · 每页约 50 条榜单
- **返回**：一页约 50 条榜单（`data.items`，Trend 对象）
- **状态**：预览
- **适合**：热点研究

## 价格

每次调用 $0.002，返回一页，约 50 条榜单。抓 1,000 条榜单大约要 20 次调用，合计 $0.04。每翻一页是一次单独的调用；失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `cursor` | string | 否 |  | 上一次返回的 page.next_cursor，原样传回。每翻一页都是一次单独的调用。 |
| `view` | string: compact / standard / full | 否 | `standard` | 返回多少字段。full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [Trend](https://okdata.online/zh/docs/objects/trend/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `rank` | integer | 榜单排名，1 为第一。 |
| `name` | string | 话题或搜索词。 |
| `heat` | number \| null | 平台给出的热度值，各平台口径不同。 |
| `url` | string \| null | 话题页链接（有的话）。 |

## 请求示例

### cURL

```bash
curl "https://api.okdata.online/v1/douyin/trends/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY"
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/douyin/trends/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["rank"], row["name"], row["heat"])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/douyin/trends/list');

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.rank, row.name, row.heat);
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "douyin.trends.list"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「抖音热搜榜」看看现在排名前十的是什么。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "rank": 1,
        "name": "初雪",
        "heat": 11820450,
        "url": "https://www.douyin.com/hot/2163450"
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "douyin.trends.list",
    "billing": {
      "amount": "0.002",
      "currency": "USD",
      "balance_after": "9.998"
    },
    "unavailable": {},
    "cached": false,
    "replayed": false,
    "fetched_at": "2026-11-11T08:00:00Z"
  }
}
```

## 错误

所有错误同一种结构：code、request_id、message 和 message_zh（每个 code 一句固定的话）、charged、retry、retry_after_seconds、param 和 docs_url，具体问题写在 problems 里。错误不扣费；只有 settlement_unknown 的扣费结果要查询后才知道。完整列表：https://okdata.online/zh/docs/errors/

## 常见问题

### 抖音热搜榜接口多少钱？

每次调用 $0.002，返回一页，约 50 条榜单。抓 1,000 条榜单大约要 20 次调用，合计 $0.04。每翻一页是一次单独的调用；失败的调用不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.002 的调用。

### 需要抖音账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是抖音上的公开数据，不会用到你自己的抖音账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### 抖音不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 抖音的其他接口

- [抖音视频搜索](https://okdata.online/zh/apis/douyin/videos/search/)：$0.02/次 · 每页约 20 条视频
- [抖音视频详情](https://okdata.online/zh/apis/douyin/videos/get/)：$0.002/次
- [抖音视频评论](https://okdata.online/zh/apis/douyin/videos/comments/list/)：$0.002/次 · 每页约 20 条评论
- [抖音账号信息](https://okdata.online/zh/apis/douyin/users/get/)：$0.002/次
- [抖音账号作品列表](https://okdata.online/zh/apis/douyin/users/videos/list/)：$0.002/次 · 每页约 20 条视频
- [抖音星图达人搜索](https://okdata.online/zh/apis/douyin/xingtu/creators/search/)：$0.004/次 · 每页约 20 位达人
- [抖音星图达人报价](https://okdata.online/zh/apis/douyin/xingtu/creators/rates/get/)：$0.04/次
- [抖音评论回复](https://okdata.online/zh/apis/douyin/comments/replies/list/)：$0.002/次 · 每页约 20 条评论
- [抖音话题视频](https://okdata.online/zh/apis/douyin/hashtags/videos/list/)：$0.002/次 · 每页约 10 条视频
- [抖音账号搜索](https://okdata.online/zh/apis/douyin/users/search/)：$0.002/次 · 每页约 30 个账号
- [抖音视频播放量](https://okdata.online/zh/apis/douyin/videos/metrics/)：$0.002/次
- [抖音相关视频](https://okdata.online/zh/apis/douyin/videos/related/)：$0.002/次 · 每页约 10 条视频
- [抖音视频榜](https://okdata.online/zh/apis/douyin/videos/trending/)：$0.002/次 · 每页约 9 条视频
- [抖音搜索框联想词](https://okdata.online/zh/apis/douyin/keywords/related/)：$0.02/次 · 每页约 10 条结果
- [抖音巨量算数品牌指数趋势](https://okdata.online/zh/apis/douyin/index/brands/history/)：$0.002/次
- [抖音巨量算数品牌指数对比](https://okdata.online/zh/apis/douyin/index/brands/metrics/)：$0.002/次
- [抖音巨量算数达人热门视频](https://okdata.online/zh/apis/douyin/index/creators/videos/list/)：$0.002/次 · 每页约 20 条视频
- [抖音巨量算数达人粉丝画像](https://okdata.online/zh/apis/douyin/index/creators/audience/get/)：$0.002/次
- [抖音巨量算数达人核心指标](https://okdata.online/zh/apis/douyin/index/creators/metrics/)：$0.002/次
- [抖音巨量算数关键词人群画像](https://okdata.online/zh/apis/douyin/index/keywords/audience/get/)：$0.002/次
- [抖音巨量算数关键词热度趋势](https://okdata.online/zh/apis/douyin/index/keywords/history/)：$0.006/次 · 每页约 1 条结果
- [抖音巨量算数关联词](https://okdata.online/zh/apis/douyin/index/keywords/related/)：$0.002/次 · 每页约 170 条结果
- [抖音巨量算数实时热点](https://okdata.online/zh/apis/douyin/index/trends/list/)：$0.002/次 · 每页约 30 条榜单
- [抖音巨量算数关键词热门视频](https://okdata.online/zh/apis/douyin/index/videos/search/)：$0.002/次 · 每页约 20 条视频
- [抖音达人互动与粉丝趋势](https://okdata.online/zh/apis/douyin/users/history/)：$0.002/次
- [抖音星图达人资料](https://okdata.online/zh/apis/douyin/xingtu/creators/get/)：$0.004/次
- [抖音星图达人粉丝画像](https://okdata.online/zh/apis/douyin/xingtu/creators/audience/get/)：$0.004/次
- [抖音星图达人传播数据](https://okdata.online/zh/apis/douyin/xingtu/creators/metrics/)：$0.004/次
- [抖音星图达人作品表现](https://okdata.online/zh/apis/douyin/xingtu/creators/videos/list/)：$0.004/次 · 每页约 20 条视频
- [抖音星图达人内容热词](https://okdata.online/zh/apis/douyin/xingtu/creators/keywords/get/)：$0.002/次
- [抖音星图达人星图指数](https://okdata.online/zh/apis/douyin/xingtu/creators/scores/get/)：$0.008/次
- [抖音星图达人内容分布](https://okdata.online/zh/apis/douyin/xingtu/creators/content_mix/get/)：$0.004/次
- [抖音星图达人转化能力](https://okdata.online/zh/apis/douyin/xingtu/creators/conversion/get/)：$0.004/次
- [抖音星图营销活动日历](https://okdata.online/zh/apis/douyin/xingtu/campaigns/list/)：$0.004/次 · 每页约 40 条结果
- [抖音星图视频数据报告](https://okdata.online/zh/apis/douyin/xingtu/videos/get/)：$0.004/次
- [抖音用户视频（备用版）](https://okdata.online/zh/apis/douyin/backup/users/videos/list/)：$0.0025/次 · 每页约 20 条视频
- [抖音视频搜索（备用版）](https://okdata.online/zh/apis/douyin/backup/videos/search/)：$0.03/次 · 每页约 8 条视频
