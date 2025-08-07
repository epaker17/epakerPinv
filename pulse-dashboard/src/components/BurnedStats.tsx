import { useReadContract } from "wagmi";
import PINV_ABI from "../abi/PINV.json";

// Adres kontraktu PINV oraz początkowa emisja (dostosuj jeśli inne wartości!)
const PINV_ADDRESS = "0x9cD66EB8b7280B5fcd0DF5bF3058ba5919Aa46a3";
const PINV_INITIAL_SUPPLY = 21_000_000; // początkowa ilość tokenów (bez 18 zer!)

export default function BurnedStats() {
  // Pobieranie totalSupply z kontraktu
  const { data: totalSupplyRaw, isLoading } = useReadContract({
    address: PINV_ADDRESS,
    abi: PINV_ABI,
    functionName: "totalSupply",
  });

  // Pobieranie ilości miejsc po przecinku
  const { data: decimals } = useReadContract({
    address: PINV_ADDRESS,
    abi: PINV_ABI,
    functionName: "decimals",
  });

  // Obliczanie spalonych tokenów i % supply
  let burned = 0;
  let burnedPercent = 0;
  if (
    typeof totalSupplyRaw !== "undefined" &&
    typeof decimals === "number"
  ) {
    const totalSupply = Number(totalSupplyRaw) / 10 ** decimals;
    burned = PINV_INITIAL_SUPPLY - totalSupply;
    burnedPercent = (burned / PINV_INITIAL_SUPPLY) * 100;
  }

  return (
    <div
      style={{
        background: "#222c46",
        color: "#FFD700",
        borderRadius: 18,
        padding: "18px 30px",
        margin: "0 auto 32px auto",
        textAlign: "center",
        maxWidth: 400,
        boxShadow: "0 2px 18px #0003",
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: 1,
      }}
    >
      {isLoading ? (
        "Loading burned stats..."
      ) : (
        <>
          🔥 <span style={{ fontWeight: 800, fontSize: 26 }}>
            {burned.toLocaleString("pl-PL", { maximumFractionDigits: 2 })}
          </span> PINV
          <br />
          <span style={{ fontSize: 15, color: "#7d8a95" }}>
            Burned ({burnedPercent.toLocaleString("pl-PL", { maximumFractionDigits: 2 })}% supply)
          </span>
        </>
      )}
    </div>
  );
}
