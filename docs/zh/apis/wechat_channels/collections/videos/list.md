# 视频号合集视频 API

> 视频号合集里的视频，按合集自己的顺序（从最早的开始），每页 20 条：描述、账号、发布时间、点赞、评论、转发和收藏、时长。url 是视频文件地址（已加密，用同一次返回的 ext.decode_key 解密）。

网页版：https://okdata.online/zh/apis/wechat_channels/collections/videos/list/

- **接口**：`GET /v1/wechat_channels/collections/videos/list`
- **ID**：`wechat_channels.collections.videos.list`
- **价格**：$0.02/次 · 每页约 20 条视频
- **返回**：一页约 20 条视频（`data.items`，Post 对象）
- **状态**：预览
- **适合**：内容调研、竞品监控

## 价格

每次调用 $0.02，返回一页，约 20 条视频。抓 1,000 条视频大约要 50 次调用，合计 $1.00。每翻一页是一次单独的调用；失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 是 |  | 合集 ID（数字）：wechat_channels.users.collections.list 返回的 id。（例：`14939347649320519707`） |
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
curl -G "https://api.okdata.online/v1/wechat_channels/collections/videos/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=14939347649320519707'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat_channels/collections/videos/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "14939347649320519707"},
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
const url = new URL('https://api.okdata.online/v1/wechat_channels/collections/videos/list');
url.searchParams.set('id', "14939347649320519707");

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
    "capability": "wechat_channels.collections.videos.list",
    "id": "14939347649320519707"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「视频号合集视频」找出点赞最多的五条内容，附链接。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "15051893554318805499",
        "url": "https://wxapp.tc.qq.com/251/20302/stodownload?encfilekey=example",
        "type": "video",
        "title": null,
        "text": "两晚山里露营，装备清单都在这了 #露营 #户外装备",
        "lang": "zh",
        "published_at": "2026-11-02T09:30:00Z",
        "author": {
          "id": "v2_060000231003b20faec8c6e4811dc1d4c602ee30b0771bbcf220c67926bb76ab7702ac335a53@finder",
          "username": null,
          "name": "轻装徒步",
          "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
          "followers": null,
          "verified": true
        },
        "metrics": {
          "views": null,
          "likes": 48200,
          "comments": 1312,
          "shares": 2210,
          "favorites": 9650,
          "reposts": null
        },
        "images": [
          "https://wxapp.tc.qq.com/251/20304/stodownload?encfilekey=cover"
        ],
        "hashtags": [
          "露营",
          "户外装备"
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
    "capability": "wechat_channels.collections.videos.list",
    "billing": {
      "amount": "0.02",
      "currency": "USD",
      "balance_after": "9.98"
    },
    "unavailable": {
      "metrics.views": "platform",
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

### 视频号合集视频接口多少钱？

每次调用 $0.02，返回一页，约 20 条视频。抓 1,000 条视频大约要 50 次调用，合计 $1.00。每翻一页是一次单独的调用；失败的调用不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.02 的调用。

### 需要微信视频号账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是微信视频号上的公开数据，不会用到你自己的微信视频号账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### 微信视频号不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 微信视频号的其他接口

- [视频号视频搜索](https://okdata.online/zh/apis/wechat_channels/videos/search/)：$0.02/次 · 每页约 10 条视频
- [视频号账号搜索](https://okdata.online/zh/apis/wechat_channels/users/search/)：$0.02/次 · 每页约 1 个账号
- [视频号账号信息](https://okdata.online/zh/apis/wechat_channels/users/get/)：$0.02/次
- [视频号账号作品](https://okdata.online/zh/apis/wechat_channels/users/videos/list/)：$0.02/次 · 每页约 15 条视频
- [视频号作品详情](https://okdata.online/zh/apis/wechat_channels/videos/get/)：$0.02/次
- [视频号作品评论](https://okdata.online/zh/apis/wechat_channels/videos/comments/list/)：$0.015/次 · 每页约 25 条评论
- [视频号评论回复](https://okdata.online/zh/apis/wechat_channels/comments/replies/list/)：$0.015/次 · 每页约 20 条评论
- [视频号直播回放](https://okdata.online/zh/apis/wechat_channels/users/live_replays/list/)：$0.02/次 · 每页约 48 条帖子
- [视频号作品分享链接](https://okdata.online/zh/apis/wechat_channels/videos/share_link/get/)：$0.02/次
- [视频号账号合集](https://okdata.online/zh/apis/wechat_channels/users/collections/list/)：$0.02/次 · 每页约 7 条结果
- [视频号作品互动数据](https://okdata.online/zh/apis/wechat_channels/videos/metrics/)：$0.015/次
- [视频号账号信息（备用版）](https://okdata.online/zh/apis/wechat_channels/backup/users/get/)：$0.03/次
- [视频号账号作品（备用版）](https://okdata.online/zh/apis/wechat_channels/backup/users/videos/list/)：$0.06/次 · 每页约 15 条视频
- [视频号视频搜索（备用版）](https://okdata.online/zh/apis/wechat_channels/backup/videos/search/)：$0.15/次 · 每页约 10 条视频
