// 'use client';
// import React, { useState } from 'react';
// import { BrowserProvider, Contract, ethers } from 'ethers';
// import { getTipJarContract } from '../utils/contract'; // Ensure this returns a Promise<Contract | null>
// import '../app/globals.css';

// // TypeScript support for window.ethereum
// declare global {
//   interface Window {
//     ethereum?: any;
//   }
// }

// export default function ProjectCard() {
//   const [endorsement, setEndorsement] = useState<string>('');
//   const [isTipping, setIsTipping] = useState<boolean>(false);

//   const handleEndorse = () => {
//     alert(`Endorsed with message: ${endorsement}`);
//     // Add your API call here to save the endorsement
//   };

//   const handleTip = async () => {
//     console.log("💡 Tip button clicked");
//     try {
//       console.log("💡 Tip button clicked");
//       if (!window.ethereum) {
//         alert("Please install MetaMask with Celo support.");
//         return;
//       }

//       // Connect wallet
//       await window.ethereum.request({ method: 'eth_requestAccounts' });

//       // Ensure you're on Celo Alfajores
//       await window.ethereum.request({
//         method: "wallet_addEthereumChain",
//         params: [{
//           chainId: '0xaef3', // Hex for 44787
//           chainName: 'Celo Alfajores',
//           nativeCurrency: {
//             name: 'CELO',
//             symbol: 'CELO',
//             decimals: 18,
//           },
//           rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
//           blockExplorerUrls: ['https://alfajores.celoscan.io'],
//         }],
//       });

//       // ✅ Await the contract promise
//       const contract = await getTipJarContract();
//       if (!contract) {
//         alert("Smart contract not available.");
//         return;
//       }

//       const tipAmount = ethers.parseEther("0.1"); // use `ethers.parseEther` in Ethers v6
//       setIsTipping(true);

//       // ✅ Make sure "project-slug" is dynamically replaced as needed
//       const tx = await contract.tipInCelo("project-slug", { value: tipAmount });
//       await tx.wait();

//       alert("✅ Tip sent!");
//     } catch (err: unknown) {
//       const error = err as { message?: string };
//       console.error(err);
//       alert("❌ Failed to tip: " + (error.message || "Unknown error"));
//     } finally {
//       setIsTipping(false);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>[Project Name]</h2>
//       <img src="https://via.placeholder.com/500x200" alt="Banner" className="project-image" />
//       <p>[Mission Statement]</p>

//       <div className="project-buttons">
//         <button className="button tip" onClick={handleTip}>
//           {isTipping ? "Tipping..." : "Tip 0.1 CELO"}
//         </button>
//         <button className="button">Learn More</button>
//         <button className="button endorse" onClick={handleEndorse}>Endorse</button>
//         <button className="button secondary">Next</button>
//       </div>

//       <div className="input-box">
//         <textarea
//           rows={3}
//           placeholder="Add your endorsement message"
//           value={endorsement}
//           onChange={(e) => setEndorsement(e.target.value)}
//         />
//         <button className="button endorse" onClick={handleEndorse}>Submit Endorsement</button>
//       </div>
//     </div>
//   );
// }
