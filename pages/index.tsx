import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>RainbowKit App</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className="min-h-screen flex flex-1 flex-col justify-center items-center">
        <ConnectButton />
      </main>
    </div>
  )
}

export default Home
