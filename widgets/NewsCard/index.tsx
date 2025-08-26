import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button, Card, CardTitle } from 'react-bootstrap'

import useContentData from '@shared/lib/hooks/useContentData'
import useSession from '@shared/lib/hooks/useSession'
import { Article } from '@shared/models/Article'
import { Attachment } from '@shared/models/Attachment'
import { MyQuillReader } from '@shared/ui/MyQuillReader'

export interface NewsCardProps {
  isPreview: boolean
  item: Partial<Article>
}

export const NewsCard: React.FC<NewsCardProps> = ({ item, isPreview = true }) => {
  const session = useSession()
  const router = useRouter()
  const contentData = useContentData()

  const [quoteTrigger, setQuoteTrigger] = useState(0)

  const handleOnQuote = (quoteHtml: string) => {
    console.log(quoteHtml)
    console.log(quoteTrigger)
    if (item?.id) {
      contentData.addQuote({
        articleId: item.id,
        quoteHtml,
      })
    }
  }

  const canEditThis = !isPreview && session.canEdit && item?.author === session.user.login
  const canQuoteThis = !isPreview && session.canEdit

  const footerClass = `d-flex flex-row justify-content-${canEditThis || canQuoteThis ? 'between' : 'end'}`

  const title =
    item.title +
    (item.isPublished
      ? ''
      : item.publishAt
        ? ` (draft until ${item.publishAt.toLocaleString()})`
        : ' (draft)')

  const handlePreview = (a: Attachment) => {
    window.open(a.path)
  }

  return (
    <Card>
      {item.imageUrl && (
        <div className="col-8 col-md-4 my-3  mx-auto">
          <Card.Img variant="top" src={item.imageUrl} />
        </div>
      )}
      <Card.Body>
        <Card.Title as="h3">{title}</Card.Title>
        <MyQuillReader
          text={item.content || ''}
          quoteTrigger={quoteTrigger}
          onQuote={handleOnQuote}
        />
      </Card.Body>
      {item.attachments && item.attachments.length > 0 && (
        <>
          <Card.Body className="d-flex flex-column">
            <div>Attachments:</div>
            {item.attachments?.map((a) => (
              <a
                href="#"
                key={a.id}
                onClick={(e) => {
                  e.preventDefault()
                  handlePreview(a)
                }}
              >
                {a.name}
              </a>
            ))}
          </Card.Body>
        </>
      )}
      <Card.Footer>
        <div className={footerClass}>
          <div className="d-flex flex-row gap-2">
            {canEditThis && (
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => router.push(`/article/${item.id}`)}
              >
                Edit
              </Button>
            )}
            {canQuoteThis && (
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => setQuoteTrigger(quoteTrigger + 1)}
              >
                Add quote...
              </Button>
            )}
          </div>
          <div className="d-flex flex-row gap-2">
            <div>{item.createdAt?.toLocaleString()}</div>
            <div>{'by: ' + item.author}</div>
          </div>
        </div>
      </Card.Footer>
    </Card>
  )
}
