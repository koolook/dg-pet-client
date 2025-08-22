import Head from 'next/head'
import React, { ReactNode } from 'react'

import { Content, ContentProps } from '../Content'
import { Header, HeaderOptions } from '../Header'

import styles from './layout.module.scss'

export type LayoutProps = {
  title?: string
  children?: ReactNode
}

export const Layout: React.FC<LayoutProps> & {
  Header: React.FC<HeaderOptions>
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
