# Google 广告透明中心广告主搜索 API

> 按名称在 Google 广告透明中心找广告主：广告主 ID、Google 验证过的名称、注册国家和广告数量估计。验证名称常是公司主体名，不一定是品牌名。

网页版：https://okdata.online/zh/apis/google/advertisers/search/

- **接口**：`GET /v1/google/advertisers/search`
- **ID**：`google.advertisers.search`
- **价格**：$0.004/次 · 每页约 10 个广告主
- **返回**：一页约 10 个广告主（`data.items`，Advertiser 对象）
- **状态**：预览
- **适合**：广告情报

## 价格

每次调用 $0.004，返回一页，约 10 个广告主。抓 1,000 个广告主大约要 100 次调用，合计 $0.40。每翻一页是一次单独的调用；失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `query` | string | 是 |  | 关键词，和在平台搜索框里输入的一样。（例：`Stanley`） |
| `country` | string | 否 |  | 在哪个国家搜（ISO 代码），默认 US。（例：`US`） |
| `cursor` | string | 否 |  | 上一次返回的 page.next_cursor，原样传回。每翻一页都是一次单独的调用。 |
| `view` | string: compact / standard / full | 否 | `standard` | 返回多少字段。full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [Advertiser](https://okdata.online/zh/docs/objects/advertiser/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 广告主在广告库里的 ID。 |
| `url` | string | 广告主在广告库里的页面。 |
| `name` | string | 广告库显示的名称，常是公司主体名。 |
| `region` | string \| null | 注册国家或地区（ISO 代码）。 |
| `ads` | integer \| null | 广告库估计的广告数量。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/google/advertisers/search" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'query=Stanley'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/google/advertisers/search",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"query": "Stanley"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["id"], row["name"], row["ads"])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/google/advertisers/search');
url.searchParams.set('query', "Stanley");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.id, row.name, row.ads);
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "google.advertisers.search",
    "query": "Stanley"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「Google 广告透明中心广告主搜索」找到这个品牌的广告主 ID。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "AR17172796163137470465",
        "url": "https://adstransparency.google.com/advertiser/AR17172796163137470465",
        "name": "PACIFIC MARKET INTERNATIONAL, LLC",
        "region": "US",
        "ads": 2000
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "google.advertisers.search",
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

所有错误同一种结构：code、request_id、message 和 message_zh（每个 code 一句固定的话）、charged、retry、retry_after_seconds、param 和 docs_url，具体问题写在 problems 里。错误不扣费；只有 settlement_unknown 的扣费结果要查询后才知道。完整列表：https://okdata.online/zh/docs/errors/

## 常见问题

### Google 广告透明中心广告主搜索接口多少钱？

每次调用 $0.004，返回一页，约 10 个广告主。抓 1,000 个广告主大约要 100 次调用，合计 $0.40。每翻一页是一次单独的调用；失败的调用不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.004 的调用。

### 需要Google 广告透明中心账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是Google 广告透明中心上的公开数据，不会用到你自己的Google 广告透明中心账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### Google 广告透明中心不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## Google 广告透明中心的其他接口

- [Google 广告主的广告](https://okdata.online/zh/apis/google/advertisers/ads/list/)：$0.004/次 · 每页约 40 条广告
