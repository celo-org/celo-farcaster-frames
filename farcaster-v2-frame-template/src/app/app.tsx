"use client";

import dynamic from "next/dynamic";

// const Demo = dynamic(() => import("~/components/Demo"), {
//   ssr: false,
// });
const Hypercerts = dynamic(() => import("~/components/Hypercerts"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title: "buy a fraction of a hypercert on Celo" }
) {
  return (<Hypercerts />);
}
