import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const address = process.env.VITE_PINV_ADDRESS;
const api = process.env.PULSESCAN_API || 'https://api.scan.v4.testnet.pulsechain.com/api';

if (!address) {
  console.error('❌ Brak VITE_PINV_ADDRESS w env.');
  process.exit(1);
}

const url = \\?module=contract&action=getabi&address=\\;
console.log('Fetching ABI from:', url);

const res = await fetch(url);
if (!res.ok) {
  console.error('❌ HTTP error:', res.status, await res.text());
  process.exit(1);
}

const data = await res.json().catch(() => ({}));
if (!data || !data.result) {
  console.error('❌ Unexpected response:', data);
  process.exit(1);
}

let abi;
try {
  abi = JSON.parse(data.result);
} catch (e) {
  console.error('❌ Could not parse ABI:', e);
  process.exit(1);
}

const outDir = resolve('src/abi');
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, 'pinv-abi.json'), JSON.stringify(abi, null, 2));
console.log('✅ ABI written to src/abi/pinv-abi.json');
