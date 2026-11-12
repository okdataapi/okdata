# 微信公众号实时查找 API

> 按关键词在微信搜一搜里实时找公众号和服务号，最像的排前面（后面可能跟着不太相关的）：原始 ID、微信号、名称、简介、头像、是否认证和认证主体、原创文章数。按次计费；不带粉丝和阅读数（要估计值用 wechat_mp.accounts.search）。

网页版：https://okdata.online/zh/apis/wechat/accounts/search/

- **接口**：`GET /v1/wechat/accounts/search`
- **ID**：`wechat.accounts.search`
- **价格**：$0.02/次 · 每页约 8 个账号
- **返回**：一页约 8 个账号（`data.items`，Account 对象）
- **状态**：预览
- **适合**：竞品监控、找博主

## 价格

每次调用 $0.02，返回一页，约 8 个账号。抓 1,000 个账号大约要 125 次调用，合计 $2.50。每翻一页是一次单独的调用；失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `query` | string | 是 |  | 关键词，和在平台搜索框里输入的一样。（例：`36氪`） |
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
curl -G "https://api.okdata.online/v1/wechat/accounts/search" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'query=36氪'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat/accounts/search",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"query": "36氪"},
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
const url = new URL('https://api.okdata.online/v1/wechat/accounts/search');
url.searchParams.set('query', "36氪");

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
    "capability": "wechat.accounts.search",
    "query": "36氪"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「微信公众号实时查找」查这个账号的粉丝数，说说它主要发什么。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "MS4wLjABAAAAx7",
        "url": "https://example.com/user/trailkit",
        "username": "trailkit",
        "name": "轻装徒步",
        "bio": "轻装，走远路。周更露营和徒步装备。",
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
    "capability": "wechat.accounts.search",
    "billing": {
      "amount": "0.02",
      "currency": "USD",
      "balance_after": "9.98"
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

### 微信公众号实时查找接口多少钱？

每次调用 $0.02，返回一页，约 8 个账号。抓 1,000 个账号大约要 125 次调用，合计 $2.50。每翻一页是一次单独的调用；失败的调用不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.02 的调用。

### 需要微信搜一搜账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是微信搜一搜上的公开数据，不会用到你自己的微信搜一搜账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### 微信搜一搜不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 微信搜一搜的其他接口

- [微信搜一搜综合搜索](https://okdata.online/zh/apis/wechat/posts/search/)：$0.02/次 · 每页约 20 条帖子
- [微信指数](https://okdata.online/zh/apis/wechat/index/keywords/history/)：$0.15/次 · 每页约 1 条结果
- [微信搜一搜推荐词](https://okdata.online/zh/apis/wechat/keywords/related/)：$0.15/次 · 每页约 9 条结果
- [微信小程序搜索](https://okdata.online/zh/apis/wechat/miniprograms/search/)：$0.15/次 · 每页约 25 条结果
- [微信搜一搜综合搜索（备用版）](https://okdata.online/zh/apis/wechat/backup/posts/search/)：$0.15/次 · 每页约 20 条帖子
