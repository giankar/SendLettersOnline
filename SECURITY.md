# Security and privacy

Never publish API keys, OAuth tokens, signed upload URLs, uploaded documents,
customer addresses, letter content or live order responses.

Supply keys using private environment variables or your client's supported
secret store. Local MCP configurations containing credentials must not be
committed. Revoke exposed credentials promptly through your account.

Do not send the Bearer API key to signed storage upload URLs. Credentials
belong only on requests to the intended authenticated service endpoint.

API access can spend real Account Credit. Agent clients must ask for explicit
human approval for the exact letter, recipient and live total. Quote matching
is not proof of consent. Do not auto-retry uncertain paid requests.

For vulnerabilities, contact hello@sendlettersonline.co.uk privately.
Do not include credentials or personal data in public GitHub issues.
