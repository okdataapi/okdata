# 小红书蒲公英达人详情 API

> 达人在蒲公英上的资料：粉丝数、获赞与收藏、阅读和互动中位数、内容和特色标签，以及图文和视频笔记的报价（元）和是否开放接单。

网页版：https://okdata.online/zh/apis/xiaohongshu/pgy/creators/get/

- **接口**：`GET /v1/xiaohongshu/pgy/creators/get`
- **ID**：`xiaohongshu.pgy.creators.get`
- **价格**：$0.04/次
- **返回**：一个 Creator 对象（`data.item`）
- **状态**：预览
- **适合**：找博主

## 价格

每次调用 $0.04，返回一个结果。查 1,000 次共 $40.00。失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 是 |  | 蒲公英达人 ID（24 位十六进制，与小红书用户 ID 相同），来自蒲公英达人搜索。（例：`5dfa1ee20000000001001cb3`） |
| `view` | string: compact / standard / full | 否 | `standard` | 返回多少字段。full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [Creator](https://okdata.online/zh/docs/objects/creator/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 达人广场里的达人 ID，其他达人广场接口用它。 |
| `url` | string | 达人在达人广场的主页。 |
| `account_id` | string \| null | 达人在平台上的账号 ID（达人广场给出时）：抖音是 douyin.users.get 用的 sec_uid（MS4w 开头），小红书是用户 ID。 |
| `username` | string \| null | 平台上的用户名或号（有的话）。 |
| `name` | string | 昵称。 |
| `avatar_url` | string \| null | 头像图片地址。 |
| `location` | string \| null | 达人所在地。 |
| `gender` | string \| null | 达人广场标注的性别。 |
| `followers` | integer \| null | 粉丝数。 |
| `categories` | string[] \| null | 达人广场的内容类目，平台原文。 |
| `engagement_rate` | number \| null | 近期作品的互动率，0 到 1（0.038 即 3.8%）。 |
| `median_views` | integer \| null | 近期日常作品的播放或阅读中位数。 |
| `median_engagements` | integer \| null | 近期日常作品的互动中位数（赞、评、藏、转）。 |
| `rates` | Rate[] \| null | 公开的合作报价；达人广场不展示时为 null。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/xiaohongshu/pgy/creators/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=5dfa1ee20000000001001cb3'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/xiaohongshu/pgy/creators/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "5dfa1ee20000000001001cb3"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

row = body["data"]["item"]
print(row["name"], row["followers"], row["engagement_rate"])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/xiaohongshu/pgy/creators/get');
url.searchParams.set('id', "5dfa1ee20000000001001cb3");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

const row = body.data.item;
console.log(row.name, row.followers, row.engagement_rate);
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "xiaohongshu.pgy.creators.get",
    "id": "5dfa1ee20000000001001cb3"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「小红书蒲公英达人详情」挑出十个互动好、报价划算的达人，附报价。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "5dfa1ee20000000001001cb3",
      "url": "https://pgy.xiaohongshu.com/solar/pre-trade/blogger-detail/5dfa1ee20000000001001cb3",
      "account_id": "5dfa1ee20000000001001cb3",
      "username": "shaka521",
      "name": "山野轻装",
      "avatar_url": "https://cdn.example.com/avatar/creator.jpg",
      "location": "江苏 苏州",
      "gender": "male",
      "followers": 176970,
      "categories": [
        "出行旅游",
        "旅行"
      ],
      "engagement_rate": null,
      "median_views": 198469,
      "median_engagements": 15935,
      "rates": [
        {
          "type": "image_note",
          "name": "图文笔记",
          "price": 16000,
          "currency": "CNY",
          "available": true,
          "settlement": null
        }
      ]
    }
  },
  "warnings": [],
  "meta": {
    "capability": "xiaohongshu.pgy.creators.get",
    "billing": {
      "amount": "0.04",
      "currency": "USD",
      "balance_after": "9.96"
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

### 小红书蒲公英达人详情接口多少钱？

每次调用 $0.04，返回一个结果。查 1,000 次共 $40.00。失败的调用不扣费。

### 需要小红书账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是小红书上的公开数据，不会用到你自己的小红书账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### 小红书不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 小红书的其他接口

- [小红书笔记搜索](https://okdata.online/zh/apis/xiaohongshu/notes/search/)：$0.02/次 · 每页约 20 篇笔记
- [小红书笔记详情](https://okdata.online/zh/apis/xiaohongshu/notes/get/)：$0.02/次
- [小红书笔记评论](https://okdata.online/zh/apis/xiaohongshu/notes/comments/list/)：$0.02/次 · 每页约 10 条评论
- [小红书博主信息](https://okdata.online/zh/apis/xiaohongshu/users/get/)：$0.02/次
- [小红书博主笔记列表](https://okdata.online/zh/apis/xiaohongshu/users/notes/list/)：$0.02/次 · 每页约 20 篇笔记
- [小红书热点话题](https://okdata.online/zh/apis/xiaohongshu/trends/list/)：$0.02/次 · 每页约 20 条榜单
- [小红书蒲公英达人搜索](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/search/)：$0.04/次 · 每页约 20 位达人
- [小红书商城商品搜索](https://okdata.online/zh/apis/xiaohongshu/shop/products/search/)：$0.02/次 · 每页约 20 个商品
- [小红书商城商品评价](https://okdata.online/zh/apis/xiaohongshu/shop/products/reviews/list/)：$0.02/次 · 每页约 12 条评价
- [小红书图片搜索](https://okdata.online/zh/apis/xiaohongshu/images/search/)：$0.02/次 · 每页约 20 条帖子
- [小红书评论回复](https://okdata.online/zh/apis/xiaohongshu/comments/replies/list/)：$0.02/次 · 每页约 5 条评论
- [小红书话题笔记](https://okdata.online/zh/apis/xiaohongshu/topics/notes/list/)：$0.02/次 · 每页约 10 篇笔记
- [小红书话题详情](https://okdata.online/zh/apis/xiaohongshu/topics/get/)：$0.02/次
- [小红书账号搜索](https://okdata.online/zh/apis/xiaohongshu/users/search/)：$0.02/次 · 每页约 20 个账号
- [小红书商城商品详情](https://okdata.online/zh/apis/xiaohongshu/shop/products/get/)：$0.02/次
- [小红书搜索联想词](https://okdata.online/zh/apis/xiaohongshu/keywords/related/)：$0.02/次 · 每页约 10 条结果
- [小红书视频笔记详情（视频地址）](https://okdata.online/zh/apis/xiaohongshu/videos/get/)：$0.02/次
- [小红书蒲公英关键词搜索指数](https://okdata.online/zh/apis/xiaohongshu/pgy/keywords/history/)：$0.04/次
- [小红书蒲公英关联词](https://okdata.online/zh/apis/xiaohongshu/pgy/keywords/related/)：$0.04/次 · 每页约 98 条结果
- [小红书蒲公英达人粉丝画像](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/audience/get/)：$0.04/次
- [小红书蒲公英达人数据表现](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/metrics/)：$0.04/次
- [小红书蒲公英达人笔记](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/notes/list/)：$0.04/次 · 每页约 8 篇笔记
- [小红书蒲公英达人粉丝趋势](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/followers/history/)：$0.04/次
- [小红书蒲公英相似达人](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/related/)：$0.04/次 · 每页约 4 位达人
- [小红书蒲公英内容广场热门笔记](https://okdata.online/zh/apis/xiaohongshu/pgy/notes/trending/)：$0.04/次 · 每页约 34 篇笔记
- [小红书蒲公英达人合作成本概览](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/costs/metrics/)：$0.04/次
- [小红书蒲公英达人粉丝概览](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/followers/metrics/)：$0.04/次
- [小红书蒲公英达人核心数据趋势](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/costs/history/)：$0.04/次
- [小红书蒲公英笔记数据](https://okdata.online/zh/apis/xiaohongshu/pgy/notes/get/)：$0.04/次
