# Agent2Agent (A2A) v0.3

Discovery is public:

- https://sendlettersonline.co.uk/.well-known/agent-card.json
- https://sendlettersonline.co.uk/.well-known/agent.json

JSON-RPC endpoint: `POST https://sendlettersonline.co.uk/api/a2a`.
Use the same enabled account and Bearer API key as REST.

Read-only balance example:

```sh
curl --fail-with-body --silent --show-error \
  https://sendlettersonline.co.uk/api/a2a \
  -H "Authorization: Bearer ${SLO_API_KEY}" \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","id":"balance-1","method":"message/send","params":{"message":{"kind":"message","role":"user","messageId":"balance-request-1","parts":[{"kind":"data","data":{"skill":"get_balance","input":{}}}]}}}'
```

`message/send` accepts exactly one data part containing:

```json
{
  "kind": "data",
  "data": {
    "skill": "get_balance",
    "input": {}
  }
}
```

The result is an agent Message containing a data part with the skill result.
The [five skills and confirmation contract](agent-tools.md) match MCP.
Text-only messages return help, not a parsed order.

There are no persistent tasks, streaming or push notifications.
`tasks/get` returns `-32001` (task not found).

| JSON-RPC code | Meaning |
| --- | --- |
| -32700 | Malformed JSON |
| -32600 | Invalid request envelope |
| -32601 | Unknown method |
| -32602 | Invalid skill/input or price-confirmation mismatch |
| -32001 | Task not found |
| -32401 | Authentication failure (HTTP 401) |
| -32402 | Insufficient credit (HTTP 402) |
| -32403 | API access disabled during creation (HTTP 403) |
| -32029 | Shared rate limit (HTTP 429) |

Check both HTTP status and the JSON-RPC `error` member. An HTTP response alone
does not establish that a skill succeeded.
