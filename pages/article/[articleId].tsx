import { useEffect } from 'react'

import useSession from '@shared/lib/hooks/useSession'
import { Layout } from '@widgets/Layout/Layout'
import { useRouter } from 'next/router'
import { ArticleEditor } from './ui/ArticleEditor'

const Article = () => {
  const session = useSession()
  const router = useRouter()

  const { articleId } = router.query

  useEffect(() => {
    if (!session.isAuthorized && session.isAuthDone) {
      router.push('/')
    }
  }, [session.isAuthorized, session.isAuthDone])

  if (!session.isAuthorized) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <Layout.Header canCreate={false} />
      <Layout.Content>
        <ArticleEditor item={{ title: 'Fake', content: 'Fake' }} />
      </Layout.Content>
    </Layout>
  )
}

export default Article
