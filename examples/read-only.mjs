// Node.js 20+. Read-only requests only. Never logs the credential.
const action = process.argv[2] ?? "balance";
const id = process.argv[3];
const actions = new Set(["balance", "orders", "order", "a2a-balance"]);

async function main() {
  if (!actions.has(action) || (action === "order" && !id)) {
    throw new Error("Usage: node examples/read-only.mjs [balance|orders|order ORDER_ID|a2a-balance]");
  }
  const key = process.env.SLO_API_KEY;
  if (!key?.trim()) throw new Error("Supply SLO_API_KEY privately through your environment.");

  const origin = "https://sendlettersonline.co.uk";
  const path = action === "a2a-balance" ? "/api/a2a"
    : action === "order" ? `/api/v1/orders/${encodeURIComponent(id)}`
    : action === "orders" ? "/api/v1/orders?limit=20&offset=0"
    : "/api/v1/balance";
  const headers = { Authorization: `Bearer ${key}` };
  const options = { headers, signal: AbortSignal.timeout(30_000), redirect: "error" };
  if (action === "a2a-balance") {
    options.method = "POST";
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify({
      jsonrpc: "2.0", id: "balance-1", method: "message/send",
      params: { message: {
        kind: "message", role: "user", messageId: "balance-request-1",
        parts: [{ kind: "data", data: { skill: "get_balance", input: {} } }],
      } },
    });
  }
  const response = await fetch(`${origin}${path}`, options);
  if (!response.ok) throw new Error(`Request failed (HTTP ${response.status}). Check access, credit and rate limits.`);
  const data = await response.json();
  if (action === "a2a-balance" && data.error) {
    throw new Error(`A2A returned JSON-RPC error ${data.error.code}.`);
  }
  console.log(JSON.stringify(data, null, 2));
}

main().catch(() => {
  // Do not echo transport exceptions or API responses that may contain secrets.
  console.error("Request failed. Check the command, SLO_API_KEY, API access, network and rate limit. No order was submitted.");
  process.exitCode = 1;
});
