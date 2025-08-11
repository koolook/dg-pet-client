import React, { ReactNode } from 'react'
import { Header } from '../Header'
import { Content, ContentProps } from '../Content'
import Head from 'next/head'

export type LayoutProps = {
  title?: string
  children?: ReactNode
}

export const Layout: React.FC<LayoutProps> & {
  Header: React.FC
  Content: React.FC<ContentProps>
} = ({ title = 'Pet-Client', children }) => {
  return (
    <>
      <Head>
        <title>{title || ''}</title>
      </Head>
      <div className="layout-container bg-secondary">{children}</div>
    </>
  )
}

Layout.Header = Header
Layout.Content = Content
