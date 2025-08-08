import Head from 'next/head'
import { useRouter } from 'next/router'
// import Image from 'next/image'
import { Geist, Geist_Mono } from 'next/font/google'
import { useEffect, useState } from 'react'

import { api } from '@shared/api/api'
import useSession from '@shared/lib/hooks/useSession'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function Home() {
  const [data, setData] = useState<{ _id: string; message: string }[] | null>(null)
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session.isAuthorized) {
      router.push('/login')
    } else {
      api
        .get('/about')
        .then((res) => res.data)
        .then((d) => {
          if (d?.length) {
            setData(d)
          }
        })
        .catch((error) => {})
    }
  }, [])

  if (!session.isAuthorized) {
    return null
  }

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
      <p>Host: {process.env.NEXT_PUBLIC_HOST}</p>

      {!data ? (
        <div>Nothing to say</div>
      ) : (
        <div>
          <ul>
            {data.map(({ _id, message }) => (
              <li key={_id}>{message}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
