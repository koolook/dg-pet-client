import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Spinner } from 'react-bootstrap'

import { NewsCard } from '@widgets/NewsCard'

import useContentData from '@shared/lib/hooks/useContentData'

export const Feed = () => {
  const feedData = useContentData()
  const router = useRouter()

  useEffect(() => {
    if (router.asPath.includes('#')) {
      const hash = router.asPath.split('#')[1]
      const element = document.getElementById(hash)

      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [router.asPath])

  return feedData.dataLoading ? (
    <div className="d-flex justify-content-center align-items-center">
      <Spinner animation="border" />
    </div>
  ) : (
    <>
      <ul className="list-unstyled">
        {feedData.data.map((article) => (
          <li className="p-2" key={article.id} id={article.id}>
            {/* <a href={'#' + article.id}></a> */}
            <NewsCard item={article} isPreview={false} />
          </li>
        ))}
      </ul>
    </>
  )
}
