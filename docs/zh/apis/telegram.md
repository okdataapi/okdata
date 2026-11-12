# Telegram API

> 公开频道和频道消息。

网页版：https://okdata.online/zh/apis/telegram/

3 个接口，每次 $0.002 到 $0.002。地区：海外。不需要Telegram账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [Telegram 频道资料](https://okdata.online/zh/apis/telegram/channels/get/) | `telegram.channels.get` | Account | $0.002/次 |
| [Telegram 频道消息](https://okdata.online/zh/apis/telegram/channels/messages/list/) | `telegram.channels.messages.list` | Post[] | $0.002/次 · 每页约 20 条帖子 |
| [Telegram 单条消息](https://okdata.online/zh/apis/telegram/messages/get/) | `telegram.messages.get` | Post | $0.002/次 |

## 适合做什么

- 竞品监控: `telegram.channels.get`, `telegram.channels.messages.list`
- 找博主: `telegram.channels.get`
- 内容调研: `telegram.channels.messages.list`, `telegram.messages.get`
