# B站综合热门 API

> B站综合热门视频，每页 20 条：标题、简介、UP 主、播放、点赞、投币、收藏、弹幕、时长、分区、IP 属地和推荐理由。

网页版：https://okdata.online/zh/apis/bilibili/videos/trending/

- **接口**：`GET /v1/bilibili/videos/trending`
- **ID**：`bilibili.videos.trending`
- **价格**：$0.002/次 · 每页约 20 条视频
- **返回**：一页约 20 条视频（`data.items`，Post 对象）
- **状态**：预览
- **适合**：热点研究、内容调研

## 价格

每次调用 $0.002，返回一页，约 20 条视频。抓 1,000 条视频大约要 50 次调用，合计 $0.10。每翻一页是一次单独的调用；失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `cursor` | string | 否 |  | 上一次返回的 page.next_cursor，原样传回。每翻一页都是一次单独的调用。 |
| `view` | string: compact / standard / full | 否 | `standard` | 返回多少字段。full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [Post](https://okdata.online/zh/docs/objects/post/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 内容在平台上的 ID。 |
| `url` | string | 内容链接。 |
| `type` | string | 内容类型。 |
| `title` | string \| null | 标题（视频、笔记、文章才有）。 |
| `text` | string | 文案、正文或简介，纯文本；文章为 Markdown。 |
| `lang` | string \| null | 语言代码，平台给出或检测得到。 |
| `published_at` | string \| null | 发布时间，ISO 8601，UTC；只有平台不给时间时为 null（wechat_mp.articles.metrics、wechat_channels.videos.metrics），并列在 meta.unavailable 里。 |
| `author` | AccountRef | 发布者。 |
| `metrics` | Metrics | 抓取时的数据；平台不公开的为 null。 |
| `images` | string[] \| null | 图文内容的图片地址。 |
| `hashtags` | string[] \| null | 话题标签，不带 #。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl "https://api.okdata.online/v1/bilibili/videos/trending" \
  -H "Authorization: Bearer $OKDATA_API_KEY"
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/bilibili/videos/trending",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["id"], row["metrics"]["likes"], row["text"][:60])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/bilibili/videos/trending');

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.id, row.metrics.likes, row.text.slice(0, 60));
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "bilibili.videos.trending"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「B站综合热门」找出点赞最多的五条内容，附链接。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "BV1Gx4y1H7kQ",
        "url": "https://www.bilibili.com/video/BV1Gx4y1H7kQ",
        "type": "video",
        "title": "用 Claude Code 半小时做完一个爬虫面板",
        "text": "从零开始，全程不写一行 CSS。",
        "lang": "zh",
        "published_at": "2026-11-02T09:30:00Z",
        "author": {
          "id": "3546581234567890",
          "username": null,
          "name": "周末写代码",
          "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
          "followers": 88100,
          "verified": true
        },
        "metrics": {
          "views": 1250000,
          "likes": 48200,
          "comments": 1312,
          "shares": 2210,
          "favorites": 9650,
          "reposts": null
        },
        "images": null,
        "hashtags": [
          "编程",
          "AI"
        ]
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "bilibili.videos.trending",
    "billing": {
      "amount": "0.002",
      "currency": "USD",
      "balance_after": "9.998"
    },
    "unavailable": {
      "metrics.reposts": "platform"
    },
    "cached": false,
    "replayed": false,
    "fetched_at": "2026-11-11T08:00:00Z"
  }
}
```

## 错误

所有错误同一种结构：code、request_id、message 和 message_zh（每个 code 一句固定的话）、charged、retry、retry_after_seconds、param 和 docs_url，具体问题写在 problems 里。错误不扣费；只有 settlement_unknown 的扣费结果要查询后才知道。完整列表：https://okdata.online/zh/docs/errors/

## 常见问题

### B站综合热门接口多少钱？

每次调用 $0.002，返回一页，约 20 条视频。抓 1,000 条视频大约要 50 次调用，合计 $0.10。每翻一页是一次单独的调用；失败的调用不扣费。

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
- [B站热搜榜](https://okdata.online/zh/apis/bilibili/trends/list/)：$0.002/次 · 每页约 50 条榜单
- [B站用户资料](https://okdata.online/zh/apis/bilibili/users/get/)：$0.002/次
- [B站用户投稿](https://okdata.online/zh/apis/bilibili/users/videos/list/)：$0.002/次 · 每页约 30 条视频
- [B站评论回复](https://okdata.online/zh/apis/bilibili/comments/replies/list/)：$0.002/次 · 每页约 20 条评论
- [B站用户投稿（备用版）](https://okdata.online/zh/apis/bilibili/backup/users/videos/list/)：$0.0025/次 · 每页约 20 条视频
