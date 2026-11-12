# 视频号作品分享链接 API

> 按作品 ID 生成一条能在微信里打开的分享链接（weixin.qq.com/sph/ 开头）。每次生成的链接都不同，旧链接仍然有效；链接无法用 ID 自己拼出来。

网页版：https://okdata.online/zh/apis/wechat_channels/videos/share_link/get/

- **接口**：`GET /v1/wechat_channels/videos/share_link/get`
- **ID**：`wechat_channels.videos.share_link.get`
- **价格**：$0.02/次
- **返回**：一个 ChannelsShareLink 对象（`data.item`）
- **状态**：预览
- **适合**：内容调研

## 价格

每次调用 $0.02，返回一个结果。查 1,000 次共 $20.00。失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 是 |  | 作品 ID（数字）：作品列表或详情里的 id。搜索结果里 export/ 开头的加密 ID 要先传给 wechat_channels.videos.get 换成它。（例：`15051893554318805499`） |
| `view` | string: compact / standard / full | 否 | `standard` | 返回多少字段。full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [ChannelsShareLink](https://okdata.online/zh/docs/objects/channels_share_link/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 视频 ID。 |
| `url` | string | 分享链接（weixin.qq.com/sph/…）。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/wechat_channels/videos/share_link/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=15051893554318805499'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat_channels/videos/share_link/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "15051893554318805499"},
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
const url = new URL('https://api.okdata.online/v1/wechat_channels/videos/share_link/get');
url.searchParams.set('id', "15051893554318805499");

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
    "capability": "wechat_channels.videos.share_link.get",
    "id": "15051893554318805499"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「视频号作品分享链接」查一下，总结返回的结果。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": null,
      "url": null
    }
  },
  "warnings": [],
  "meta": {
    "capability": "wechat_channels.videos.share_link.get",
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

### 视频号作品分享链接接口多少钱？

每次调用 $0.02，返回一个结果。查 1,000 次共 $20.00。失败的调用不扣费。

### 需要微信视频号账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是微信视频号上的公开数据，不会用到你自己的微信视频号账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### 微信视频号不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 微信视频号的其他接口

- [视频号视频搜索](https://okdata.online/zh/apis/wechat_channels/videos/search/)：$0.02/次 · 每页约 10 条视频
- [视频号账号搜索](https://okdata.online/zh/apis/wechat_channels/users/search/)：$0.02/次 · 每页约 1 个账号
- [视频号账号信息](https://okdata.online/zh/apis/wechat_channels/users/get/)：$0.02/次
- [视频号账号作品](https://okdata.online/zh/apis/wechat_channels/users/videos/list/)：$0.02/次 · 每页约 15 条视频
- [视频号作品详情](https://okdata.online/zh/apis/wechat_channels/videos/get/)：$0.02/次
- [视频号作品评论](https://okdata.online/zh/apis/wechat_channels/videos/comments/list/)：$0.015/次 · 每页约 25 条评论
- [视频号评论回复](https://okdata.online/zh/apis/wechat_channels/comments/replies/list/)：$0.015/次 · 每页约 20 条评论
- [视频号直播回放](https://okdata.online/zh/apis/wechat_channels/users/live_replays/list/)：$0.02/次 · 每页约 48 条帖子
- [视频号账号合集](https://okdata.online/zh/apis/wechat_channels/users/collections/list/)：$0.02/次 · 每页约 7 条结果
- [视频号合集视频](https://okdata.online/zh/apis/wechat_channels/collections/videos/list/)：$0.02/次 · 每页约 20 条视频
- [视频号作品互动数据](https://okdata.online/zh/apis/wechat_channels/videos/metrics/)：$0.015/次
- [视频号账号信息（备用版）](https://okdata.online/zh/apis/wechat_channels/backup/users/get/)：$0.03/次
- [视频号账号作品（备用版）](https://okdata.online/zh/apis/wechat_channels/backup/users/videos/list/)：$0.06/次 · 每页约 15 条视频
- [视频号视频搜索（备用版）](https://okdata.online/zh/apis/wechat_channels/backup/videos/search/)：$0.15/次 · 每页约 10 条视频
