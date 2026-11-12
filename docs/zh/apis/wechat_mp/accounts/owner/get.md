# 公众号主体信息 API

> 按原始 ID 取公众号背后的主体：公司、机构或个人的名称、类型、登记证照号码和国家或地区，认证状态、认证类型和日期，公众号注册日期，以及授权过的第三方服务商。

网页版：https://okdata.online/zh/apis/wechat_mp/accounts/owner/get/

- **接口**：`GET /v1/wechat_mp/accounts/owner/get`
- **ID**：`wechat_mp.accounts.owner.get`
- **价格**：$0.15/次
- **返回**：一个 AccountOwner 对象（`data.item`）
- **状态**：预览
- **适合**：竞品监控

## 价格

每次调用 $0.15，返回一个结果。查 1,000 次共 $150.00。失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 是 |  | 公众号原始 ID（gh_ 开头）；只知道名称时用 wechat.accounts.search 或 wechat_mp.accounts.search 找。（例：`gh_363b924965e9`） |
| `view` | string: compact / standard / full | 否 | `standard` | 返回多少字段。full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [AccountOwner](https://okdata.online/zh/docs/objects/account_owner/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `name` | string \| null | 主体名称：公司或机构全称，或个人姓名。 |
| `type` | string \| null | 主体类型。 |
| `registration_id` | string \| null | 注册号（统一社会信用代码、营业执照或组织机构代码）；未给出时为 null。 |
| `country` | string \| null | 国家或地区，平台原文。 |
| `verification` | string \| null | 账号认证状态。 |
| `verification_type` | string \| null | 认证类型，平台原文；未认证时为 null。 |
| `verified_at` | string \| null | 认证日期，写成 UTC 零点。 |
| `account_id` | string | 所查账号的 ID。 |
| `account_created_at` | string \| null | 账号注册日期，写成 UTC 零点。 |
| `authorized_services` | string[] \| null | 账号授权的第三方服务，平台原文。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/wechat_mp/accounts/owner/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=gh_363b924965e9'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat_mp/accounts/owner/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "gh_363b924965e9"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

row = body["data"]["item"]
print(row)
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/wechat_mp/accounts/owner/get');
url.searchParams.set('id', "gh_363b924965e9");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

const row = body.data.item;
console.log(row);
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "wechat_mp.accounts.owner.get",
    "id": "gh_363b924965e9"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「公众号主体信息」查一下，总结返回的结果。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "name": null,
      "type": null,
      "registration_id": null,
      "country": null,
      "verification": null,
      "verification_type": null,
      "verified_at": null,
      "account_id": null,
      "account_created_at": null,
      "authorized_services": null
    }
  },
  "warnings": [],
  "meta": {
    "capability": "wechat_mp.accounts.owner.get",
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

### 公众号主体信息接口多少钱？

每次调用 $0.15，返回一个结果。查 1,000 次共 $150.00。失败的调用不扣费。

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
- [公众号资料](https://okdata.online/zh/apis/wechat_mp/accounts/get/)：$0.02/次
- [公众号文章评论](https://okdata.online/zh/apis/wechat_mp/articles/comments/list/)：$0.02/次 · 每页约 20 条评论
- [公众号文章互动数据](https://okdata.online/zh/apis/wechat_mp/articles/metrics/)：$0.02/次
- [公众号评论回复](https://okdata.online/zh/apis/wechat_mp/comments/replies/list/)：$0.02/次 · 每页约 3 条评论
