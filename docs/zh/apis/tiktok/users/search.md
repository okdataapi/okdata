# TikTok 账号搜索 API

> 按关键词找 TikTok 账号，每页 30 个：用户名、名称、头像、粉丝数、关注数、作品数和获赞数。

网页版：https://okdata.online/zh/apis/tiktok/users/search/

- **接口**：`GET /v1/tiktok/users/search`
- **ID**：`tiktok.users.search`
- **价格**：$0.002/次 · 每页约 30 个账号
- **返回**：一页约 30 个账号（`data.items`，Account 对象）
- **状态**：稳定
- **适合**：找博主、竞品监控

## 价格

每次调用 $0.002，返回一页，约 30 个账号。抓 1,000 个账号大约要 34 次调用，合计 $0.068。每翻一页是一次单独的调用；失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `query` | string | 是 |  | 关键词，和在平台搜索框里输入的一样。（例：`nike`） |
| `cursor` | string | 否 |  | 上一次返回的 page.next_cursor，原样传回。每翻一页都是一次单独的调用。 |
| `view` | string: compact / standard / full | 否 | `standard` | 返回多少字段。full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [Account](https://okdata.online/zh/docs/objects/account/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 账号在平台上的 ID。 |
| `url` | string | 主页链接。 |
| `username` | string \| null | 用户名（平台有的话）。 |
| `name` | string | 昵称。 |
| `bio` | string \| null | 简介。 |
| `avatar_url` | string \| null | 头像图片地址。 |
| `verified` | boolean \| null | 平台是否显示认证标识。 |
| `followers` | integer \| null | 粉丝数。 |
| `following` | integer \| null | 关注数。 |
| `posts` | integer \| null | 发布的作品、笔记或文章数。 |
| `likes` | integer \| null | 累计获赞（平台展示的话）。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/tiktok/users/search" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'query=nike'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/tiktok/users/search",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"query": "nike"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["name"], row["followers"])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/tiktok/users/search');
url.searchParams.set('query', "nike");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.name, row.followers);
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "tiktok.users.search",
    "query": "nike"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「TikTok 账号搜索」查这个账号的粉丝数，说说它主要发什么。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "6812345678901234567",
        "url": "https://www.tiktok.com/@trailkit",
        "username": "trailkit",
        "name": "Trail Kit",
        "bio": "Light packs, long walks.",
        "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
        "verified": true,
        "followers": 182300,
        "following": 312,
        "posts": 486,
        "likes": 2310000
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "tiktok.users.search",
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

### TikTok 账号搜索接口多少钱？

每次调用 $0.002，返回一页，约 30 个账号。抓 1,000 个账号大约要 34 次调用，合计 $0.068。每翻一页是一次单独的调用；失败的调用不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.002 的调用。

### 需要TikTok账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是TikTok上的公开数据，不会用到你自己的TikTok账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### TikTok不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## TikTok的其他接口

- [TikTok 视频搜索](https://okdata.online/zh/apis/tiktok/videos/search/)：$0.002/次 · 每页约 30 条视频
- [TikTok 视频详情](https://okdata.online/zh/apis/tiktok/videos/get/)：$0.002/次
- [TikTok 视频评论](https://okdata.online/zh/apis/tiktok/videos/comments/list/)：$0.002/次 · 每页约 50 条评论
- [TikTok 账号信息](https://okdata.online/zh/apis/tiktok/users/get/)：$0.002/次
- [TikTok 广告库搜索](https://okdata.online/zh/apis/tiktok/ads/search/)：$0.004/次 · 每页约 12 条广告
- [TikTok 创意中心热门广告](https://okdata.online/zh/apis/tiktok/creative_center/ads/search/)：$0.002/次 · 每页约 20 条广告
- [TikTok Shop 商品搜索](https://okdata.online/zh/apis/tiktok/shop/products/search/)：$0.004/次 · 每页约 20 个商品
- [TikTok Shop 商品详情](https://okdata.online/zh/apis/tiktok/shop/products/get/)：$0.002/次
- [TikTok Shop 商品评价](https://okdata.online/zh/apis/tiktok/shop/products/reviews/list/)：$0.002/次 · 每页约 20 条评价
- [TikTok 视频字幕](https://okdata.online/zh/apis/tiktok/videos/transcript/get/)：$0.002/次
- [TikTok 评论回复](https://okdata.online/zh/apis/tiktok/comments/replies/list/)：$0.002/次 · 每页约 20 条评论
- [TikTok 账号作品](https://okdata.online/zh/apis/tiktok/users/videos/list/)：$0.002/次 · 每页约 10 条视频
- [TikTok 创意中心热门广告详情](https://okdata.online/zh/apis/tiktok/creative_center/ads/get/)：$0.002/次
- [TikTok Shop 店铺商品](https://okdata.online/zh/apis/tiktok/shop/sellers/products/list/)：$0.002/次 · 每页约 20 个商品
- [TikTok 账号粉丝列表](https://okdata.online/zh/apis/tiktok/users/followers/list/)：$0.002/次 · 每页约 20 个账号
- [TikTok 话题作品](https://okdata.online/zh/apis/tiktok/hashtags/videos/list/)：$0.002/次 · 每页约 20 条视频
