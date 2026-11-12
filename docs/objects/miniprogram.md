# Miniprogram

> A WeChat mini program or mini game.

Canonical page: https://okdata.online/docs/objects/miniprogram/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | Original ID (gh_…). |
| `app_id` | string \| null | AppID (wx…), used to open or link to it; null where none is given. |
| `name` | string | Name. |
| `description` | string \| null | Description. |
| `icon_url` | string \| null | Icon. |
| `owner_name` | string \| null | The company or body that runs it. |
| `owner_verified` | boolean \| null | Whether the owner is verified. |
| `recent_users` | integer \| null | Recent users as the platform shows them; a figure like 1万+ is a lower bound; null where none is shown. |
| `is_game` | boolean \| null | Whether it is a mini game. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Endpoints that return a Miniprogram

- [WeChat mini program search](https://okdata.online/apis/wechat/miniprograms/search/) (`wechat.miniprograms.search`): $0.15 per call · about 25 results per page
