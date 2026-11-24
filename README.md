# Send Letters Online: API and MCP

**Official website: [SendLettersOnline.co.uk](https://sendlettersonline.co.uk/)**

Developer documentation and examples for sending physical letters through
[Send Letters Online](https://sendlettersonline.co.uk).

This repository documents the hosted service. It does not contain the private
application, a self-hostable server or an official SDK.

## Choose your integration

| Integration | Endpoint | Use it for |
| --- | --- | --- |
| REST | `https://sendlettersonline.co.uk/api/v1` | Direct HTTP integration |
| MCP | `https://sendlettersonline.co.uk/api/mcp` | Compatible AI assistants |
| A2A v0.3 | `https://sendlettersonline.co.uk/api/a2a` | Compatible agent platforms |

All three use the same enabled customer account, Account Credit and order
history. Adding credit does not itself enable API access.

## Get started safely

1. Create an account at [Send Letters Online](https://sendlettersonline.co.uk).
2. Open [API access](https://sendlettersonline.co.uk/app/api-access) and arrange
   enabled access. Obtain your API key privately.
3. Supply the key using your shell's secure environment/secret facility as
   `SLO_API_KEY`. Never put it in a repository, screenshot, chat or issue.
4. Try the read-only balance request:

```sh
curl --fail-with-body --silent --show-error \
  https://sendlettersonline.co.uk/api/v1/balance \
  -H "Authorization: Bearer ${SLO_API_KEY}"
```

The response has `balanceCents` (integer pence) and `currency: "GBP"`.

Alternatively, with Node.js 20 or later:

```sh
node examples/read-only.mjs balance
node examples/read-only.mjs orders
node examples/read-only.mjs order YOUR_ORDER_ID
node examples/read-only.mjs a2a-balance
```

The executable examples only read data. They never place an order.

## Documentation

- [REST requests, uploads and errors](docs/rest-api.md)
- [MCP setup for Claude and Cursor](docs/mcp.md)
- [Shared agent tool inputs and confirmation](docs/agent-tools.md)
- [A2A messaging](docs/a2a.md)
- [Security and safe integration](SECURITY.md)

## Important spending safeguards

- REST `POST /orders` immediately creates and pays for an order. It has no
  quote-confirmation handshake.
- MCP and A2A offer `preview_letter_price`. Calling `create_letter_order`
  without `confirmed: true` returns a quote and creates nothing.
- A confirmed agent order also requires `expectedTotalPence` matching the
  current quote. Your client must obtain human approval for that specific
  letter, address and total.
- API operations are live. Do not assume a sandbox or test-mode credential.
- Do not automatically retry an uncertain order-creation request. Check order
  history first to avoid duplicate letters and charges.

UK services include Second Class, First Class, Signed For, Tracked and Special
Delivery options. Availability depends on destination and current service
rules. Postal aims are not unconditional delivery guarantees.

## Useful links

- [Developer website](https://sendlettersonline.co.uk/developers)
- [MCP website](https://sendlettersonline.co.uk/mcp)
- [Pricing](https://sendlettersonline.co.uk/pricing)
- [Terms](https://sendlettersonline.co.uk/terms)
- [Support](mailto:hello@sendlettersonline.co.uk)

Documentation checked against the implementation on 24 November 2026.
For pricing, request a current agent quote rather than hardcoding totals.
