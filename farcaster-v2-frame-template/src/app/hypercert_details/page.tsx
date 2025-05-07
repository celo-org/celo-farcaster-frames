"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import sdk, { type Context } from "@farcaster/frame-sdk";
import { getHypercertById } from "~/lib/graphqlQueries";

interface HypercertData {
  hypercert_id: string;
  units: number;
  metadata: {
    image: string;
    name: string;
    work_scope: string;
    description: string;
  };
  orders?: {
    totalUnitsForSale: number;
    data: {
      pricePerPercentInToken: number;
      pricePerPercentInUSD: number;
      chainId: string;
    }[];
    cheapestOrder?: {
      amounts: number[];
    };
  };
}

export default function HypercertDetails() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [hypercert, setHypercert] = useState<HypercertData | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const appUrl = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
      console.log("Farcaster SDK ready");
      sdk.actions.ready({});
    };

    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  useEffect(() => {
    const fetchHypercert = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getHypercertById(id);
        if (data && Array.isArray(data) && data.length > 0) {
          setHypercert(data[0]);
        } else {
          setHypercert(data as unknown as HypercertData);
        }
      } catch (error) {
        console.error("Error fetching hypercert details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHypercert();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-teal-600 text-xl font-medium">Loading hypercert details...</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        paddingTop: context?.client.safeAreaInsets?.top ?? 30, 
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
      className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-8 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-teal-100">
          <div className="md:flex">
            <div className="md:w-1/2 relative">
              {hypercert?.metadata?.image ? (
                <img
                  src={hypercert.metadata.image}
                  alt={hypercert.metadata.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-teal-200 to-cyan-200 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">Hypercert Image</span>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                <span className="text-teal-700 font-medium text-sm">Hypercert</span>
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-600">
                  {hypercert?.metadata?.name || "Hypercert Title"}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                    ID: {hypercert?.hypercert_id ? `${hypercert.hypercert_id.substring(0, 4)}...${hypercert.hypercert_id.substring(hypercert.hypercert_id.length - 4)}` : id || "Unknown"}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                    Verified
                  </span>
                </div>
                <p className="text-gray-600 text-lg">
                  {hypercert?.metadata?.description || "This hypercert represents a unique contribution to a public good. Own a fraction to support the creator and their work."}
                </p>
              </div>
              
              {hypercert?.metadata?.work_scope && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Work Scope</h2>
                  <p className="text-gray-600">{hypercert.metadata.work_scope}</p>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Purchase Fractions</h2>
                <div className="bg-teal-50 rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-700 font-medium">Price per fraction:</div>
                    <div className="font-bold text-teal-700">
                      {hypercert?.orders?.data && hypercert.orders.data.length > 0
                        ? `${hypercert.orders.data[0].pricePerPercentInToken} CELO ($${hypercert.orders.data[0].pricePerPercentInUSD})`
                        : "Not for sale"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-gray-700 font-medium">Available fractions:</div>
                    <div className="font-bold text-teal-700">
                      {hypercert?.orders?.totalUnitsForSale 
                        ? `${hypercert.orders.totalUnitsForSale}/${hypercert.units}` 
                        : `0/${hypercert?.units || 0}`}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    mounted,
                  }) => {
                    const ready = mounted;
                    const connected = ready && account && chain;

                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                          style: {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                        className="w-full"
                      >
                        {(() => {
                          if (!connected) {
                            return (
                              <button
                                onClick={openConnectModal}
                                className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium rounded-xl shadow-sm hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                              >
                                Connect Wallet
                              </button>
                            );
                          }

                          if (chain.unsupported) {
                            return (
                              <button
                                onClick={openChainModal}
                                className="w-full py-3 bg-red-500 text-white font-medium rounded-xl shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                              >
                                Switch to Celo
                              </button>
                            );
                          }

                          return (
                            <div className="flex flex-col space-y-3">
                              <button
                                onClick={openAccountModal}
                                className="flex items-center justify-center space-x-2 w-full py-3 bg-teal-100 text-teal-800 font-medium rounded-xl hover:bg-teal-200 transition-all duration-200"
                              >
                                <span>{account.displayName}</span>
                                <span>{account.displayBalance ? ` (${account.displayBalance})` : ''}</span>
                              </button>
                              
                              <button 
                                className={`w-full py-3 font-medium rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 ${
                                  hypercert?.orders?.totalUnitsForSale 
                                    ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700" 
                                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                }`}
                                disabled={!hypercert?.orders?.totalUnitsForSale}
                              >
                                {hypercert?.orders?.totalUnitsForSale ? "Buy Fractions" : "Not Available"}
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
                
                <a 
                  href="/"
                  className="text-center py-3 text-teal-600 hover:text-teal-800 font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Marketplace
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
