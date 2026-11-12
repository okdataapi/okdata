# AccountOwner

> Who is behind an account: the registered company, body or person and its verification.

Canonical page: https://okdata.online/docs/objects/account_owner/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

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

## Endpoints that return a AccountOwner

- [Official Account owner](https://okdata.online/apis/wechat_mp/accounts/owner/get/) (`wechat_mp.accounts.owner.get`): $0.15 per call
