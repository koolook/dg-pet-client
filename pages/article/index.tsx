import { useRouter } from 'next/router'
import { useEffect } from 'react'

import Author from '@widgets/Author'
import { Layout } from '@widgets/Layout/Layout'

import useSession from '@shared/lib/hooks/useSession'

import { ArticleEditor } from './ui/ArticleEditor'

const Article = () => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if ((!session.isAuthorized && session.isAuthDone) || !session.canEdit) {
      router.push('/')
    }
  }, [router, session.isAuthorized, session.isAuthDone, session.canEdit])

  if (!session.isAuthorized) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <Layout.Header canCreate={false} />
      <Layout.Content>
        <Author>
          <ArticleEditor />
        </Author>
      </Layout.Content>
    </Layout>
  )
}

export default Article
