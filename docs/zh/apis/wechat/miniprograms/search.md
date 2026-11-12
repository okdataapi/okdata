# 微信小程序搜索 API

> 按关键词在微信搜一搜里找小程序，取第一页（约 25 个）：名称、简介、图标、原始 ID 和 AppID（部分品牌小程序不显示）、主体和是否认证、平台显示的最近使用人数（取档位下限，如 10万+ 记为 100000）、是否小游戏。

网页版：https://okdata.online/zh/apis/wechat/miniprograms/search/

- **接口**：`GET /v1/wechat/miniprograms/search`
- **ID**：`wechat.miniprograms.search`
- **价格**：$0.15/次 · 每页约 25 条结果
- **返回**：一页约 25 条结果（`data.items`，Miniprogram 对象）
- **状态**：预览
- **适合**：竞品监控、选品定价

## 价格

每次调用 $0.15，返回一页，约 25 条结果。抓 1,000 条结果大约要 40 次调用，合计 $6.00。每翻一页是一次单独的调用；失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `query` | string | 是 |  | 关键词，和在平台搜索框里输入的一样。（例：`外卖`） |
| `view` | string: compact / standard / full | 否 | `standard` | 返回多少字段。full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [Miniprogram](https://okdata.online/zh/docs/objects/miniprogram/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 原始 ID（gh_ 开头）。 |
| `app_id` | string \| null | AppID（wx 开头），用于打开或跳转；未给出时为 null。 |
| `name` | string | 名称。 |
| `description` | string \| null | 简介。 |
| `icon_url` | string \| null | 图标。 |
| `owner_name` | string \| null | 运营主体名称。 |
| `owner_verified` | boolean \| null | 主体是否认证。 |
| `recent_users` | integer \| null | 平台显示的近期使用人数；「1万+」这类是下限；未显示时为 null。 |
| `is_game` | boolean \| null | 是否为小游戏。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/wechat/miniprograms/search" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'query=外卖'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat/miniprograms/search",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"query": "外卖"},
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
const url = new URL('https://api.okdata.online/v1/wechat/miniprograms/search');
url.searchParams.set('query', "外卖");

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
    "capability": "wechat.miniprograms.search",
    "query": "外卖"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「微信小程序搜索」查一下，总结返回的结果。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": null,
        "app_id": null,
        "name": null,
        "description": null,
        "icon_url": null,
        "owner_name": null,
        "owner_verified": null,
        "recent_users": null,
        "is_game": null
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "wechat.miniprograms.search",
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

所有错误同一种结构：code、request_id、message 和 message_zh（每个 code 一句固定的话）、charged、retry、retry_after_seconds、param 和 docs_url，具体问题写在 problems 里。错误不扣费；只有 settlement_unknown 的扣费结果要查询后才知道。完整列表：https://okdata.online/zh/docs/errors/

## 常见问题

### 微信小程序搜索接口多少钱？

每次调用 $0.15，返回一页，约 25 条结果。抓 1,000 条结果大约要 40 次调用，合计 $6.00。每翻一页是一次单独的调用；失败的调用不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.15 的调用。

### 需要微信搜一搜账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是微信搜一搜上的公开数据，不会用到你自己的微信搜一搜账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### 微信搜一搜不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 微信搜一搜的其他接口

- [微信搜一搜综合搜索](https://okdata.online/zh/apis/wechat/posts/search/)：$0.02/次 · 每页约 20 条帖子
- [微信公众号实时查找](https://okdata.online/zh/apis/wechat/accounts/search/)：$0.02/次 · 每页约 8 个账号
- [微信指数](https://okdata.online/zh/apis/wechat/index/keywords/history/)：$0.15/次 · 每页约 1 条结果
- [微信搜一搜推荐词](https://okdata.online/zh/apis/wechat/keywords/related/)：$0.15/次 · 每页约 9 条结果
- [微信搜一搜综合搜索（备用版）](https://okdata.online/zh/apis/wechat/backup/posts/search/)：$0.15/次 · 每页约 20 条帖子
