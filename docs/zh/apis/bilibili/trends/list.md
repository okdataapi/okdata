# B站热搜榜 API

> B站当前的热搜词，最多 50 个，带名次和热度。

网页版：https://okdata.online/zh/apis/bilibili/trends/list/

- **接口**：`GET /v1/bilibili/trends/list`
- **ID**：`bilibili.trends.list`
- **价格**：$0.002/次 · 每页约 50 条榜单
- **返回**：一页约 50 条榜单（`data.items`，Trend 对象）
- **状态**：预览
- **适合**：热点研究

## 价格

每次调用 $0.002，返回一页，约 50 条榜单。抓 1,000 条榜单大约要 20 次调用，合计 $0.04。每翻一页是一次单独的调用；失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `board` | string: hot_search | 否 | `hot_search` | 哪个榜：现在只有热搜榜。 |
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
curl "https://api.okdata.online/v1/bilibili/trends/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY"
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/bilibili/trends/list",
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
const url = new URL('https://api.okdata.online/v1/bilibili/trends/list');

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
    "capability": "bilibili.trends.list"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「B站热搜榜」看看现在排名前十的是什么。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "rank": 1,
        "name": "用 Claude Code 半小时做完一个爬虫面板",
        "heat": 1250000,
        "url": "https://www.bilibili.com/video/BV1Gx4y1H7kQ"
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "bilibili.trends.list",
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

### B站热搜榜接口多少钱？

每次调用 $0.002，返回一页，约 50 条榜单。抓 1,000 条榜单大约要 20 次调用，合计 $0.04。每翻一页是一次单独的调用；失败的调用不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.002 的调用。

### 需要B站账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是B站上的公开数据，不会用到你自己的B站账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### B站不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## B站的其他接口

- [B站视频搜索](https://okdata.online/zh/apis/bilibili/videos/search/)：$0.002/次 · 每页约 20 条视频
- [B站视频详情](https://okdata.online/zh/apis/bilibili/videos/get/)：$0.002/次
- [B站视频评论](https://okdata.online/zh/apis/bilibili/videos/comments/list/)：$0.002/次 · 每页约 20 条评论
- [B站用户资料](https://okdata.online/zh/apis/bilibili/users/get/)：$0.002/次
- [B站用户投稿](https://okdata.online/zh/apis/bilibili/users/videos/list/)：$0.002/次 · 每页约 30 条视频
- [B站评论回复](https://okdata.online/zh/apis/bilibili/comments/replies/list/)：$0.002/次 · 每页约 20 条评论
- [B站综合热门](https://okdata.online/zh/apis/bilibili/videos/trending/)：$0.002/次 · 每页约 20 条视频
- [B站用户投稿（备用版）](https://okdata.online/zh/apis/bilibili/backup/users/videos/list/)：$0.0025/次 · 每页约 20 条视频
