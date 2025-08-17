import { ethers } from "ethers";
import abi from "../abi/pinv-abi.json";

const RPC = import.meta.env.VITE_RPC_URL;
const ADDRESS = import.meta.env.VITE_PINV_ADDRESS;

export function getReadContract() {
  const provider = new ethers.JsonRpcProvider(RPC);
  return new ethers.Contract(ADDRESS, abi, provider);
}
