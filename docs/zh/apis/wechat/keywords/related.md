# 微信搜一搜推荐词 API

> 微信搜一搜在搜索框下给一个关键词的联想推荐词，按它列出的顺序，一次约 9 个（不含关键词本身）。只有词和名次，没有指数。

网页版：https://okdata.online/zh/apis/wechat/keywords/related/

- **接口**：`GET /v1/wechat/keywords/related`
- **ID**：`wechat.keywords.related`
- **价格**：$0.15/次 · 每页约 9 条结果
- **返回**：一页约 9 条结果（`data.items`，KeywordRelated 对象）
- **状态**：预览
- **适合**：热点研究、内容调研

## 价格

每次调用 $0.15，返回一页，约 9 条结果。抓 1,000 条结果大约要 112 次调用，合计 $16.80。每翻一页是一次单独的调用。请求到了平台的调用，返回为空、查不到或出错也照常计费；还没请求到平台就被拦下的不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `keyword` | string | 是 |  | 一个关键词。（例：`咖啡`） |
| `view` | string: brief / compact / standard / full | 否 | `standard` | 返回多少字段。brief：只给 ID、标题、正文前 100 字、链接、时间和主要数字，适合先扫一遍列表，再按 ID 取详情；compact 去掉空字段、长正文截到 500 字；full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [KeywordRelated](https://okdata.online/zh/docs/objects/keyword_related/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `keyword` | string | 关联词。 |
| `related_to` | string | 所查的关键词。 |
| `relation` | string \| null | 关联方式：一起被搜（query）、在内容里一起出现（posts）、之前搜（prior）、之后搜（after），或输入时的联想词（suggestion）。 |
| `rank` | integer \| null | 在同一关联方式下的排名，从 1 开始。 |
| `relevance` | number \| null | 相关程度，0 到 1。 |
| `search_index` | integer \| null | 它的搜索指数（平台的度量，不是次数）；平台未给出时为 null。 |
| `composite_index` | integer \| null | 它的综合指数（平台对关注度的度量，不是次数）。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/wechat/keywords/related" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'keyword=咖啡'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat/keywords/related",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"keyword": "咖啡"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row)
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/wechat/keywords/related');
url.searchParams.set('keyword', "咖啡");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row);
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "wechat.keywords.related",
    "keyword": "咖啡"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「微信搜一搜推荐词」查一下，总结返回的结果。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "keyword": null,
        "related_to": null,
        "relation": null,
        "rank": null,
        "relevance": null,
        "search_index": null,
        "composite_index": null
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "wechat.keywords.related",
    "billing": {
      "amount": "0.15",
      "currency": "USD",
      "balance_after": "9.85"
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

### 微信搜一搜推荐词接口多少钱？

每次调用 $0.15，返回一页，约 9 条结果。抓 1,000 条结果大约要 112 次调用，合计 $16.80。每翻一页是一次单独的调用。请求到了平台的调用，返回为空、查不到或出错也照常计费；还没请求到平台就被拦下的不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.15 的调用。

### 需要微信搜一搜账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是微信搜一搜上的公开数据，不会用到你自己的微信搜一搜账号。

### 调用失败会扣费吗？

请求到了平台就会扣一次：返回为空、查不到、平台出错或超时，都按一次调用计费（按条计价的按 1 条），错误里 charged 为 true，并给出 amount。参数错误、余额不足这类还没请求到平台就被拦下的不扣费。

### 微信搜一搜不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 微信搜一搜的其他接口

- [微信搜一搜综合搜索](https://okdata.online/zh/apis/wechat/posts/search/)：$0.02/次 · 每页约 20 条帖子
- [微信公众号实时查找](https://okdata.online/zh/apis/wechat/accounts/search/)：$0.02/次 · 每页约 8 个账号
- [微信指数](https://okdata.online/zh/apis/wechat/index/keywords/history/)：$0.15/次 · 每页约 1 条结果
- [微信小程序搜索](https://okdata.online/zh/apis/wechat/miniprograms/search/)：$0.15/次 · 每页约 25 条结果
- [微信搜一搜综合搜索（备用版）](https://okdata.online/zh/apis/wechat/backup/posts/search/)：$0.15/次 · 每页约 20 条帖子
