import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { Layout } from '@widgets/Layout/Layout'

import useContentData from '@shared/lib/hooks/useContentData'
import useSession from '@shared/lib/hooks/useSession'

import ArticleEditor from './ui/ArticleEditor'

const Article = () => {
  const session = useSession()
  const router = useRouter()
  const feedData = useContentData()

  const { articleId } = router.query

  const id = articleId && Array.isArray(articleId) ? articleId[0] : articleId || ''

  // TODO:
  // - get Article data by this id after data is loaded and submit
  // the article object to <ArticleEditor>
  // - implement get/search by id in useContentData()

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
        <ArticleEditor article={feedData.get(id)} />
      </Layout.Content>
    </Layout>
  )
}

export default Article
