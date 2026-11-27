# Bluesky 帖子回复 API

> 帖子下的直接回复，按 Bluesky 的排序一次全部返回（最多约 200 条，没有下一页）：内容、回复者、点赞、回复数和时间。回复本身也是帖子：把它的 id 传进来，就能拿到它下面的回复。

网页版：https://okdata.online/zh/apis/bluesky/posts/comments/list/

- **接口**：`GET /v1/bluesky/posts/comments/list`
- **ID**：`bluesky.posts.comments.list`
- **价格**：$0.001/次 · 每页约 200 条评论
- **返回**：一页约 200 条评论（`data.items`，Comment 对象）
- **状态**：预览
- **适合**：口碑分析

## 价格

每次调用 $0.001，返回一页，约 200 条评论。抓 1,000 条评论大约要 5 次调用，合计 $0.005。每翻一页是一次单独的调用。请求到了平台的调用，返回为空、查不到或出错也照常计费；还没请求到平台就被拦下的不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 否 |  | 帖子的 at:// URI，也就是我们返回的 Bluesky 帖子里的 id（at://<DID>/app.bsky.feed.post/<key>）。id 和 url 二选一。（例：`at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3n22yg6lg2k2f`） |
| `url` | string | 否 |  | bsky.app 帖子链接（/profile/<用户名>/post/<key>）。（例：`https://bsky.app/profile/bsky.app/post/3n22yg6lg2k2f`） |
| `view` | string: brief / compact / standard / full | 否 | `standard` | 返回多少字段。brief：只给 ID、标题、正文前 100 字、链接、时间和主要数字，适合先扫一遍列表，再按 ID 取详情；compact 去掉空字段、长正文截到 500 字；full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

id 和 url 给一个就行。 
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
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/bluesky/posts/comments/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3n22yg6lg2k2f'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/bluesky/posts/comments/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3n22yg6lg2k2f"},
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
const url = new URL('https://api.okdata.online/v1/bluesky/posts/comments/list');
url.searchParams.set('id', "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3n22yg6lg2k2f");

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
    "capability": "bluesky.posts.comments.list",
    "id": "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3n22yg6lg2k2f"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「Bluesky 帖子回复」读前两页评论，总结大家夸什么、吐槽什么。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "at://did:plc:hikerexample5mq3zt7kw2rdx/app.bsky.feed.post/3m2abcf4lmn2p",
        "post_id": "at://did:plc:trailkitexample2qz7xk4mb/app.bsky.feed.post/3m2abcd7xyz2k",
        "parent_id": null,
        "text": "Which tent is that? Looks tiny packed.",
        "published_at": "2026-11-02T11:04:00Z",
        "author": {
          "id": "did:plc:trailkitexample2qz7xk4mb",
          "username": "trailkit.bsky.social",
          "name": "Trail Kit",
          "avatar_url": "https://cdn.bsky.app/img/avatar/plain/did:plc:trailkitexample2qz7xk4mb/bafkreiavatar@jpeg",
          "followers": null,
          "verified": false
        },
        "likes": 214,
        "replies": 9,
        "ip_location": null
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "bluesky.posts.comments.list",
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

所有错误同一种结构：code、request_id、message 和 message_zh（每个 code 一句固定的话）、charged、retry、retry_after_seconds、param 和 docs_url，具体问题写在 problems 里。请求到了平台的调用出错（查不到、平台失败或超时）时，按这个接口的价格计一次费，charged 为 true，并给出 amount；参数错误这类还没请求到平台的错误不扣费。只有 settlement_unknown 的扣费结果要查询后才知道。完整列表：https://okdata.online/zh/docs/errors/

## 常见问题

### Bluesky 帖子回复接口多少钱？

每次调用 $0.001，返回一页，约 200 条评论。抓 1,000 条评论大约要 5 次调用，合计 $0.005。每翻一页是一次单独的调用。请求到了平台的调用，返回为空、查不到或出错也照常计费；还没请求到平台就被拦下的不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.001 的调用。

### 需要Bluesky账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是Bluesky上的公开数据，不会用到你自己的Bluesky账号。

### 调用失败会扣费吗？

请求到了平台就会扣一次：返回为空、查不到、平台出错或超时，都按一次调用计费（按条计价的按 1 条），错误里 charged 为 true，并给出 amount。参数错误、余额不足这类还没请求到平台就被拦下的不扣费。

### Bluesky不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## Bluesky的其他接口

- [Bluesky 账号资料](https://okdata.online/zh/apis/bluesky/users/get/)：$0.001/次
- [Bluesky 找账号](https://okdata.online/zh/apis/bluesky/users/search/)：$0.001/次 · 每页约 25 个账号
- [Bluesky 账号发帖](https://okdata.online/zh/apis/bluesky/users/posts/list/)：$0.001/次 · 每页约 30 条帖子
- [Bluesky 帖子详情](https://okdata.online/zh/apis/bluesky/posts/get/)：$0.001/次
