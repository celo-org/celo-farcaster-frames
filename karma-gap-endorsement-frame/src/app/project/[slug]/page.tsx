'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { parseEther } from 'ethers';
import { getTipJarContract } from '../../../utils/contract'; 
import '../../globals.css';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function ProjectPage() {
  const [project, setProject] = useState<any>(null);
  const pathname = usePathname();
  const slug = pathname?.split('/').pop();
  const [showEndorseForm, setShowEndorseForm] = useState(false);
  const [endorsement, setEndorsement] = useState('');
  const [isTipping, setIsTipping] = useState(false);
  const [networkName, setNetworkName] = useState('');


  useEffect(() => {
    if (!slug) return;

    async function fetchProject() {
      try {
        const res = await fetch(`https://gapapi.karmahq.xyz/projects/${slug}`);
        const data = await res.json();
        setProject(data);
      } catch (error) {
        console.error('Failed to fetch project:', error);
      }
    }

      fetchProject();
    }, [slug]);

  const handleTip = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }
  
      // Check and switch to Alfajores if needed
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      // const targetChainId = '0xaef3'; // Celo Alfajores testnet chainId in hex
      const targetChainId = '0xa4ec'; // Celo mainnet chainId in hex
  
      if (currentChainId !== targetChainId) {
        // await window.ethereum.request({
        //   method: "wallet_addEthereumChain",
        //   params: [{
        //     chainId: targetChainId,
        //     chainName: "Celo Alfajores",
        //     nativeCurrency: {
        //       name: "CELO",
        //       symbol: "CELO",
        //       decimals: 18,
        //     },
        //     rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
        //     blockExplorerUrls: ["https://alfajores.celoscan.io"],
        //   }],
        // });

        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: targetChainId,
            chainName: "Celo Mainnet",
            nativeCurrency: {
              name: "CELO",
              symbol: "CELO",
              decimals: 18,
            },
            rpcUrls: ["https://forno.celo.org"],
            blockExplorerUrls: ["https://celoscan.io"],
          }],
        });
      }

      // const chain = await window.ethereum.request({ method: 'eth_chainId' });
      // console.log("✅ Current Chain ID:", chain); // should be '0xaef3'

  
      const contract = await getTipJarContract();
      if (!contract) {
        alert("Contract connection failed.");
        return;
      }
  
      setIsTipping(true);
      // console.log("Tipping slug:", slug);
      const tx = await contract.tipInCelo(slug, {
        value: parseEther("0.0001"),
      });
      await tx.wait();
  
      alert("✅ Tip sent successfully!");
    } catch (err: any) {
      if (err?.code === "CALL_EXCEPTION" && err?.message?.includes("missing revert data")) {
        alert("❌ Not enough CELO to send tip.");
      } else {
        alert("❌ Failed to tip: " + (err?.message || "Unknown error"));
      }
      console.error("❌ Error:", err);
    } finally {
      setIsTipping(false);
    }
  };
  
  

  if (!project || !project.details || !project.details.data) {
    return <p className="loading">Loading project...</p>;
  }

  const projectDetails = project.details.data;
  const title = projectDetails?.title || slug || 'Untitled Project';
  const description = projectDetails?.description || 'No mission statement provided.';
  const projectLink = `https://gap.karmahq.xyz/project/${slug}`;

  function handleEndorse() {
    if (!endorsement.trim()) {
      alert('Please write something to endorse.');
      return;
    }
    alert(`Submitted endorsement: "${endorsement}"`);
    setEndorsement('');
  }

  return (
    <div className="project-container">
      {networkName && (
        <p className="network-status">
          🌐 Connected to: <strong>{networkName}</strong>
        </p>
      )}
      <h1 className="project-title">{title}</h1>
      <img src="https://via.placeholder.com/300" alt="Project visual" className="project-image" />
      <p className="project-description">{description}</p>

      <div className="button-row">
        <button className="button tip" onClick={handleTip} disabled={isTipping}>
          {isTipping ? "Tipping..." : "💸 Tip 0.0001 CELO"}
        </button>
        <a href={projectLink} target="_blank" rel="noopener noreferrer" className="button secondary">
          🔗 Learn More
        </a>
      </div>

      <div className="button-row">
        <button className="button endorse" onClick={() => setShowEndorseForm(!showEndorseForm)}>
          📝 Endorse
        </button>

        <button className="button">➡️ Next Project</button>
      </div>

      {showEndorseForm && (
        <div className="input-box">
          <label htmlFor="endorsement">Endorse this project:</label>
          <textarea
            id="endorsement"
            rows={3}
            placeholder="Write a short endorsement message..."
            value={endorsement}
            onChange={(e) => setEndorsement(e.target.value)}
          />
          <button className="button endorse" onClick={handleEndorse}>
            ✅ Submit Endorsement
          </button>
        </div>
      )}
    </div>
  );
}
