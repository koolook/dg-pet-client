import useContentData from '@shared/lib/hooks/useContentData'
import { NewsCard } from '@widgets/NewsCard'
import { Spinner } from 'react-bootstrap'

export const Feed = () => {
  const feedData = useContentData()

  return feedData.dataLoading ? (
    <div className="d-flex justify-content-center align-items-center">
      <Spinner animation="border" />
    </div>
  ) : (
    <>
      <ul className="list-unstyled">
        {feedData.data.map((article) => (
          <li className="p-2" key={article.id}>
            <NewsCard item={article} isPreview={false} />
          </li>
        ))}
      </ul>
    </>
  )
}
