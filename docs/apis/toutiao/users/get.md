# Toutiao account profile API

> A Toutiao account by user ID or profile link: name, bio, avatar, verification, followers as Toutiao shows them and total likes. ext splits the followers into Toutiao and Xigua Video, and adds the video count and the province the account posts from.

Canonical page: https://okdata.online/apis/toutiao/users/get/

- **Endpoint**: `GET /v1/toutiao/users/get`
- **ID**: `toutiao.users.get`
- **Price**: $0.002 per call
- **Returns**: one Account object (`data.item`)
- **Status**: preview
- **Good for**: Creator discovery, Competitor monitoring

## Price

One call costs $0.002 and returns one account. 1,000 lookups cost $2.00. A lookup that reached the platform is charged even when it is not found or the platform fails; calls stopped before reaching the platform are free.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The user ID: digits, from toutiao.com/c/user/<id>/ or a post's author.id. Give id or url. (e.g. `51050126444`) |
| `url` | string | no |  | The profile link, toutiao.com/c/user/<id>/ or the toutiao.com/c/user/token/… form. A token link is looked up the first time (a little slower); its user ID is remembered after that. (e.g. `https://www.toutiao.com/c/user/token/MS4wLjABAAAA3KU9ifwN12G41E6PJRpZgIfzVrXWQ4WPF66ns54c0uw/`) |
| `view` | string: brief / compact / standard / full | no | `standard` | How much of each object comes back. brief: IDs, title, the first 100 characters of the text, link, time and the main counts, for scanning a list (then get what you need by ID). compact leaves out empty fields and cuts long text at 500 characters. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

Give id or url; one of the two is enough. 
cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [Account](https://okdata.online/docs/objects/account/).

| Field | Type | Description |
|---|---|---|
| `id` | string | Account ID on the platform. |
| `url` | string | Profile link. |
| `username` | string \| null | Handle, where the platform has one. |
| `name` | string | Display name. |
| `bio` | string \| null | Profile bio. |
| `avatar_url` | string \| null | Avatar image URL. |
| `verified` | boolean \| null | Whether the platform shows a verification badge. |
| `followers` | integer \| null | Followers. |
| `following` | integer \| null | Accounts it follows. |
| `posts` | integer \| null | Posts, videos, notes or articles published. |
| `likes` | integer \| null | Total likes received, where the platform shows it. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/toutiao/users/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=51050126444'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/toutiao/users/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "51050126444"},
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
const url = new URL('https://api.okdata.online/v1/toutiao/users/get');
url.searchParams.set('id', "51050126444");

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
    "capability": "toutiao.users.get",
    "id": "51050126444"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Toutiao account profile and tell me the follower count and what the account posts about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "3876512094",
      "url": "https://www.toutiao.com/c/user/3876512094/",
      "username": null,
      "name": "轻装徒步",
      "bio": "轻装，走远路。周更露营和徒步装备。",
      "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
      "verified": true,
      "followers": 182300,
      "following": null,
      "posts": 486,
      "likes": 2310000
    }
  },
  "warnings": [],
  "meta": {
    "capability": "toutiao.users.get",
    "billing": {
      "amount": "0.002",
      "currency": "USD",
      "balance_after": "9.998"
    },
    "unavailable": {},
    "cached": false,
    "replayed": false,
    "fetched_at": "2026-11-11T08:00:00Z"
  }
}
```

## Errors

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. An error from a call that reached the platform (not found, a failure or a timeout on the platform's side) is charged once at this endpoint's price, with charged: true and amount; errors before that, such as bad parameters, are not charged. Only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the Toutiao account profile API cost?

One call costs $0.002 and returns one account. 1,000 lookups cost $2.00. A lookup that reached the platform is charged even when it is not found or the platform fails; calls stopped before reaching the platform are free.

### Can I pass a share link instead of an ID?

Yes. Put the link in url and okdata reads the ID from it. Short share links work too.

### Do I need a Toutiao account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Toutiao; nothing is fetched with your own Toutiao account.

### Am I charged when a call fails?

Yes, once, when the call reached the platform: an empty answer, a not_found, a failure or a timeout on the platform's side costs one call (one item for per-item endpoints), and the error says charged: true with amount. Calls refused before reaching the platform, such as bad parameters or a low balance, cost nothing.

### What if Toutiao does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Toutiao endpoints

- [Toutiao article](https://okdata.online/apis/toutiao/articles/get/): $0.002 per call
- [Toutiao video](https://okdata.online/apis/toutiao/videos/get/): $0.002 per call
- [Toutiao comments](https://okdata.online/apis/toutiao/posts/comments/list/): $0.002 per call · about 20 comments per page
- [Toutiao hot board](https://okdata.online/apis/toutiao/trends/list/): $0.002 per call · about 50 board entries per page
