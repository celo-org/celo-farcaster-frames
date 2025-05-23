"use client";

import dynamic from "next/dynamic";

const Hypercerts = dynamic(() => import("~/components/Hypercerts"), {
  ssr: false,
});

export default function App(
) {
  return (<Hypercerts />);
}
