# ChannelsShareLink

> 在微信里打开视频号视频的分享链接。

网页版：https://okdata.online/zh/docs/objects/channels_share_link/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 视频 ID。 |
| `url` | string | 分享链接（weixin.qq.com/sph/…）。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 返回 ChannelsShareLink 的接口

- [视频号作品分享链接](https://okdata.online/zh/apis/wechat_channels/videos/share_link/get/) (`wechat_channels.videos.share_link.get`): $0.02/次
