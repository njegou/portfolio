"use client";
import dynamic from "next/dynamic";
import Preloader from "./Preloader";
import Nav from "./Nav";
import SmoothScroll from "./SmoothScroll";

// Curseur et easter egg : inutiles au SSR, chargés après coup.
const Cursor = dynamic(() => import("./Cursor"), { ssr: false });
const Konami = dynamic(() => import("./Konami"), { ssr: false });

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <Preloader />
      <div className="nav-grid fixed inset-0 -z-10" aria-hidden />
      <div className="grain" aria-hidden />
      <Nav />
      {children}
      <Cursor />
      <Konami />
    </SmoothScroll>
  );
}
