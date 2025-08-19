import { Article } from '@shared/models/Article'
import { Button, Card } from 'react-bootstrap'

export interface NewsCardProps {
  isPreview: boolean
  item: Article
}

export const NewsCard: React.FC<NewsCardProps> = ({ item, isPreview = true }) => {
  const title = item.title + (item.isPublished ? '' : ' (draft)')
  return (
    <Card>
      {item.imageUrl && <Card.Img variant="top" src={item.imageUrl} />}
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{item.content}</Card.Text>
        {/* {!isPreview && (
          <div className="row">
            <Button className="col-md-2" variant="info">
              Edit
            </Button>
            <Button className="col-md-2 mx-2" variant="info">
              Publish
            </Button>
          </div>
        )} */}
      </Card.Body>
      <Card.Footer>
        <div className="d-flex flex-row justify-content-between">
          <div>{item.dateCreated?.toLocaleString()}</div>
          <div>{'by: ' + item.author}</div>
        </div>
      </Card.Footer>
    </Card>
  )
}
