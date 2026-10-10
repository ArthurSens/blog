import { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import "../styles/index.css";
import { MotionProvider } from "../components/motion";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <MotionProvider>
        <Component {...pageProps} />
      </MotionProvider>
      <Analytics />
    </>
  );
}
