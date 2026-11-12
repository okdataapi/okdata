# ChannelsShareLink

> A link that opens a WeChat Channels video in WeChat.

Canonical page: https://okdata.online/docs/objects/channels_share_link/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | The video's ID. |
| `url` | string | The share link (weixin.qq.com/sph/…). |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Endpoints that return a ChannelsShareLink

- [WeChat Channels video share link](https://okdata.online/apis/wechat_channels/videos/share_link/get/) (`wechat_channels.videos.share_link.get`): $0.02 per call
