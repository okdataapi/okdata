# 公众号资料 API

> 按原始 ID 取公众号资料：名称、IP 属地、原创文章数、关联的视频号和是否被封禁。这里微信不给简介、头像和粉丝数。

网页版：https://okdata.online/zh/apis/wechat_mp/accounts/get/

- **接口**：`GET /v1/wechat_mp/accounts/get`
- **ID**：`wechat_mp.accounts.get`
- **价格**：$0.02/次
- **返回**：一个 Account 对象（`data.item`）
- **状态**：预览
- **适合**：竞品监控

## 价格

每次调用 $0.02，返回一个结果。查 1,000 次共 $20.00。失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 是 |  | 公众号原始 ID，大多 gh_ 开头（不是名称）。只知道名称时先用 wechat.accounts.search 搜；文章详情的 author.id 也是它。（例：`gh_363b924965e9`） |
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
curl -G "https://api.okdata.online/v1/wechat_mp/accounts/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=gh_363b924965e9'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat_mp/accounts/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "gh_363b924965e9"},
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
const url = new URL('https://api.okdata.online/v1/wechat_mp/accounts/get');
url.searchParams.set('id', "gh_363b924965e9");

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
    "capability": "wechat_mp.accounts.get",
    "id": "gh_363b924965e9"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「公众号资料」查这个账号的粉丝数，说说它主要发什么。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "MzA5NTI3MjIwMA==",
      "url": "https://mp.weixin.qq.com/mp/profile_ext?__biz=MzA5NTI3MjIwMA==",
      "username": "chuhai_growth",
      "name": "出海增长笔记",
      "bio": "写给出海团队的增长复盘。",
      "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
      "verified": true,
      "followers": null,
      "following": null,
      "posts": 486,
      "likes": null
    }
  },
  "warnings": [],
  "meta": {
    "capability": "wechat_mp.accounts.get",
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

### 公众号资料接口多少钱？

每次调用 $0.02，返回一个结果。查 1,000 次共 $20.00。失败的调用不扣费。

### 需要微信公众号账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是微信公众号上的公开数据，不会用到你自己的微信公众号账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### 微信公众号不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 微信公众号的其他接口

- [公众号搜索](https://okdata.online/zh/apis/wechat_mp/accounts/search/)：$0.058/条 · 每次最多 $0.58
- [公众号历史文章](https://okdata.online/zh/apis/wechat_mp/accounts/articles/list/)：$0.02/次 · 每页约 10 篇文章
- [公众号文章详情](https://okdata.online/zh/apis/wechat_mp/articles/get/)：$0.02/次
- [公众号文章评论](https://okdata.online/zh/apis/wechat_mp/articles/comments/list/)：$0.02/次 · 每页约 20 条评论
- [公众号文章互动数据](https://okdata.online/zh/apis/wechat_mp/articles/metrics/)：$0.02/次
- [公众号评论回复](https://okdata.online/zh/apis/wechat_mp/comments/replies/list/)：$0.02/次 · 每页约 3 条评论
- [公众号主体信息](https://okdata.online/zh/apis/wechat_mp/accounts/owner/get/)：$0.15/次
