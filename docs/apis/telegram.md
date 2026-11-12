# Telegram API

> Public channels and their messages.

Canonical page: https://okdata.online/apis/telegram/

3 endpoints, $0.002 to $0.002 per call. Region: Global. No Telegram login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Telegram channel profile](https://okdata.online/apis/telegram/channels/get/) | `telegram.channels.get` | Account | $0.002 per call |
| [Telegram channel messages](https://okdata.online/apis/telegram/channels/messages/list/) | `telegram.channels.messages.list` | Post[] | $0.002 per call · about 20 posts per page |
| [Telegram message detail](https://okdata.online/apis/telegram/messages/get/) | `telegram.messages.get` | Post | $0.002 per call |

## Good for

- Competitor monitoring: `telegram.channels.get`, `telegram.channels.messages.list`
- Creator discovery: `telegram.channels.get`
- Content research: `telegram.channels.messages.list`, `telegram.messages.get`
