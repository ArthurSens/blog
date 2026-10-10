import { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import "../styles/index.css";
import { MotionProvider } from "../components/motion";

import { ThemeProvider } from "../components/theme";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider>
        <MotionProvider>
          <Component {...pageProps} />
        </MotionProvider>
      </ThemeProvider>
      <Analytics />
    </>
  );
}
