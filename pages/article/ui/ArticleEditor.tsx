import { api } from '@shared/api/api'
import useSession from '@shared/lib/hooks/useSession'
import { NewsCard, NewsItem } from '@widgets/NewsCard'
import { useRouter } from 'next/router'
import React, { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { Alert, Button, Form, Tab, Tabs } from 'react-bootstrap'

export interface ArticleEditorProps {
  item?: NewsItem
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({ item }) => {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('edit')
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [titleText, setTitleText] = useState(item?.title || '')
  const [contentText, setContentText] = useState(item?.content || '')

  const session = useSession()
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setPending(true)

    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)

    api
      .post<{ id: string }>('/article/update', {
        title: formData.get('title'),
        body: formData.get('body'),
        publish: 1,
      })
      .then((res) => {
        const { id } = res.data
        setPending(false)
      })
      .catch((error) => {
        setPending(false)
        setError(error.toJSON())
      })
  }

  const handleFileChange = (e: ChangeEvent) => {
    const input = e.currentTarget as HTMLInputElement
    const fileList = input.files

    const file = fileList?.item(0)
    if (!file) {
      console.log('No file selected')
      return
    }

    const objectURL = window.URL.createObjectURL(file)
    setPreviewUrl(objectURL)

    console.log(`${file?.name} --- ${file?.size}  --- ${file?.type}`)
    console.log(`objUrl --- ${objectURL}`)

    // const preview = document.querySelector<HTMLImageElement>('.preview-image')

    /*     const reader = new FileReader()
    reader.onload = (e) => {
      if (preview) {
        preview.src = e.target?.result?.toString() || ''
      }
    }
    reader.readAsDataURL(file)
    */

    // if (preview) {
    //   preview.src = objectURL
    // }
  }

  return (
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
                  <Button onClick={() => setPreviewUrl('')} variant="secondary">
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
                  name="sampleFile"
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
                  placeholder="Start writing yuor article"
                  name="body"
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="publishCheck">
                <Form.Check disabled type="checkbox" label="Publish now" />
              </Form.Group>
              {pending ? (
                <Button variant="primary" type="submit" disabled>
                  <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                  <span role="status">Uploading...</span>
                </Button>
              ) : (
                <Button variant="primary" type="submit">
                  <span>Submit</span>
                </Button>
              )}
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
          item={{ title: titleText, imageUrl: previewUrl, content: contentText }}
          isPreview={true}
        />
      </Tab>
    </Tabs>
  )
}
