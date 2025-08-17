import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const address = process.env.VITE_PINV_ADDRESS;
const api = process.env.PULSESCAN_API || "https://api.scan.v4.testnet.pulsechain.com/api";
const outDir = resolve("src/abi");
const outFile = resolve(outDir, "pinv-abi.json");

async function fetchAbiWithRetry(url, retries = 3) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
      lastErr = new Error(`HTTP ${res.status}: ${await res.text()}`);
    } catch (e) {
      lastErr = e;
    }
    await new Promise(r => setTimeout(r, 1500 * (i + 1)));
  }
  throw lastErr;
}

async function main() {
  if (!address) {
    console.error("❌ Brak VITE_PINV_ADDRESS w env.");
    if (existsSync(outFile)) {
      console.warn("⚠️  Używam istniejącego ABI:", outFile);
      process.exit(0);
    }
    process.exit(1);
  }

  const url = `${api}?module=contract&action=getabi&address=${address}`;
  console.log("Fetching ABI from:", url);

  try {
    const data = await fetchAbiWithRetry(url, 3);
    const result = data?.result;
    if (!result) throw new Error("Unexpected response: " + JSON.stringify(data)?.slice(0,200));

    let abi;
    try { abi = JSON.parse(result); }
    catch (e) { throw new Error("ABI parse failed: " + String(e) + " first: " + String(result).slice(0,200)); }

    mkdirSync(outDir, { recursive: true });
    writeFileSync(outFile, JSON.stringify(abi, null, 2));
    console.log("✅ ABI written to", outFile);
  } catch (e) {
    console.warn("⚠️  Nie udało się pobrać ABI:", e?.message || e);
    if (existsSync(outFile)) {
      console.warn("⚠️  Używam istniejącego ABI:", outFile);
      process.exit(0);
    } else {
      console.error("❌ Brak zapasowego ABI. Zapisz lokalne ABI i ponów build.");
      process.exit(1);
    }
  }
}
main();
