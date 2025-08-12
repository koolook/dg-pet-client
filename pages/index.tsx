import Head from 'next/head'
import { useRouter } from 'next/router'
// import Image from 'next/image'
import { Geist, Geist_Mono } from 'next/font/google'
import { useEffect, useState } from 'react'

import { api } from '@shared/api/api'
import useSession from '@shared/lib/hooks/useSession'
import { Button, Spinner } from 'react-bootstrap'
import { Layout } from '@widgets/Layout/Layout'
import { Feed } from '@widgets/Feed'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function Home() {
  const session = useSession()
  const router = useRouter()

  return (
    <>
      <Layout>
        <Layout.Header canCreate={true} />
        <Layout.Content>
          {/* <Spinner animation="border" /> */}
          <Feed />
        </Layout.Content>
      </Layout>
    </>
  )
}
