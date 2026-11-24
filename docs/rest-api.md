# REST API

Base URL: `https://sendlettersonline.co.uk/api/v1`.
Send `Authorization: Bearer YOUR_API_KEY` with every request.
API access must be enabled, independently of your wallet being funded.

## Endpoints

| Method | Path | Behaviour |
| --- | --- | --- |
| GET | `/balance` | Returns `balanceCents` and `currency` |
| GET | `/orders?limit=20&offset=0` | Returns `{ "orders": [...], "total": ... }` |
| GET | `/orders/{id}` | Returns an owned order, or 404 |
| POST | `/uploads/request-url` | Reserves a private upload for this customer |
| POST | `/orders` | Creates and immediately pays for a letter |

Use an integer limit from 1 to 100 and a non-negative integer offset.
Order data is sensitive. Do not post responses in public issues.

## Text order body

See [`../examples/letter.json`](../examples/letter.json) for an illustrative
payload using a fictional recipient. Replace it with the actual intended
recipient and reviewed content before sending. The JSON file alone does not
create anything.

The live endpoint reads **`content`**, not `contentText`.
It does not require `contentType: "TEXT"`.

| Field | Meaning |
| --- | --- |
| `serviceClass` | Service code, listed below |
| `pages` | Content page count, excluding the added address page |
| `colour` | Boolean, default false |
| `doubleSided` | Boolean, default false |
| `recipientName` | Required recipient name |
| `recipientLine1` | Required first address line |
| `recipientLine2` | Optional second address line |
| `recipientCity` | Required town or city |
| `recipientPostcode` | Required postcode on this API surface |
| `recipientCountry` | ISO alpha-2 code, default `GB` |
| `senderName`, `senderLine1`, `senderPostcode` | Optional sender fields |
| `content` | Plain-text letter body, unless uploading a document |
| `contentUploadPath` | Your verified upload's `objectPath`, instead of text |
| `contentMimeType`, `contentOriginalFilename` | Optional REST upload metadata |

Do not assume that address exceptions supported by the website are available
through this API. Check support before integrating postcode-free addresses.

Service codes:

```text
SECOND_CLASS
FIRST_CLASS
SECOND_CLASS_SIGNED
SIGNED_FOR
SPECIAL_DELIVERY
TRACKED_48
TRACKED_24
INTERNATIONAL_STANDARD
INTERNATIONAL_TRACKED
INTERNATIONAL_TRACKED_SIGNED
```

`SIGNED_FOR` is First Class Signed For. A listed code does not guarantee that
every destination or combination is available.

### Paid creation

`POST /orders` with `Content-Type: application/json` and the reviewed order
body returns HTTP 201 with the created order.

**This is a real purchase debited immediately from Account Credit.**
REST does not expose a price-preview route or enforce the agent confirmation
fields. Adding `confirmed: false` to a REST request does not make it a dry run.
Use MCP or A2A to obtain a non-spending quote when needed.

## Upload a document

1. POST `/uploads/request-url` using your API key. The response contains
   `uploadURL` and `objectPath`.
2. PUT the raw document bytes to `uploadURL`. This is a signed storage URL;
   **do not forward your API Authorization header to it**.
3. Wait for a successful upload response.
4. Submit an order using `contentUploadPath: objectPath`.

The upload must have been requested by the same authenticated customer.
Treat signed URLs and object paths as private. Use a valid PDF and check
the printable content before ordering. The server counts uploaded content
pages during creation, rather than trusting a caller's estimate.

For MCP/A2A upload quotes, supply an accurate `pages` value. A preliminary
quote does not verify the uploaded file; creation performs additional
ownership, document and balance checks.

## Status, errors and retry policy

Poll `GET /orders/{id}` at a reasonable interval. Creation, printing, posting
and delivery are different stages. Tracking is only available for supported
services and can arrive later. This API does not document customer webhooks.

| HTTP | Typical meaning |
| --- | --- |
| 400 | Invalid order or unverified upload |
| 401 | Missing, invalid or disabled credentials |
| 402 | Insufficient Account Credit |
| 403 | API access disabled during order creation |
| 404 | Owned order not found |
| 429 | Shared account rate limit exceeded |

The current limit is 60 requests per minute per account, shared across REST,
MCP and A2A. Slow down on 429. Use backoff for read-only requests.

No idempotency-key contract is documented for order creation. A timeout
does not prove failure. Inspect order history and contact support if uncertain
before repeating a paid submission.
