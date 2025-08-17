import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const address = process.env.VITE_PINV_ADDRESS;
const api = process.env.PULSESCAN_API || "https://api.scan.v4.testnet.pulsechain.com/api";

if (!address) {
  console.error("❌ Brak VITE_PINV_ADDRESS w env.");
  process.exit(1);
}

const url = `${api}?module=contract&action=getabi&address=${address}`;
console.log("Fetching ABI from:", url);

let res;
try {
  res = await fetch(url);
} catch (e) {
  console.error("❌ Network error:", e);
  process.exit(1);
}

if (!res.ok) {
  console.error("❌ HTTP error:", res.status, await res.text());
  process.exit(1);
}

let data;
try {
  data = await res.json();
} catch (e) {
  console.error("❌ JSON parse failed:", e);
  process.exit(1);
}

const result = data?.result;
if (!result) {
  console.error("❌ Unexpected response:", data);
  process.exit(1);
}

let abi;
try {
  abi = JSON.parse(result);
} catch (e) {
  console.error("❌ ABI parse failed:", e, "\nFirst 200 chars:", String(result).slice(0, 200));
  process.exit(1);
}

const outDir = resolve("src/abi");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "pinv-abi.json"), JSON.stringify(abi, null, 2));
console.log("✅ ABI written to src/abi/pinv-abi.json");
