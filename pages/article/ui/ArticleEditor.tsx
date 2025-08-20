import useContentData from '@shared/lib/hooks/useContentData'
import { Article } from '@shared/models/Article'
import { NewsCard } from '@widgets/NewsCard'
import { useRouter } from 'next/router'
import React, { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { Alert, Button, Form, Modal, Tab, Tabs } from 'react-bootstrap'

export interface ArticleEditorProps {
  article?: Article
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({ article }) => {
  const isEditMode = !!article

  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('edit')
  const [previewUrl, setPreviewUrl] = useState(
    isEditMode && article.imageUrl ? process.env.NEXT_PUBLIC_HOST_API + article.imageUrl : ''
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pictureChosen, setPictureChosen] = useState(false)
  const [showOnDeleteModal, setShowOnDeleteModal] = useState(false)

  // Form data
  const [titleText, setTitleText] = useState(article?.title || '')
  const [bodyText, setBodyText] = useState(article?.content || '')
  const [isPublishNow, setIsPublishNow] = useState(!!article && article.isPublished)

  const router = useRouter()
  const feedData = useContentData()

  const clearForm = () => {
    setTitleText('')
    setBodyText('')
    setIsPublishNow(true)
  }

  const handleClose = () => {
    setShowOnDeleteModal(false)
  }

  const onConfirmDelete = () => {
    setPending(true)
    if (article?.id) {
      feedData
        .deleteById(article.id)
        .then(() => {
          router.push('/')
        })
        .catch((error) => {
          setError('`Error deleting article: ' + error.message)
          handleClose()
          setPending(false)
        })
    }
  }

  const handleCreateNew = (e: FormEvent) => {
    e.preventDefault()
    setPending(true)

    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    if (!pictureChosen) {
      formData.delete('coverImage')
    }
    formData.append('isPublished', isPublishNow.toString())

    feedData
      .create(formData)
      .then(() => {
        setPending(false)
        clearForm()
        router.push('/')
      })
      .catch((error) => {
        setPending(false)
        setError(feedData.dataError)
      })
  }

  const handleUpdate = (e: FormEvent) => {
    if (!article) return

    e.preventDefault()
    setPending(true)

    // TODO:
    // - submit file data if new picture is chosen
    // - submit `null` picture id/url if picture removed

    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)

    if (!pictureChosen) {
      formData.delete('coverImage')
      if (article.imageUrl && !previewUrl) {
        formData.append('removeImage', 'true')
      }
    }
    formData.append('isPublished', isPublishNow.toString())
    feedData
      .update(article.id, formData)
      .then(() => {
        setPending(false)
        router.push('/')
      })
      .catch((error) => {
        setPending(false)
        setError(feedData.dataError)
      })
  }

  const handleSubmit = (e: FormEvent) => {
    if (isEditMode) {
      handleUpdate(e)
    } else {
      handleCreateNew(e)
    }
  }

  const handleFileChange = (e: ChangeEvent) => {
    const fileList = fileInputRef.current?.files

    const file = fileList?.item(0)
    if (!file) {
      console.log('No file selected')
      return
    }

    setPictureChosen(true)
    const objectURL = URL.createObjectURL(file)
    setPreviewUrl(objectURL)

    console.log(`${file?.name} --- ${file?.size}  --- ${file?.type}`)
    console.log(`objUrl --- ${objectURL}`)
  }

  const clearPicture = () => {
    if (pictureChosen) {
      URL.revokeObjectURL(previewUrl)
    }

    setPreviewUrl('')
    setPictureChosen(false)

    if (fileInputRef.current) {
      const input = fileInputRef.current
      input.value = ''
    }
  }

  return (
    <>
      <Tabs
        activeKey={tab}
        onSelect={(t) => {
          if (t) {
            setTab(t)
          }
        }}
        className="mb-3"
      >
        <Tab eventKey="edit" title="Edit">
          <div className="vh-100">
            <div className="p-3 m-auto">
              <div className="d-flex flex-column">
                {!previewUrl ? (
                  <Button onClick={() => fileInputRef.current?.click()} variant="secondary">
                    Add image...
                  </Button>
                ) : (
                  <>
                    <img
                      className="preview-image"
                      src={previewUrl}
                      width={200}
                      alt="Image preview"
                    ></img>
                    <Button onClick={clearPicture} variant="secondary">
                      Remove
                    </Button>
                  </>
                )}
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="d-none mb-3" controlId="formPictureFile">
                  <Form.Label>Submit file</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    name="coverImage"
                    placeholder="Submit file"
                    ref={fileInputRef}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formArticleTitle">
                  <Form.Label>News Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter title"
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formArticleBody">
                  <Form.Label>News Text</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Start writing your article"
                    name="body"
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="publishCheck">
                  <Form.Check
                    type="checkbox"
                    label="Publish now"
                    // name="isPublished"
                    checked={isPublishNow}
                    onChange={(e) => setIsPublishNow(e.target.checked)}
                  />
                </Form.Group>
                <div className="d-flex flex-row justify-content-start gap-2">
                  <Button variant="primary" type="submit" disabled={pending}>
                    Submit
                  </Button>
                  <Button
                    variant="danger"
                    disabled={pending}
                    onClick={() => setShowOnDeleteModal(true)}
                  >
                    Delete
                  </Button>
                </div>
              </Form>
              {error && (
                <Alert className="mt-3" variant="danger" onClose={() => setError('')} dismissible>
                  error
                </Alert>
              )}
            </div>
          </div>
        </Tab>
        <Tab eventKey="preview" title="Preview">
          <NewsCard
            item={{
              title: titleText,
              imageUrl: previewUrl,
              content: bodyText,
              isPublished: isPublishNow,
            }}
            isPreview={true}
          />
        </Tab>
      </Tabs>
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
