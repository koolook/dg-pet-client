import { useRouter } from 'next/router'
import React, { FormEvent, useRef, useState } from 'react'
import { Alert, Button, Form, Modal, Tab, Tabs } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { NewsCard } from '@widgets/NewsCard'

import useContentData from '@shared/lib/hooks/useContentData'
import { Article } from '@shared/models/Article'
import { MyQuillEditor } from '@shared/ui/MyQuillEditor'

export interface ArticleEditorProps {
  article?: Article
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({ article }) => {
  const isEditMode = !!article

  const thisDateTime = new Date()

  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('edit')
  const [previewUrl, setPreviewUrl] = useState(
    isEditMode && article.imageUrl ? article.imageUrl : ''
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pictureChosen, setPictureChosen] = useState(false)
  const [showOnDeleteModal, setShowOnDeleteModal] = useState(false)

  // Form data
  const [titleText, setTitleText] = useState(article?.title || '')
  const [bodyText, setBodyText] = useState(article?.content || '')
  const [isPublish, setIsPublish] = useState(!!article?.isPublished || !!article?.publishAt)
  const [isPublishAt, setIsPublishAt] = useState(!!article?.publishAt)
  const [publishAtDate, setPublishAtDate] = useState<Date | null>(article?.publishAt || new Date())

  const router = useRouter()
  const feedData = useContentData()

  const clearForm = () => {
    setTitleText('')
    setBodyText('')
    setIsPublish(true)
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
    formData.append('body', bodyText)

    formData.append('publish', isPublish.toString())
    if (isPublish && isPublishAt && publishAtDate) {
      formData.append('publishAt', publishAtDate.valueOf().toString())
    }

    feedData
      .create(formData)
      .then((id) => {
        setPending(false)
        clearForm()
        router.push(`/#${id}`)
      })
      .catch(() => {
        setPending(false)
        setError(feedData.dataError)
      })
  }

  const handleUpdate = (e: FormEvent) => {
    if (!article) return

    e.preventDefault()
    setPending(true)

    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)

    if (!pictureChosen) {
      formData.delete('coverImage')
      if (article.imageUrl && !previewUrl) {
        formData.append('removeImage', 'true')
      }
    }
    formData.append('body', bodyText)

    formData.append('publish', isPublish.toString())
    if (isPublish && isPublishAt && publishAtDate) {
      formData.append('publishAt', publishAtDate.valueOf().toString())
    }

    feedData
      .update(article.id, formData)
      .then(() => {
        setPending(false)
        router.push(`/#${article.id}`)
      })
      .catch(() => {
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

  const handleFileChange = () => {
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
                  <Form.Label>Article Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter title"
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formArticleBody">
                  <Form.Label>Article Body</Form.Label>
                  <MyQuillEditor value={bodyText} onChange={(value) => setBodyText(value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="publishCheck">
                  <Form.Check
                    type="checkbox"
                    label="Publish"
                    // name="isPublished"
                    checked={isPublish}
                    onChange={(e) => setIsPublish(e.target.checked)}
                  />
                </Form.Group>
                <Form.Group className="mb-3 ms-3 d-flex flex-row gap-2 " controlId="publishDate">
                  <Form.Check
                    type="checkbox"
                    label="Publish at:"
                    name="isPublished"
                    checked={isPublishAt}
                    disabled={!isPublish}
                    onChange={(e) => setIsPublishAt(e.target.checked)}
                  ></Form.Check>
                  <DatePicker
                    id="my-datepicker"
                    selected={publishAtDate}
                    disabled={!isPublishAt}
                    onChange={(date) => setPublishAtDate(date)}
                    showTimeSelect
                    minDate={thisDateTime}
                    minTime={
                      publishAtDate?.getDate() === thisDateTime.getDate() ? new Date() : undefined
                    }
                    maxTime={
                      publishAtDate?.getDate() === thisDateTime.getDate()
                        ? new Date(thisDateTime.setHours(23, 59, 59))
                        : undefined
                    }
                    dateFormat="MMMM d, yyyy HH:mm"
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
        {/* <Tab eventKey="quill" title="Quill">
              <MyQuillEditor value={bodyText} onChange={onChangeQuill}/>
        </Tab> */}
        <Tab eventKey="preview" title="Preview">
          <NewsCard
            item={{
              title: titleText,
              imageUrl: previewUrl,
              content: bodyText,
              isPublished: isPublish,
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
