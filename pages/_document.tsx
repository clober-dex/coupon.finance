import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          content="Lending, Fixed. Flexible fixed-rate lending protocol enabled by fully on-chain order books."
          name="description"
        />
        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://www.coupon.finance/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Coupon Finance" />
        <meta
          property="og:description"
          content="Lending, Fixed. Flexible fixed-rate lending enabled by fully on-chain order books."
        />
        <meta
          property="og:image"
          content="https://www.coupon.finance/card.png"
        />
        {/* <!-- Twitter Meta Tags --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content="@CouponFinance" />
        <meta property="twitter:title" content="Coupon Finance" />
        <meta
          property="twitter:description"
          content="Lending, Fixed. Flexible fixed-rate lending enabled by fully on-chain order books."
        />
        <meta
          property="twitter:image"
          content="https://www.coupon.finance/card.png"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-G5SW71X108"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-G5SW71X108');
        `}
        </Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
