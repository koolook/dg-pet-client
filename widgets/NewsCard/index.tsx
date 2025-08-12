import { Button, Card } from 'react-bootstrap'

export type NewsStatus = 'pending' | 'published'
export interface NewsItem {
  id?: string | null
  author?: string
  dateCreated?: Date
  datePublished?: Date
  title: string
  content: string
  imageUrl?: string
}

export interface NewsCardProps {
  isPreview: boolean
  item: NewsItem
}

export const NewsCard: React.FC<NewsCardProps> = ({ item, isPreview = true }) => {
  return (
    <Card>
      {item.imageUrl && <Card.Img variant="top" src={item.imageUrl} />}
      <Card.Body>
        <Card.Title>{item.title}</Card.Title>
        <Card.Text>{item.content}</Card.Text>
        {!isPreview && (
          <div className="row">
            <Button className="col-md-2" variant="info">
              Edit
            </Button>
            <Button className="col-md-2 mx-2" variant="info">
              Publish
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}
