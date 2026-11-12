# 微博账号信息 API

> 账号的粉丝数、微博数、认证和简介。

网页版：https://okdata.online/zh/apis/weibo/users/get/

- **接口**：`GET /v1/weibo/users/get`
- **ID**：`weibo.users.get`
- **价格**：$0.002/次
- **返回**：一个 Account 对象（`data.item`）
- **状态**：预览
- **适合**：竞品监控、找博主

## 价格

每次调用 $0.002，返回一个结果。查 1,000 次共 $2.00。失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 是 |  | 账号 ID（平台自己的 sec_uid 或 user id）。（例：`1234567890`） |
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
curl -G "https://api.okdata.online/v1/weibo/users/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=1234567890'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/weibo/users/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "1234567890"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

row = body["data"]["item"]
print(row["name"], row["followers"])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/weibo/users/get');
url.searchParams.set('id', "1234567890");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

const row = body.data.item;
console.log(row.name, row.followers);
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "weibo.users.get",
    "id": "1234567890"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「微博账号信息」查这个账号的粉丝数，说说它主要发什么。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "1234567890",
      "url": "https://weibo.com/u/1234567890",
      "username": null,
      "name": "轻装户外官方",
      "bio": "户外装备品牌官方微博",
      "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
      "verified": true,
      "followers": 182300,
      "following": 312,
      "posts": 486,
      "likes": 2310000
    }
  },
  "warnings": [],
  "meta": {
    "capability": "weibo.users.get",
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

### 微博账号信息接口多少钱？

每次调用 $0.002，返回一个结果。查 1,000 次共 $2.00。失败的调用不扣费。

### 需要微博账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是微博上的公开数据，不会用到你自己的微博账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### 微博不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 微博的其他接口

- [微博搜索](https://okdata.online/zh/apis/weibo/posts/search/)：$0.002/次 · 每页约 10 条帖子
- [微博热搜](https://okdata.online/zh/apis/weibo/trends/list/)：$0.002/次 · 每页约 50 条榜单
- [微博详情](https://okdata.online/zh/apis/weibo/posts/get/)：$0.002/次
- [微博评论](https://okdata.online/zh/apis/weibo/posts/comments/list/)：$0.002/次 · 每页约 20 条评论
- [微博评论回复](https://okdata.online/zh/apis/weibo/comments/replies/list/)：$0.002/次 · 每页约 20 条评论
- [微博点赞用户](https://okdata.online/zh/apis/weibo/posts/likers/list/)：$0.002/次 · 每页约 50 个账号
- [微博用户微博](https://okdata.online/zh/apis/weibo/users/posts/list/)：$0.002/次 · 每页约 20 条帖子
- [微博用户粉丝列表](https://okdata.online/zh/apis/weibo/users/followers/list/)：$0.002/次 · 每页约 20 个账号
- [微博用户搜索](https://okdata.online/zh/apis/weibo/users/search/)：$0.002/次 · 每页约 20 个账号
- [微博热搜榜（备用版）](https://okdata.online/zh/apis/weibo/backup/trends/list/)：$0.0025/次 · 每页约 50 条榜单
