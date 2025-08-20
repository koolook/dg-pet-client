import useSession from '@shared/lib/hooks/useSession'
import { Article } from '@shared/models/Article'
import { useRouter } from 'next/router'
import { Button, Card } from 'react-bootstrap'

export interface NewsCardProps {
  isPreview: boolean
  item: Partial<Article>
  onDelete?: (id: string) => void
}

export const NewsCard: React.FC<NewsCardProps> = ({ item, isPreview = true, onDelete }) => {
  const session = useSession()
  const router = useRouter()

  const canEditThis = !isPreview && session.canEdit && item?.author === session.user.login

  const footerClass = `d-flex flex-row justify-content-${canEditThis ? 'between' : 'end'}`

  const title = item.title + (item.isPublished ? '' : ' (draft)')
  return (
    <Card>
      {item.imageUrl && (
        <Card.Img variant="top" src={process.env.NEXT_PUBLIC_HOST_API + item.imageUrl} />
      )}
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{item.content}</Card.Text>
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
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => {
                  if (onDelete && item.id) onDelete(item.id)
                }}
              >
                Delete
              </Button>
              <Button size="sm" variant="outline-primary">
                Publish
              </Button>
            </div>
          )}
          <div className="d-flex flex-row gap-2">
            <div>{item.dateCreated?.toLocaleString()}</div>
            <div>{'by: ' + item.author}</div>
          </div>
        </div>
      </Card.Footer>
    </Card>
  )
}
