import { useRouter } from 'next/router'
import { Button, Card } from 'react-bootstrap'

import useSession from '@shared/lib/hooks/useSession'
import { Article } from '@shared/models/Article'
import { MyQuillReader } from '@shared/ui/MyQuillReader'

export interface NewsCardProps {
  isPreview: boolean
  item: Partial<Article>
}

export const NewsCard: React.FC<NewsCardProps> = ({ item, isPreview = true }) => {
  const session = useSession()
  const router = useRouter()

  const canEditThis = !isPreview && session.canEdit && item?.author === session.user.login

  const footerClass = `d-flex flex-row justify-content-${canEditThis ? 'between' : 'end'}`

  const title =
    item.title +
    (item.isPublished
      ? ''
      : item.publishAt
        ? ` (draft until ${item.publishAt.toLocaleString()})`
        : ' (draft)')
  return (
    <Card>
      {item.imageUrl && (
        <Card.Img variant="top" src={process.env.NEXT_PUBLIC_HOST_API + item.imageUrl} />
      )}
      <Card.Body>
        <Card.Title as="h3">{title}</Card.Title>
        <MyQuillReader text={item.content || ''} />
      </Card.Body>
      <Card.Footer>
        <div className={footerClass}>
          {canEditThis && (
            <div className="d-flex flex-row gap-2">
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => router.push(`/article/${item.id}`)}
              >
                Edit
              </Button>
            </div>
          )}
          <div className="d-flex flex-row gap-2">
            <div>{item.createdAt?.toLocaleString()}</div>
            <div>{'by: ' + item.author}</div>
          </div>
        </div>
      </Card.Footer>
    </Card>
  )
}
