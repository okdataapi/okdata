# B站视频评论 API

> 视频评论，按最热或最新。

网页版：https://okdata.online/zh/apis/bilibili/videos/comments/list/

- **接口**：`GET /v1/bilibili/videos/comments/list`
- **ID**：`bilibili.videos.comments.list`
- **价格**：$0.002/次 · 每页约 20 条评论
- **返回**：一页约 20 条评论（`data.items`，Comment 对象）
- **状态**：公测
- **适合**：口碑分析

## 价格

每次调用 $0.002，返回一页，约 20 条评论。抓 1,000 条评论大约要 50 次调用，合计 $0.10。每翻一页是一次单独的调用；失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 是 |  | 视频 ID。id 和 url 二选一。（例：`BV1xx411c7mD`） |
| `sort` | string: hot / latest | 否 | `hot` | 排序方式。 |
| `cursor` | string | 否 |  | 上一次返回的 page.next_cursor，原样传回。每翻一页都是一次单独的调用。 |
| `view` | string: compact / standard / full | 否 | `standard` | 返回多少字段。full 会在 ext 里带上平台特有字段。 |
| `fields` | string | 否 |  | 只保留这些字段，逗号分隔，用来省 token。 |

cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [Comment](https://okdata.online/zh/docs/objects/comment/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 评论 ID。 |
| `post_id` | string | 所属内容的 ID。 |
| `parent_id` | string \| null | 回复的上级评论；一级评论为 null。 |
| `text` | string | 评论内容。 |
| `published_at` | string | 发布时间，ISO 8601，UTC。 |
| `author` | AccountRef | 评论者。 |
| `likes` | integer \| null | 评论点赞数。 |
| `replies` | integer \| null | 回复数。 |
| `ip_location` | string \| null | 平台显示的 IP 属地（有的话）。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/bilibili/videos/comments/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=BV1xx411c7mD'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/bilibili/videos/comments/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "BV1xx411c7mD"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["likes"], row["text"])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/bilibili/videos/comments/list');
url.searchParams.set('id', "BV1xx411c7mD");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.likes, row.text);
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "endpoint": "bilibili.videos.comments.list",
    "params": {
      "id": "BV1xx411c7mD"
    }
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「B站视频评论」读前两页评论，总结大家夸什么、吐槽什么。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "7302000000000000001",
        "post_id": "7301234567890123456",
        "parent_id": null,
        "text": "三连了，求个仓库地址",
        "published_at": "2026-11-02T11:04:00Z",
        "author": {
          "id": "3546581234567890",
          "username": null,
          "name": "周末写代码",
          "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
          "followers": 88100,
          "verified": true
        },
        "likes": 214,
        "replies": 9,
        "ip_location": "广东"
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "bilibili.videos.comments.list",
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

所有错误同一种结构，都不扣费；只有超时的扣费结果要查询后才知道。完整列表：https://okdata.online/zh/docs/errors/

## 常见问题

### B站视频评论接口多少钱？

每次调用 $0.002，返回一页，约 20 条评论。抓 1,000 条评论大约要 50 次调用，合计 $0.10。每翻一页是一次单独的调用；失败的调用不扣费。

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
- [B站热门榜](https://okdata.online/zh/apis/bilibili/trends/list/)：$0.002/次 · 每页约 50 条榜单
