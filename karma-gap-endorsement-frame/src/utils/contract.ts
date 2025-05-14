import { BrowserProvider, Contract, type InterfaceAbi } from 'ethers';
import TipJarJson from "../abi/TipJar.json";

// const TIPJAR_ADDRESS = "0xdB558B27EF3C75230905d6bcAdFb61Bf9e77f000"; //testnet
const TIPJAR_ADDRESS = "0xdB558B27EF3C75230905d6bcAdFb61Bf9e77f000";  //mainnet

export const getTipJarContract = async () => {
  if (typeof window === "undefined") return null;

  try{
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const abi = (TipJarJson as { abi: InterfaceAbi }).abi;
    const contract = new Contract(TIPJAR_ADDRESS, abi, signer);
    console.log("✅ Contract instance created:", contract);
    return contract;
//   return new Contract(TIPJAR_ADDRESS, abi, signer);
  } catch (err) {
    console.error("❌ Failed to create contract instance", err);
    return null;
  }
};
