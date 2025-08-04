import Head from 'next/head'
// import Image from 'next/image'
import { Geist, Geist_Mono } from 'next/font/google'
// import styles from '@styles/Home.module.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function Home() {
  return (
    <>
      <Head>
        <title>Pet Client</title>
        <meta name="description" content="Next.js learning project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Pet Client</h1>
      {/* <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
      </div> */}
      <p>
        Host: {process.env.NEXT_PUBLIC_HOST}
      </p>
    </>
  )
}
