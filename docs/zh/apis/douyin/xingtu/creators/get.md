# 抖音星图达人资料 API

> 按星图达人 ID 取这位抖音达人在星图上的资料：昵称、头像、所在地、性别、粉丝数和内容类目。取一个时带抖音账号 ID（sec_uid）、抖音号、签约机构和内容标签；一次取多个（最多 50 个）时改为带植入和定制视频报价、预期 CPM（元）和预估播放量。

网页版：https://okdata.online/zh/apis/douyin/xingtu/creators/get/

- **接口**：`GET /v1/douyin/xingtu/creators/get`
- **ID**：`douyin.xingtu.creators.get`
- **价格**：$0.004/次
- **返回**：一个 Creator 对象（`data.item`）
- **状态**：预览
- **适合**：找博主

## 价格

每次调用 $0.004，返回一个结果。查 1,000 次共 $4.00。失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 否 |  | 星图达人 ID（一串数字），来自星图达人搜索；不是抖音账号 ID。id 和 ids 二选一。（例：`6763236383382306828`） |
| `ids` | string[] | 否 |  | 最多 50 个星图达人 ID。id 和 ids 二选一。（例：`6763236383382306828,6816144920949030920`） |
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
curl -G "https://api.okdata.online/v1/douyin/xingtu/creators/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=6763236383382306828'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/douyin/xingtu/creators/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "6763236383382306828"},
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
const url = new URL('https://api.okdata.online/v1/douyin/xingtu/creators/get');
url.searchParams.set('id', "6763236383382306828");

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
    "capability": "douyin.xingtu.creators.get",
    "id": "6763236383382306828"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「抖音星图达人资料」挑出十个互动好、报价划算的达人，附报价。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "7283826197740388415",
      "url": "https://www.xingtu.cn/ad/creator/author-homepage/douyin-video/7283826197740388415",
      "account_id": "MS4wLjABAAAADCLMXvMISjsdNz2uITW-Jhir0LZCy31nBIgahVn-yIc",
      "username": "shaka521",
      "name": "二许趣野营",
      "avatar_url": "https://cdn.example.com/avatar/creator.jpg",
      "location": "天津",
      "gender": "male",
      "followers": 103008,
      "categories": [
        "户外运动",
        "户外露营"
      ],
      "engagement_rate": 0.0384,
      "median_views": 15231,
      "median_engagements": 1601,
      "rates": [
        {
          "type": "integrated_video",
          "name": "植入视频",
          "price": 6800,
          "currency": "CNY",
          "available": true,
          "settlement": "固定价格"
        }
      ]
    }
  },
  "warnings": [],
  "meta": {
    "capability": "douyin.xingtu.creators.get",
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

### 抖音星图达人资料接口多少钱？

每次调用 $0.004，返回一个结果。查 1,000 次共 $4.00。失败的调用不扣费。

### 需要抖音账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是抖音上的公开数据，不会用到你自己的抖音账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### 抖音不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 抖音的其他接口

- [抖音视频搜索](https://okdata.online/zh/apis/douyin/videos/search/)：$0.02/次 · 每页约 20 条视频
- [抖音视频详情](https://okdata.online/zh/apis/douyin/videos/get/)：$0.002/次
- [抖音视频评论](https://okdata.online/zh/apis/douyin/videos/comments/list/)：$0.002/次 · 每页约 20 条评论
- [抖音账号信息](https://okdata.online/zh/apis/douyin/users/get/)：$0.002/次
- [抖音账号作品列表](https://okdata.online/zh/apis/douyin/users/videos/list/)：$0.002/次 · 每页约 20 条视频
- [抖音热搜榜](https://okdata.online/zh/apis/douyin/trends/list/)：$0.002/次 · 每页约 50 条榜单
- [抖音星图达人搜索](https://okdata.online/zh/apis/douyin/xingtu/creators/search/)：$0.004/次 · 每页约 20 位达人
- [抖音星图达人报价](https://okdata.online/zh/apis/douyin/xingtu/creators/rates/get/)：$0.04/次
- [抖音评论回复](https://okdata.online/zh/apis/douyin/comments/replies/list/)：$0.002/次 · 每页约 20 条评论
- [抖音话题视频](https://okdata.online/zh/apis/douyin/hashtags/videos/list/)：$0.002/次 · 每页约 10 条视频
- [抖音账号搜索](https://okdata.online/zh/apis/douyin/users/search/)：$0.002/次 · 每页约 30 个账号
- [抖音视频播放量](https://okdata.online/zh/apis/douyin/videos/metrics/)：$0.002/次
- [抖音相关视频](https://okdata.online/zh/apis/douyin/videos/related/)：$0.002/次 · 每页约 10 条视频
- [抖音视频榜](https://okdata.online/zh/apis/douyin/videos/trending/)：$0.002/次 · 每页约 9 条视频
- [抖音搜索框联想词](https://okdata.online/zh/apis/douyin/keywords/related/)：$0.02/次 · 每页约 10 条结果
- [抖音巨量算数品牌指数趋势](https://okdata.online/zh/apis/douyin/index/brands/history/)：$0.002/次
- [抖音巨量算数品牌指数对比](https://okdata.online/zh/apis/douyin/index/brands/metrics/)：$0.002/次
- [抖音巨量算数达人热门视频](https://okdata.online/zh/apis/douyin/index/creators/videos/list/)：$0.002/次 · 每页约 20 条视频
- [抖音巨量算数达人粉丝画像](https://okdata.online/zh/apis/douyin/index/creators/audience/get/)：$0.002/次
- [抖音巨量算数达人核心指标](https://okdata.online/zh/apis/douyin/index/creators/metrics/)：$0.002/次
- [抖音巨量算数关键词人群画像](https://okdata.online/zh/apis/douyin/index/keywords/audience/get/)：$0.002/次
- [抖音巨量算数关键词热度趋势](https://okdata.online/zh/apis/douyin/index/keywords/history/)：$0.006/次 · 每页约 1 条结果
- [抖音巨量算数关联词](https://okdata.online/zh/apis/douyin/index/keywords/related/)：$0.002/次 · 每页约 170 条结果
- [抖音巨量算数实时热点](https://okdata.online/zh/apis/douyin/index/trends/list/)：$0.002/次 · 每页约 30 条榜单
- [抖音巨量算数关键词热门视频](https://okdata.online/zh/apis/douyin/index/videos/search/)：$0.002/次 · 每页约 20 条视频
- [抖音达人互动与粉丝趋势](https://okdata.online/zh/apis/douyin/users/history/)：$0.002/次
- [抖音星图达人粉丝画像](https://okdata.online/zh/apis/douyin/xingtu/creators/audience/get/)：$0.004/次
- [抖音星图达人传播数据](https://okdata.online/zh/apis/douyin/xingtu/creators/metrics/)：$0.004/次
- [抖音星图达人作品表现](https://okdata.online/zh/apis/douyin/xingtu/creators/videos/list/)：$0.004/次 · 每页约 20 条视频
- [抖音星图达人内容热词](https://okdata.online/zh/apis/douyin/xingtu/creators/keywords/get/)：$0.002/次
- [抖音星图达人星图指数](https://okdata.online/zh/apis/douyin/xingtu/creators/scores/get/)：$0.008/次
- [抖音星图达人内容分布](https://okdata.online/zh/apis/douyin/xingtu/creators/content_mix/get/)：$0.004/次
- [抖音星图达人转化能力](https://okdata.online/zh/apis/douyin/xingtu/creators/conversion/get/)：$0.004/次
- [抖音星图营销活动日历](https://okdata.online/zh/apis/douyin/xingtu/campaigns/list/)：$0.004/次 · 每页约 40 条结果
- [抖音星图视频数据报告](https://okdata.online/zh/apis/douyin/xingtu/videos/get/)：$0.004/次
- [抖音用户视频（备用版）](https://okdata.online/zh/apis/douyin/backup/users/videos/list/)：$0.0025/次 · 每页约 20 条视频
- [抖音视频搜索（备用版）](https://okdata.online/zh/apis/douyin/backup/videos/search/)：$0.03/次 · 每页约 8 条视频
