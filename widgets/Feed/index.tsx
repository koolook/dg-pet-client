import useContentData from '@shared/lib/hooks/useContentData'
import { NewsCard } from '@widgets/NewsCard'
import { useState } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'

export const Feed = () => {
  const feedData = useContentData()

  const [showOnDeleteModal, setShowOnDeleteModal] = useState(false)
  const [articleId, setArticleId] = useState('')

  const onDelete = (id: string) => {
    if (id) {
      setArticleId(id)
      setShowOnDeleteModal(true)
    }
  }

  const handleClose = () => {
    setArticleId('')
    setShowOnDeleteModal(false)
  }

  const onConfirmDelete = () => {
    if (articleId) {
      feedData
        .deleteById(articleId)
        .catch((error) => {
          console.log('`Error deleting article: ' + error.message)
        })
        .finally(() => {
          handleClose()
        })
    }
  }

  return feedData.dataLoading ? (
    <div className="d-flex justify-content-center align-items-center">
      <Spinner animation="border" />
    </div>
  ) : (
    <>
      <ul className="list-unstyled">
        {feedData.data.map((article) => (
          <li className="p-2" key={article.id}>
            <NewsCard item={article} isPreview={false} onDelete={onDelete} />
          </li>
        ))}
      </ul>
      <Modal show={showOnDeleteModal} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to delete this article?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="primary" onClick={onConfirmDelete}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
