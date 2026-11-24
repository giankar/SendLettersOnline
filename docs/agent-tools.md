# MCP and A2A skills

These inputs are shared across MCP tools and A2A skills.

| Name | Input | Effect |
| --- | --- | --- |
| `get_balance` | `{}` | Read balance |
| `list_orders` | Optional `limit` (integer 1–100, default 20), `offset` (integer >=0, default 0) | Read orders |
| `get_order` | `{ "id": "YOUR_ORDER_ID" }` | Read one owned order |
| `preview_letter_price` | Order fields below | Quote only |
| `create_letter_order` | Order fields plus confirmation fields | Quote or paid order |

Order fields match [the REST fields](rest-api.md), except the agent schema
does not expose `contentMimeType` or `contentOriginalFilename`.
Agents require `pages` as an integer from 1 to 50 (default 1), boolean
`colour` and `doubleSided` (both default false), and a two-character
`recipientCountry` (default `GB`). Required address fields are
`recipientName`, `recipientLine1`, `recipientCity`, `recipientPostcode`.
Provide `content` or your own verified `contentUploadPath`.

Uploads are made through the REST upload endpoint, not embedded into agent
messages. Supply the correct page count for previews; uploaded files are
counted again during actual order creation.

## Quote first

Pass the reviewed fields from [`letter.json`](../examples/letter.json) to
`preview_letter_price`. This returns:

- `priceExVatPence`
- `vatPence`
- `totalPence`
- `currency`
- `deliveryEstimate`

MCP wraps results as tool text; A2A returns a data part.
All monetary amounts in these fields are integer pence, not pounds.
`get_balance` uses the differently named `balanceCents`, also pence in GBP.

## Confirm only after human approval

Calling `create_letter_order` with no confirmation, or `confirmed: false`,
returns a quote and creates nothing.

Only after the human approves the exact letter and current quote, call the
same tool/skill with the same order fields and:

```text
confirmed: true
expectedTotalPence: the exact integer totalPence from the current quote
```

Do not hardcode a price or send a placeholder total. Missing or mismatched
`expectedTotalPence` causes rejection. A successful call immediately debits
Account Credit and creates a real order.

Quotes do not reserve a price or balance. Order validation can still reject
a confirmed request, for example for insufficient credit or an invalid upload.

These agent safeguards **do not apply to REST `POST /orders`**.
Do not automatically retry an uncertain paid call: inspect orders first.
