# Reddit 视频字幕 API

> Reddit 自己托管的视频帖子的字幕，带时间戳。没有字幕的帖子返回 not_found，和其他查询一样计费。

网页版：https://okdata.online/zh/apis/reddit/posts/transcript/get/

- **接口**：`GET /v1/reddit/posts/transcript/get`
- **ID**：`reddit.posts.transcript.get`
- **价格**：$0.004/次
- **返回**：一个 Transcript 对象（`data.item`）
- **状态**：预览
- **适合**：视频转文字、内容调研

## 价格

每次调用 $0.004，返回一个结果。查 1,000 次共 $4.00。请求到了数据源的查询，查不到或出错也照常计费；还没请求数据源就被拦下的不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 否 |  | 帖子 ID，带不带 t3_ 前缀都行。id 和 url 二选一。（例：`t3_1nnrvkr`） |
| `url` | string | 否 |  | 分享链接或网页地址，会从中解析出 ID。（例：`https://www.reddit.com/r/nasa/comments/1nnrvkr/`） |
| `view` | string: brief / compact / standard / full | 否 | `standard` | 返回多少字段。brief：只给 ID、标题、正文前 100 字、链接、时间和主要数字，适合先扫一遍列表，再按 ID 取详情；compact 去掉空字段、长正文截到 500 字；full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

id 和 url 给一个就行。 
cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [Transcript](https://okdata.online/zh/docs/objects/transcript/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `video_id` | string | 视频 ID。 |
| `lang` | string | 字幕语言。 |
| `segments` | Segment[] | 按时间排列的字幕段。 |
| `text` | string | 全部字幕拼成的纯文本。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/reddit/posts/transcript/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=t3_1nnrvkr'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/reddit/posts/transcript/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "t3_1nnrvkr"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

row = body["data"]["item"]
print(row["text"][:200])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/reddit/posts/transcript/get');
url.searchParams.set('id', "t3_1nnrvkr");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

const row = body.data.item;
console.log(row.text.slice(0, 200));
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "reddit.posts.transcript.get",
    "id": "t3_1nnrvkr"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「Reddit 视频字幕」把视频内容总结成五条要点。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "video_id": "dQw4w9WgXcQ",
      "lang": "en",
      "segments": [
        {
          "start": 0,
          "end": 4.2,
          "text": "Here is what I pack for a two-night trip."
        }
      ],
      "text": "Here is what I pack for a two-night trip."
    }
  },
  "warnings": [],
  "meta": {
    "capability": "reddit.posts.transcript.get",
    "billing": {
      "amount": "0.004",
      "currency": "USD",
      "balance_after": "9.996"
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

### Reddit 视频字幕接口多少钱？

每次调用 $0.004，返回一个结果。查 1,000 次共 $4.00。请求到了数据源的查询，查不到或出错也照常计费；还没请求数据源就被拦下的不扣费。

### 可以直接传分享链接吗？

可以。把链接放进 url 参数，okdata 会从中解析出 ID，短链接也行。

### 需要Reddit账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是Reddit上的公开数据，不会用到你自己的Reddit账号。

### 调用失败会扣费吗？

请求到了数据源就会扣一次：返回为空、查不到、数据源出错或超时，都按一次调用计费（按条计价的按 1 条），错误里 charged 为 true，并给出 amount。参数错误、余额不足这类还没请求数据源就被拦下的不扣费。

### Reddit不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## Reddit的其他接口

- [Reddit 帖子搜索](https://okdata.online/zh/apis/reddit/posts/search/)：$0.004/次 · 每页约 25 条帖子
- [Reddit 帖子详情](https://okdata.online/zh/apis/reddit/posts/get/)：$0.002/次
- [Reddit 帖子评论](https://okdata.online/zh/apis/reddit/posts/comments/list/)：$0.002/次 · 每页约 10 条评论
- [Reddit 热门帖子](https://okdata.online/zh/apis/reddit/popular/posts/list/)：$0.002/次 · 每页约 10 条帖子
- [Reddit 社区帖子](https://okdata.online/zh/apis/reddit/subreddits/posts/list/)：$0.004/次 · 每页约 25 条帖子
- [Reddit 社区资料](https://okdata.online/zh/apis/reddit/subreddits/get/)：$0.002/次
- [Reddit 趋势搜索](https://okdata.online/zh/apis/reddit/trends/list/)：$0.002/次 · 每页约 6 条榜单
- [Reddit 用户资料](https://okdata.online/zh/apis/reddit/users/get/)：$0.002/次
- [Reddit 用户帖子](https://okdata.online/zh/apis/reddit/users/posts/list/)：$0.002/次 · 每页约 25 条帖子
- [Reddit 用户活跃社区](https://okdata.online/zh/apis/reddit/users/subreddits/list/)：$0.002/次 · 每页约 30 个账号
