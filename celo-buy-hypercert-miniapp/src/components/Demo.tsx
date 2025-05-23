/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState} from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import sdk, {
  type Context,
} from "@farcaster/frame-sdk";
import { createStore } from 'mipd'
import UserSearch from "./farcaster/SearchUser";

export default function TipMeTemplate(
  { title }: { title?: string } = { title: "Buy Hypercert" }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const appUrl = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);   
      console.log("Calling ready");
      sdk.actions.ready({});

// Set up a MIPD Store, and request Providers.
const store = createStore()

// Subscribe to the MIPD Store.
store.subscribe(providerDetails => {
  console.log("PROVIDER DETAILS", providerDetails)
  // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
})

    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ 
      paddingTop: context?.client.safeAreaInsets?.top ?? 0, 
      paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
      paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
      paddingRight: context?.client.safeAreaInsets?.right ?? 0 ,
    }}>
         <div className="max-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto py-6 px-4 bg-card rounded-xl shadow-sm border border-border">
        <img alt="Buy Hypercert Logo" src={`${appUrl}/Celo_Wordmark_RGB_Onyx.svg`} className="w-24 mx-auto block  mt-6" />
        <h1 className="text-3xl font-bold text-center mb-6  text-black">{title}</h1>
        <div>
          <div className="mb-6 flex flex-col justify-center items-center gap-4">
            <ConnectButton />
            <UserSearch />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}