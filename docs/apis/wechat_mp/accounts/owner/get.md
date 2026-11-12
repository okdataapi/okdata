# Official Account owner API

> Who an Official Account is registered to, by its original ID: the company, body or person, its kind, registration number and country, the verification status, kind and date, when the account was registered, and the third-party services it has authorised.

Canonical page: https://okdata.online/apis/wechat_mp/accounts/owner/get/

- **Endpoint**: `GET /v1/wechat_mp/accounts/owner/get`
- **ID**: `wechat_mp.accounts.owner.get`
- **Price**: $0.15 per call
- **Returns**: one AccountOwner object (`data.item`)
- **Status**: preview
- **Good for**: Competitor monitoring

## Price

One call costs $0.15 and returns one account_owner. 1,000 lookups cost $150.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The account's original ID (gh_…); wechat.accounts.search or wechat_mp.accounts.search finds it by name. (e.g. `gh_363b924965e9`) |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [AccountOwner](https://okdata.online/docs/objects/account_owner/).

| Field | Type | Description |
|---|---|---|
| `name` | string \| null | The owner's name: a company's or body's full name, or a person's name. |
| `type` | string \| null | What the owner is. |
| `registration_id` | string \| null | Registration number (unified social credit code, licence or organisation code); null where none is given. |
| `country` | string \| null | Country or region, in the platform's words. |
| `verification` | string \| null | Verification state of the account. |
| `verification_type` | string \| null | Kind of verification, in the platform's words; null when not verified. |
| `verified_at` | string \| null | Date the verification was granted, as 00:00 UTC. |
| `account_id` | string | ID of the account asked about. |
| `account_created_at` | string \| null | Date the account was registered, as 00:00 UTC. |
| `authorized_services` | string[] \| null | Third-party services the account has authorised, in the platform's words. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

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

Or ask an agent that has the MCP server connected:

> Use Official Account owner and sum up what comes back.

## Response example

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

## Errors

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. They are not charged; only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the Official Account owner API cost?

One call costs $0.15 and returns one account_owner. 1,000 lookups cost $150.00. Failed calls are not charged.

### Do I need a WeChat Official Accounts account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from WeChat Official Accounts; nothing is fetched with your own WeChat Official Accounts account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if WeChat Official Accounts does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More WeChat Official Accounts endpoints

- [Official Account search](https://okdata.online/apis/wechat_mp/accounts/search/): $0.058 per account · at most $0.58 per call
- [Official Account article history](https://okdata.online/apis/wechat_mp/accounts/articles/list/): $0.02 per call · about 10 articles per page
- [Official Account article detail](https://okdata.online/apis/wechat_mp/articles/get/): $0.02 per call
- [Official Account profile](https://okdata.online/apis/wechat_mp/accounts/get/): $0.02 per call
- [Official Account article comments](https://okdata.online/apis/wechat_mp/articles/comments/list/): $0.02 per call · about 20 comments per page
- [Official Account article stats](https://okdata.online/apis/wechat_mp/articles/metrics/): $0.02 per call
- [Official Account comment replies](https://okdata.online/apis/wechat_mp/comments/replies/list/): $0.02 per call · about 3 comments per page
