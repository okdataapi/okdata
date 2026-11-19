# Bluesky 账号资料 API

> 按用户名、DID 或主页链接取 Bluesky 账号：昵称、用户名、简介、头像、认证标识、粉丝数、关注数和发帖数。ext 里还有注册时间、背景图、置顶帖，以及建过多少列表、自定义 Feed 和新手包。

网页版：https://okdata.online/zh/apis/bluesky/users/get/

- **接口**：`GET /v1/bluesky/users/get`
- **ID**：`bluesky.users.get`
- **价格**：$0.001/次
- **返回**：一个 Account 对象（`data.item`）
- **状态**：预览
- **适合**：找博主、竞品监控

## 价格

每次调用 $0.001，返回一个结果。查 1,000 次共 $1.00。请求到了数据源的查询，查不到或出错也照常计费；还没请求数据源就被拦下的不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 否 |  | 账号的用户名（handle，如 bsky.app、name.bsky.social，带不带 @ 都行）或 DID（did:plc: 开头）；只写名字会按 name.bsky.social 查。id 和 url 二选一。（例：`bsky.app`） |
| `url` | string | 否 |  | bsky.app 主页链接，会从中读出用户名或 DID。（例：`https://bsky.app/profile/bsky.app`） |
| `view` | string: brief / compact / standard / full | 否 | `standard` | 返回多少字段。brief：只给 ID、标题、正文前 100 字、链接、时间和主要数字，适合先扫一遍列表，再按 ID 取详情；compact 去掉空字段、长正文截到 500 字；full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

id 和 url 给一个就行。 
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
curl -G "https://api.okdata.online/v1/bluesky/users/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=bsky.app'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/bluesky/users/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "bsky.app"},
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
const url = new URL('https://api.okdata.online/v1/bluesky/users/get');
url.searchParams.set('id', "bsky.app");

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
    "capability": "bluesky.users.get",
    "id": "bsky.app"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「Bluesky 账号资料」查这个账号的粉丝数，说说它主要发什么。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "did:plc:trailkitexample2qz7xk4mb",
      "url": "https://bsky.app/profile/trailkit.bsky.social",
      "username": "trailkit.bsky.social",
      "name": "Trail Kit",
      "bio": "Light packs, long walks.",
      "avatar_url": "https://cdn.bsky.app/img/avatar/plain/did:plc:trailkitexample2qz7xk4mb/bafkreiavatar@jpeg",
      "verified": false,
      "followers": 182300,
      "following": 312,
      "posts": 486,
      "likes": null
    }
  },
  "warnings": [],
  "meta": {
    "capability": "bluesky.users.get",
    "billing": {
      "amount": "0.001",
      "currency": "USD",
      "balance_after": "9.999"
    },
    "unavailable": {},
    "cached": false,
    "replayed": false,
    "fetched_at": "2026-11-11T08:00:00Z"
  }
}
```

## 错误

所有错误同一种结构：code、request_id、message 和 message_zh（每个 code 一句固定的话）、charged、retry、retry_after_seconds、param 和 docs_url，具体问题写在 problems 里。请求到了数据源的调用出错（查不到、数据源失败或超时）时，按这个接口的价格计一次费，charged 为 true，并给出 amount；参数错误这类还没请求数据源的错误不扣费。只有 settlement_unknown 的扣费结果要查询后才知道。完整列表：https://okdata.online/zh/docs/errors/

## 常见问题

### Bluesky 账号资料接口多少钱？

每次调用 $0.001，返回一个结果。查 1,000 次共 $1.00。请求到了数据源的查询，查不到或出错也照常计费；还没请求数据源就被拦下的不扣费。

### 可以直接传分享链接吗？

可以。把链接放进 url 参数，okdata 会从中解析出 ID，短链接也行。

### 需要Bluesky账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是Bluesky上的公开数据，不会用到你自己的Bluesky账号。

### 调用失败会扣费吗？

请求到了数据源就会扣一次：返回为空、查不到、数据源出错或超时，都按一次调用计费（按条计价的按 1 条），错误里 charged 为 true，并给出 amount。参数错误、余额不足这类还没请求数据源就被拦下的不扣费。

### Bluesky不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## Bluesky的其他接口

- [Bluesky 找账号](https://okdata.online/zh/apis/bluesky/users/search/)：$0.001/次 · 每页约 25 个账号
- [Bluesky 账号发帖](https://okdata.online/zh/apis/bluesky/users/posts/list/)：$0.001/次 · 每页约 30 条帖子
- [Bluesky 帖子详情](https://okdata.online/zh/apis/bluesky/posts/get/)：$0.001/次
- [Bluesky 帖子回复](https://okdata.online/zh/apis/bluesky/posts/comments/list/)：$0.001/次 · 每页约 200 条评论
