/* eslint-disable @next/next/no-img-element */
"use client";
import Link from 'next/link';
import { useEffect, useState } from "react";
import sdk, { type Context } from "@farcaster/frame-sdk";
import { getHypercerts, searchHypercerts } from "~/lib/graphqlQueries";
// import { useAccount, useChainId } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface Hypercert {
  id: string;
  name: string;
  image: string;
  description: string;
  units: number;
}

export default function Hypercerts() {
  // const { isConnected, address } = useAccount();
  // const chainId = useChainId();
  const [hypercerts, setHypercerts] = useState<Hypercert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext | undefined>(undefined); // Added undefined to type
  const appUrl = process.env.NEXT_PUBLIC_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [search_id] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  // const { client } = useHypercertClient();


  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
      // console.log("Farcaster SDK ready");
      sdk.actions.ready({});
    };

    if (sdk && !isSDKLoaded) {
      // console.log("Loading Farcaster SDK");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  // Initial data fetch when component mounts
  useEffect(() => {
    if (isSDKLoaded) {
      fetchHypercerts(1);
    }
  }, [isSDKLoaded]);

  useEffect(() => {
    if (currentPage > 1) {
      if (isSearching && searchTerm) {
        searchHypercertsByTerm(searchTerm, search_id, currentPage);
      } else {
        fetchHypercerts(currentPage);
      }
    }
  }, [currentPage]);

  const fetchHypercerts = async (page = currentPage) => {
    try {
      setLoading(true);
      const offset = (page - 1) * itemsPerPage;
      const response = await getHypercerts(itemsPerPage, offset);
      
      if (response && response.data && Array.isArray(response.data)) {
        const formattedHypercerts = response.data.map((cert: { hypercert_id: string; metadata: { name: string; image: string; description: string; }; units: number; }) => ({
          id: cert.hypercert_id,
          name: cert.metadata.name,
          image: cert.metadata.image,
          description: cert.metadata.description,
          units: cert.units
        }));
        setHypercerts(formattedHypercerts);
        setTotalCount(response.count);
      } else {
        console.error("Invalid response format:", response);
        setHypercerts([]);
      }
    } catch (error) {
      console.error("Error fetching hypercerts:", error);
      setHypercerts([]);
    } finally {
      setLoading(false);
    }
  };

  const searchHypercertsByTerm = async (term: string, id: string, page = currentPage) => {
    try {
      setLoading(true);
      const offset = (page - 1) * itemsPerPage;
      const response = await searchHypercerts(term, id, itemsPerPage, offset);
      
      if (response && response.data && Array.isArray(response.data)) {
        const formattedHypercerts = response.data.map((cert: { hypercert_id: string; metadata: { name: string; image: string; description: string; }; units: number; }) => ({
          id: cert.hypercert_id,
          name: cert.metadata.name,
          image: cert.metadata.image,
          description: cert.metadata.description,
          units: cert.units
        }));
        setHypercerts(formattedHypercerts);
        setTotalCount(response.count);
      } else {
        console.error("Invalid search response format:", response);
        setHypercerts([]);
      }
    } catch (error) {
      console.error("Error searching hypercerts:", error);
      setHypercerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    
    const trimmedSearchTerm = searchTerm.trim();
    
    if (trimmedSearchTerm) {
      setIsSearching(true);
      
      // Check if search term is likely an ID (starts with 0x, contains only numbers, or is alphanumeric)
      const isLikelyId = 
        /^\d/.test(trimmedSearchTerm) || 
        trimmedSearchTerm.includes('0x') || 
        /^[a-zA-Z0-9]+$/.test(trimmedSearchTerm);
      
      if (isLikelyId) {
        // Search by ID
        searchHypercertsByTerm('', trimmedSearchTerm, 1);
      } else {
        // Search by name
        searchHypercertsByTerm(trimmedSearchTerm, '', 1);
      }
    } else {
      setIsSearching(false);
      fetchHypercerts(1);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    setCurrentPage(1);
    fetchHypercerts(1);
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!isSDKLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="text-teal-600 text-xl font-medium">Loading Farcaster SDK...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      paddingTop: context?.client.safeAreaInsets?.top ?? 0, 
      paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
      paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
      paddingRight: context?.client.safeAreaInsets?.right ?? 0,
    }}>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-8 px-4 sm:px-6 mx-auto">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <img alt="Celo Logo" src={`${appUrl}/Celo_Wordmark_RGB_Onyx.svg`} className="w-24 mx-auto block mb-4" />
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-600">
                Hypercerts Marketplace
              </span>
            </h1>
            <p className="mx-auto text-sm text-gray-600 mb-4">
              Discover and invest in impact projects on Celo
            </p>
            <div className="mb-6 flex justify-center">
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
                              </div>
                            );
                          })()}
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
            </div>
          </div>

          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or id"
                className="flex-1 px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium rounded-lg shadow-sm hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
              >
                Search
              </button>
              {isSearching && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
                >
                  Clear
                </button>
              )}
            </form>
            {isSearching && (
              <div className="mt-2 text-sm text-gray-600">
                Showing results for &quot;{searchTerm}&quot; ({totalCount} found)
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 bg-white rounded-xl shadow-md border border-teal-100">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-teal-600 text-xl font-medium">Loading hypercerts...</div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {hypercerts.map((cert) => (
                <Link href={`/hypercert_details?id=${cert.id}`} key={cert.id} className="group block">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-teal-100 p-4">
                    <div className="flex">
                      <div className="w-1/3 h-32 overflow-hidden relative">
                        <img
                          src={cert.image}
                          alt={cert.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
                          <span className="text-teal-700 font-medium text-xs">Hypercert</span>
                        </div> */}
                      </div>
                      <div className="w-2/3 p-2">
                        <h2 className="text-lg font-bold text-gray-800 mb-1">{cert.name}</h2>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{cert.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                            ID: {cert.id.substring(0, 4)}...{cert.id.substring(cert.id.length - 4)}
                          </span>
                          <button className="px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-xs font-medium rounded-lg shadow-sm hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors duration-200">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {hypercerts.length === 0 && !loading && (
                <div className="text-center py-12 bg-white rounded-xl shadow-md border border-teal-100">
                  <div className="flex flex-col items-center justify-center p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-teal-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13a4 4 0 100-8 4 4 0 000 8z" />
                    </svg>
                    <div className="text-xl font-medium text-gray-700 mb-2">
                      {isSearching ? "No results found" : "No hypercerts available"}
                    </div>
                    <p className="text-gray-500 text-sm">
                      {isSearching ? (
                        <button 
                          onClick={clearSearch}
                          className="text-teal-600 hover:text-teal-800 underline"
                        >
                          Clear search and show all hypercerts
                        </button>
                      ) : (
                        "Check back soon for new impact projects"
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {hypercerts.length > 0 && !loading && (
            <div className="flex justify-between items-center mt-6">
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg shadow-sm transition-all duration-200 ${
                  currentPage === 1 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700'
                }`}
              >
                Previous
              </button>
              
              <div className="text-gray-700">
                Page {currentPage} of {Math.ceil(totalCount / itemsPerPage)}
              </div>
              
              <button 
                onClick={handleNextPage}
                disabled={currentPage >= Math.ceil(totalCount / itemsPerPage)}
                className={`px-4 py-2 rounded-lg shadow-sm transition-all duration-200 ${
                  currentPage >= Math.ceil(totalCount / itemsPerPage)
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
