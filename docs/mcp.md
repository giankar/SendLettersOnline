# MCP connection guide

Remote Streamable HTTP endpoint:

```text
https://sendlettersonline.co.uk/api/mcp
```

## Claude and other OAuth-capable clients

Where your client supports custom remote MCP connectors with OAuth, add the
endpoint above and complete sign-in and consent. Connector availability
depends on the client, its version and account plan.

API access must be enabled for the signed-in account. Funding the wallet
alone does not enable tools. Only connect clients you trust.

## Cursor with native remote MCP support

For client versions supporting this format, use the following configuration
in your private `.cursor/mcp.json`, replacing the placeholder locally:

```json
{
  "mcpServers": {
    "send-letters-online": {
      "url": "https://sendlettersonline.co.uk/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

Prefer your client's supported secret/environment interpolation mechanism.
Do not commit a real key. This repository intentionally excludes
`.cursor/mcp.json`.

## Command-based clients, including Claude Desktop

For clients needing a local command, a third-party bridge such as
`mcp-remote` can connect to the hosted server. Install a supported Node.js
runtime first and review the bridge before executing it.

Merge this server entry into your private `claude_desktop_config.json` or
equivalent `mcp.json`:

```json
{
  "mcpServers": {
    "send-letters-online": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://sendlettersonline.co.uk/api/mcp",
        "--header",
        "Authorization:${SLO_AUTHORIZATION}"
      ],
      "env": {
        "SLO_AUTHORIZATION": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

The `${SLO_AUTHORIZATION}` placeholder is expanded by the bridge. Configure
your actual credential privately, never in a shared repository. `npx -y`
downloads and runs third-party code; production integrations should review
and pin an appropriate bridge version.

## First requests

Start with: “Check my Send Letters Online balance. Do not order anything.”

The five tools are:

- `get_balance`
- `list_orders`
- `get_order`
- `preview_letter_price`
- `create_letter_order`

See [tool inputs and the spending contract](agent-tools.md).
Always review the complete letter, recipient and live total before approving.
The server's confirmation fields are a safeguard, not independent proof that
a person consented. Your client must actually ask for that approval.

Disconnect or revoke keys/connections through your account settings if no
longer needed. Disconnecting cannot recall an already ordered letter.
