"use client";

import { useState, useEffect } from "react";
import { 
  useAccount, 
  useSendTransaction, 
  useWaitForTransactionReceipt, 
  useWriteContract 
} from "wagmi";
import { Button } from "../ui/Button";
import { Address, parseEther, parseUnits } from "viem";
import { ExternalLink, X, ChevronDown } from "lucide-react";
import { 
  Tokens, 
  TokenId, 
  getTokenOptionsByChainId, 
  getTokenAddress, 
} from "../../app/config/tokens";
import { TokenIcon } from "../../tokens/TokenIcon";

interface User {
  fid: number;
  username: string;
  display_name?: string;
  pfp_url?: string;
  object: string;
  verified_addresses: {
    eth_addresses: string[];
  };
}

interface Token {
  id: TokenId;
  name: string;
  symbol: string;
  address: Address;
  decimals: number;
  color: string;
}

// Modal component
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  type = "info" 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode;
  type?: "info" | "success" | "error"; 
}) => {
  if (!isOpen) return null;

  const getBgColor = () => {
    switch (type) {
      case "success": return "bg-green-50 border-green-500";
      case "error": return "bg-red-50 border-red-500";
      default: return "bg-blue-50 border-blue-500";
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case "success": return "text-green-700";
      case "error": return "text-red-700";
      default: return "text-blue-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative w-full max-w-md p-6 mx-4 rounded-lg shadow-lg ${getBgColor()} border`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-medium ${getTitleColor()}`}>{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-2">
          {children}
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

// Token Selector Component
const TokenSelector = ({ 
  tokens,
  selectedToken,
  onSelect
}: { 
  tokens: Token[];
  selectedToken: Token;
  onSelect: (token: Token) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <div 
        className="flex items-center justify-between p-2 border border-gray-300 rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <TokenIcon size="xs" token={selectedToken} />
          <span className="ml-2 text-black">{selectedToken.symbol}</span>
        </div>
        <ChevronDown size={16} />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {tokens.map((token) => (
            <div 
              key={token.address} 
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(token);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center">
                <TokenIcon size="xs" token={token} />
                <div className="ml-2 text-black">{token.symbol}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function UserSearch() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tipAmount, setTipAmount] = useState<string>("");
  const [userAddress, setUserAddress] = useState<string>("");
  const [txHashLink, setTxHashLink] = useState<string | null>(null);

  const chainId = "42220" as const;
  const tokenOptions = getTokenOptionsByChainId(chainId);
  const initialTokens = tokenOptions.map((id) => ({
    ...Tokens[id as TokenId],
    address: getTokenAddress(id as TokenId, chainId),
    id: id as TokenId,
  }));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [availableTokens, setAvailableTokens] = useState<Token[]>(initialTokens);
  const [selectedToken, setSelectedToken] = useState<Token>(initialTokens[0]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"info" | "success" | "error">("info");

  const { isConnected } = useAccount();
  const { 
    sendTransaction, 
    data: txHash, 
    isPending: isSendTxPending,
    error: sendTxError 
  } = useSendTransaction();

  const { 
    writeContract,
    data: writeTxHash,
    isPending: isWritePending,
    error: writeError
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: txHash || writeTxHash,
  });

  const showModal = (title: string, message: string, type: "info" | "success" | "error" = "info") => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalMessage("");
    setModalType("info");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm.length === 0) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/getUser?q=${encodeURIComponent(searchTerm)}&limit=10`);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        showModal("Error", "Failed to fetch users. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (searchTerm.length > 0) {
        fetchUsers();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setUserAddress(user.verified_addresses.eth_addresses[0]);
    setTipAmount("");
  };

  const ERC20_ABI = [
    {
      "constant": false,
      "inputs": [
        { "name": "_to", "type": "address" },
        { "name": "_value", "type": "uint256" }
      ],
      "name": "transfer",
      "outputs": [{ "name": "", "type": "bool" }],
      "type": "function"
    }
  ];

  const handleSendTip = () => {
    if (!selectedUser || parseFloat(tipAmount) <= 0) {
      showModal("Invalid Amount", "Please enter a valid tip amount.", "error");
      return;
    }
    if (!isConnected) {
      showModal("Wallet Not Connected", "Please connect your wallet first.", "error");
      return;
    }

    // For native ETH
    if (selectedToken.address === "0x0000000000000000000000000000000000000000") {
      sendTransaction({
        to: userAddress as `0x${string}`,
        value: parseEther(tipAmount),
      });
    } else {
      // ERC20 transfer
      writeContract({
        address: selectedToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [
          userAddress as `0x${string}`,
          parseUnits(tipAmount, selectedToken.decimals), 
        ],
      });
    }
  };

  const truncateHash = (hash: string | undefined) => {
    if (!hash) return "";
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const shareFrame = async () => {
    const href = "https://warpcast.com/~/compose?text=This%20is%20a%20Celo%20Tip%20Me%20Template.%20Try%20it%20out%20and%20share%20your%20feedback!%20Thanks%20for%20your%20support.&embeds%5B%5D=https://farcaster-v2-frame-template.vercel.app/";
    window.open(href, "_blank");
  };
   
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getShortError = (error: any) => {
    if (!error?.message) return "Unknown error";
    if (error.message.includes("reverted")) {
      const reason = error.message.split("reverted")[1]?.split(".")[0]?.trim();
      if (reason?.includes("zero address")) return "Invalid address or no balance";
      if (reason?.includes("exceeds balance")) return "Insufficient balance";
      return reason || "Transaction reverted";
    }
    if (error.message.includes("rejected") || error.message.includes("denied")) return "Transaction rejected by user";
    return "Operation failed";
  };

  useEffect(() => { 
    if (sendTxError) {
      showModal("Transaction Failed", getShortError(sendTxError), "error");
      return;
    }
    if (writeError) {
      showModal("Transfer Failed", getShortError(writeError), "error");
      return;
    }
    if (receiptError) {
      showModal("Confirmation Failed", getShortError(receiptError), "error");
      return;
    }
    if (isSendTxPending || isWritePending) {
      showModal("Processing", "Transaction is being processed...", "info");
    }
    
    if (txHash || writeTxHash) {
      setTxHashLink(txHash || writeTxHash || null);
    }
    
    if (isConfirmed) {
      showModal(
        "Transaction Confirmed",
        `Tip of ${tipAmount} ${selectedToken.symbol} sent to ${selectedUser?.username}!`,
        "success"
      );
    }
    
    if (sendTxError && typeof sendTxError === "object" && "message" in sendTxError) {
      showModal(
        "Transaction Failed",
        `Error: ${(sendTxError as Error).message}`,
        "error"
      );
    }
    
    if (writeError) {
      showModal(
        "Transfer Failed",
        (writeError as { message: string }).message.includes("rejected") || 
        (writeError as { message: string }).message.includes("denied")
          ? "Transaction rejected by user"
          : `Error transferring ${selectedToken.symbol}: ${(writeError as { message: string }).message}`,
        "error"
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSendTxPending,
    isWritePending,
    isConfirmed,
    sendTxError,
    writeError,
    txHash,
    writeTxHash,
    receiptError,
  ]);

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-4 ">
        <input
          type="text"
          placeholder="Search for users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {isLoading && <p className="text-gray-500">Loading...</p>}
      {!isLoading && users.length > 0 && !selectedUser && (
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li
              key={user.fid}
              className="py-3 cursor-pointer hover:bg-gray-100 rounded-md px-2 transition-colors"
              onClick={() => handleSelectUser(user)}
            >
              <div className="flex items-center space-x-3">
                {user.pfp_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.pfp_url} alt={user.username} className="w-10 h-10 rounded-full" />
                )}
                <div>
                  <p className="font-medium text-black">{user.display_name || user.username}</p>
                  <p className="text-sm text-black">@{user.username}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedUser && (
        <div className="p-4 border border-gray-300 rounded-md">
          <div className="flex items-center space-x-3">
            {selectedUser.pfp_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedUser.pfp_url}
                alt={selectedUser.username}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-black">{selectedUser.display_name || selectedUser.username}</p>
              <p className="text-sm text-gray-500">@{selectedUser.username}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex gap-2 mb-2">
              <div className="flex-grow">
                <input
                  type="number"
                  placeholder={`Enter tip amount (${selectedToken.symbol})`}
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none  text-black focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.001"
                />
              </div>
              <div className="w-32">
                <TokenSelector
                  tokens={availableTokens}
                  selectedToken={selectedToken}
                  onSelect={setSelectedToken}
                />
              </div>
            </div>
            <Button
              onClick={handleSendTip}
              disabled={!isConnected || isSendTxPending || isWritePending || isConfirming}
              // isLoading={isSendTxPending || isWritePending || isConfirming}
              className="w-full"
            >
              {isSendTxPending || isWritePending || isConfirming ? 
                'Processing...' : 
                `Send ${selectedToken.symbol} Tip`}
            </Button>
            {(txHash || writeTxHash) && (
              <div className="mt-2 p-4 bg-gray-100 rounded-lg text-sm flex flex-col gap-3 shadow-md">
                <div className="flex justify-between items-center">
                  <div className="text-gray-700 font-medium">Transaction:</div>
                  <a
                    href={`https://celo.blockscout.com/tx/${txHashLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span className="text-xs">View</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
                <div className="bg-white px-3 py-2 rounded-md shadow-inner font-mono text-gray-500 text-center">
                  {truncateHash(txHash || writeTxHash)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isConfirming 
                        ? "bg-yellow-100 text-yellow-600" 
                        : isConfirmed 
                          ? "bg-green-100 text-green-600" 
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isConfirming ? "Confirming..." : isConfirmed ? "Confirmed!" : "Pending"}
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center py-2 gap-2">
              <Button onClick={() => setSelectedUser(null)}>
                Search
              </Button>
              <Button onClick={() => shareFrame()}>
                Share 
              </Button>
            </div>
          </div>
        </div>
      )}
      {!isLoading && searchTerm.length > 0 && users.length === 0 && !selectedUser && (
        <p className="text-gray-500">No users found</p>
      )}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={modalTitle}
        type={modalType}
      >
        <p className="text-gray-700">{modalMessage}</p>
      </Modal>
    </div>
  );
}