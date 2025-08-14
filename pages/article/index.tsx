import { useEffect } from 'react'

import useSession from '@shared/lib/hooks/useSession'
import { Layout } from '@widgets/Layout/Layout'
import { useRouter } from 'next/router'
import { ArticleEditor } from './ui/ArticleEditor'
import Author from '@widgets/Author'

const Article = () => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if ((!session.isAuthorized && session.isAuthDone) || !session.canEdit) {
      router.push('/')
    }
  }, [session.isAuthorized, session.isAuthDone, session.canEdit])

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
