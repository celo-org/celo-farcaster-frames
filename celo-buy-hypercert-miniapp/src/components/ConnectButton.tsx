import { useAccount, useConnect } from 'wagmi';

export function ConnectButton() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const farcasterConnector = connectors[0]; // The Farcaster connector is the only one we added

  if (isConnected) {
    return <button className="p-2 bg-green-500 text-white rounded">Connected</button>;
  }

  return (
    <button 
      className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium rounded-xl shadow-sm hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
      onClick={() => connect({ connector: farcasterConnector })}
    >
      Connect Wallet
    </button>
  );
}