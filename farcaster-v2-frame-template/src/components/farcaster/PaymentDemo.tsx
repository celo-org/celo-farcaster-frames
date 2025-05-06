"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import sdk from "@farcaster/frame-sdk";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useBalance,
  useSwitchChain,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { truncateAddress } from "../../lib/truncateAddress";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { celo, celoAlfajores } from "wagmi/chains";
import { Button } from "../ui/Button";

export default function PaymentDemo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<
    "Celo" | "celoAlfajores"
  >("Celo");

  const { switchChain } = useSwitchChain();

  // Wagmi hooks
  const { address, isConnected, chain } = useAccount();
  const {
    data: hash,
    sendTransaction,
    isPending: isSending,
  } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  // Fetch user balance
  const { data: balance } = useBalance({
    address,
    chainId: selectedNetwork === "Celo" ? celo.id : celoAlfajores.id,
  });

  // Handle sending tokens
  const handleSendTokens = async () => {
    if (!selectedUser || !amount || !address) {
      return;
    }

    // Validate balance
    if (balance && parseEther(amount) > balance.value) {
      setError("Insufficient balance");
      return;
    }

    try {
      // Convert amount to wei
      const value = parseEther(amount);

      // Send transaction
      await sendTransaction({
        to: selectedUser.verified_addresses.eth_addresses[0], // Use the user's verification address
        value: value,
        chainId: selectedNetwork === "Celo" ? celo.id : celoAlfajores.id,
      });
    } catch (error) {
      console.error("Error sending tokens:", error);
      setError("Failed to send tokens. Please try again.");
    }
  };

  // Handle network switch
  const handleNetworkSwitch = async (network: "Celo" | "celoAlfajores") => {
    setSelectedNetwork(network);
    await switchChain({
      chainId: network === "Celo" ? celo.id : celoAlfajores.id,
    });
  };

  // Debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch users from API
  const fetchUsers = async (query: string) => {
    if (!query) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/getUser?q=${encodeURIComponent(query)}&limit=10`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = debounce(fetchUsers, 300);

  // Trigger search when query changes
  useEffect(() => {
    if (query.length > 0) {
      debouncedSearch(query);
    }
  }, [query]);

  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  // If a user is selected, show the send token form
  if (selectedUser) {
    return (
      <div className="w-full flex flex-col p-4 bg-white rounded-lg shadow">
        <div className="mb-4 flex justify-end w-full">
          <ConnectButton />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-center text-black">
          Send Tokens to {selectedUser.username}
        </h1>
        <div className="flex justify-center">
          <img
            src={selectedUser.pfp_url || "/default-avatar.png"}
            alt={selectedUser.username}
            className="w-12 h-12 rounded-full"
          />
        </div>
        <div className="my-2 text-xs text-center text-gray-500">
          Address:{" "}
          <span className="font-mono">
            {truncateAddress(selectedUser.verified_addresses.eth_addresses[0])}
          </span>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Network</label>
            <select
              value={selectedNetwork}
              onChange={(e) =>
                handleNetworkSwitch(e.target.value as "Celo" | "celoAlfajores")
              }
              className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500 text-black"
            >
              <option value="Celo">Celo Mainnet</option>
              <option value="celoAlfajores">Celo Alfajores (Testnet)</option>
            </select>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Your Balance: {balance ? formatEther(balance.value) : "0"} CELO
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendTokens();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Amount (CELO)
              </label>
              <input
                type="text"
                placeholder="Enter amount..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500 text-black"
              />
              {balance && amount !== "" && parseEther(amount) > balance.value && (
                <p className="text-red-500 text-sm mt-1">
                  Insufficient balance
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={
                isSending ||
                isConfirming ||
                (balance && amount !== "" && parseEther(amount) > balance.value)
              }
              isLoading={isSending || isConfirming}
              className="w-full"
            >
              Send Tokens
            </Button>
          </form>

          {isConfirmed && (
            <p className="mt-4 text-green-500 text-center">
              Tokens sent successfully!
            </p>
          )}

          {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
          {hash && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-sm text-center">
              Transaction Hash: {truncateAddress(hash)}
            </div>
          )}

          <Button
            onClick={() => setSelectedUser(null)}
            className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-black"
          >
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto py-4 px-2 bg-white rounded-lg shadow">
      <div className="flex justify-center mb-6">
        <img src="/Celo_Wordmark_RGB_Onyx.svg" width={100} height={36} alt="Celo Logo" className="h-9" />
      </div>
      <h1 className="text-xl font-bold text-center mb-4 text-black">Celo Payment Demo</h1>

      <div className="mb-6 flex justify-center w-full">
        <ConnectButton />
      </div>

      {isConnected && (
        <div>
          <h2 className="text-lg font-medium mb-4 text-center text-black">
            Search Farcaster Users
          </h2>

          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Enter username..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500 text-black"
            />
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <p className="text-red-500 text-center py-4">{error}</p>
            ) : users.length > 0 ? (
              <ul className="space-y-3">
                {users.map((user) => (
                  <li
                    key={user.fid}
                    onClick={() => setSelectedUser(user)}
                    className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <img
                      src={user.pfp_url || "/default-avatar.png"}
                      alt={user.username}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="text-black">
                      <p className="font-bold">{user.username}</p>
                      <p className="text-sm text-gray-500">FID: {user.fid}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-center text-gray-500">
                {query ? "No results found" : "Start typing to search"}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}