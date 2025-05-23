"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import sdk, { type Context } from "@farcaster/frame-sdk";
import Link from "next/link";
import { BuyOrderDialog } from "~/components/buy-order-dialog";
import { OrderFragment } from "~/lib/order.fragment";
import { HypercertFull } from "~/lib/hypercert-full.fragment";
import { useToast } from "~/hooks/use-toast";
import { getHypercert } from "~/lib/getHypercert";
import { useStore } from "~/lib/account-store";

export default function HypercertDetails() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emitError = useStore((state: any) => state.error);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emitHash = useStore((state: any) => state.hash);
  const { toast } = useToast();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [hypercert, setHypercert] = useState<HypercertFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeOrderNonce, setActiveOrderNonce] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isProcessing = hypercert?.orders?.data?.length
    ? hypercert?.orders?.data?.[0]?.orderNonce === activeOrderNonce
    : false;
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
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
    if (emitError) {
      setErrorMessage(
        emitError instanceof Error ? emitError.message : String(emitError)
      );
    }
  }, [emitError]);

  useEffect(() => {
    if (emitHash) {
      setTransactionHash(emitHash);
    }
  }, [emitHash]);

  useEffect(() => {
    const fetchHypercert = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const hypercert = await getHypercert(id);
        setHypercert(hypercert as HypercertFull);
      } catch (error) {
        console.error("Error fetching hypercert details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHypercert();
  }, [id]);

  const handleBuyOrder = useCallback(
    (orderNonce: string) => {
      setActiveOrderNonce(orderNonce);
      toast({
        title: "Transaction in progress",
        description: "Your buy order is being processed.",
      });
    },
    [toast]
  );

  const handleBuyOrderComplete = useCallback(() => {
    setActiveOrderNonce(null);
    setShowSuccessModal(true);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-teal-600 text-xl font-medium">
            Loading hypercert details...
          </div>
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
      className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-4 px-2 sm:py-8 sm:px-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-teal-100">
          <div className="flex flex-col md:flex-row items-start h-full">
            {/* Image Section */}
            <div className="w-full md:w-1/2 relative flex-shrink-0">
              {hypercert?.metadata?.image ? (
                <img
                  src={hypercert.metadata.image}
                  alt={hypercert.metadata.name || ""}
                  className="w-full h-64 md:h-full object-contain bg-gradient-to-br from-teal-50 to-cyan-50"
                />
              ) : (
                <div className="w-full h-64 md:h-full min-h-[200px] bg-gradient-to-br from-teal-200 to-cyan-200 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    Hypercert Image
                  </span>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                <span className="text-teal-700 font-medium text-sm">Celo</span>
              </div>
            </div>
            {/* Details Section */}
            <div className="w-full md:w-1/2 p-4 sm:p-8 max-h-[90vh] overflow-y-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-600">
                  {hypercert?.metadata?.name || "Hypercert Title"}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                    ID:{" "}
                    {hypercert?.hypercert_id
                      ? `${hypercert.hypercert_id.substring(
                          0,
                          4
                        )}...${hypercert.hypercert_id.substring(
                          hypercert.hypercert_id.length - 4
                        )}`
                      : id || "Unknown"}
                  </span>
                </div>
                <p className="text-gray-600 text-md">
                  {hypercert?.metadata?.description ||
                    "This hypercert represents a unique contribution to a public good. Own a fraction to support the creator and their work."}
                </p>
              </div>

              {hypercert?.metadata?.work_scope && (
                <div className="mb-6">
                  <h2 className="text-md font-semibold text-gray-800 mb-2">
                    Work Scope
                  </h2>
                  <p className="text-gray-600">
                    {typeof hypercert.metadata.work_scope === "string"
                      ? (hypercert.metadata.work_scope as string)
                          .split(",")
                          .slice(0, 3)
                          .join(", ")
                      : Array.isArray(hypercert.metadata.work_scope)
                      ? (hypercert.metadata.work_scope as string[])
                          .slice(0, 3)
                          .join(", ")
                      : hypercert.metadata.work_scope}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-md font-semibold text-gray-800 mb-4">
                  Purchase Fractions
                </h2>
                <div className="bg-teal-50 rounded-2xl p-4 mb-6">
                  <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="text-gray-700 font-medium">
                      Price per unit (CELO):
                    </div>
                    <div className="font-bold text-teal-700">
                      {hypercert?.orders?.data && hypercert.orders.data.length > 0
                        ? `${Number(
                            hypercert.orders.data[0].pricePerPercentInToken
                          ).toFixed(2)} CELO`
                        : "Not for sale"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="text-gray-700 font-medium">
                      Price per unit (USD):
                    </div>
                    <div className="font-bold text-teal-700">
                      {hypercert?.orders?.data && hypercert.orders.data.length > 0
                        ? `$${Number(
                            hypercert.orders.data[0].pricePerPercentInUSD
                          ).toFixed(2)}`
                        : "Not for sale"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="text-gray-700 font-medium">
                      Min unit per order:
                    </div>
                    <div className="font-bold text-teal-700">
                      {hypercert?.orders?.cheapestOrder
                        ? `${hypercert.orders.cheapestOrder.amounts}`
                        : "Not for sale"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-gray-700 font-medium">
                      Available fractions:
                    </div>
                    <div className="font-bold text-teal-700">
                      {hypercert?.orders?.totalUnitsForSale
                        ? `${hypercert.orders.totalUnitsForSale}/${hypercert.units}`
                        : `0/${hypercert?.units || 0}`}
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
                            "aria-hidden": true,
                            style: {
                              opacity: 0,
                              pointerEvents: "none",
                              userSelect: "none",
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
                                  <span>
                                    {account.displayBalance
                                      ? ` (${account.displayBalance})`
                                      : ""}
                                  </span>
                                </button>
                                <BuyOrderDialog
                                  order={
                                    (hypercert?.orders?.data?.[0] as OrderFragment) ||
                                    []
                                  }
                                  hypercert={hypercert as HypercertFull}
                                  isProcessing={isProcessing && !errorMessage}
                                  onBuyOrder={handleBuyOrder}
                                  onComplete={handleBuyOrderComplete}
                                  trigger={
                                    <button
                                      className={`w-full py-3 font-medium rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 ${
                                        hypercert?.orders?.totalUnitsForSale
                                          ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700"
                                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                      }`}
                                      disabled={!hypercert?.orders?.totalUnitsForSale}
                                    >
                                      {isProcessing && !errorMessage ? (
                                        <div className="flex items-center justify-center">
                                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                          Processing...
                                        </div>
                                      ) : hypercert?.orders?.totalUnitsForSale ? (
                                        "Buy Fractions"
                                      ) : (
                                        "Not Available"
                                      )}
                                    </button>
                                  }
                                />
                              </div>
                            );
                          })()}
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>

                  <Link
                    href="/"
                    className="text-center py-3 text-teal-600 hover:text-teal-800 font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Back to Marketplace
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Transaction Complete
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center text-green-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Purchase successful!</span>
              </div>

              <div className="mt-4 text-sm">
                <a
                  href={`https://celo.blockscout.com/tx/${
                    transactionHash || emitHash || ""
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center text-green-600 hover:text-green-800 font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  View on Celo Explorer
                </a>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/"
                className="text-center py-3 text-teal-600 hover:text-teal-800 font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to Marketplace
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {/* {errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setErrorMessage(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-xl font-bold text-gray-900 mb-4">Error</h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center text-red-700">
                <span className="font-medium">{errorMessage}</span>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}