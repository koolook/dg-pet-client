import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'

import { api } from '@shared/api/api'
import useSession from '@shared/lib/hooks/useSession'
import { Layout } from '@widgets/Layout/Layout'
import { useRouter } from 'next/router'
import Image from 'next/image'

const Article = () => {
  const [pending, setPending] = useState(false)
  const [imageList, setImageList] = useState<[number, string][]>([])
  const [error, setError] = useState('')
  const [imgIdx, setImgIdx] = useState(0)
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const session = useSession()
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setPending(true)

    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)

    api
      .post<{ path: string }>('/auth/upload', formData)
      .then((res) => {
        const { path } = res.data
        setPending(false)
        setImageList([[imgIdx, path], ...imageList])
        setImgIdx(imgIdx + 1)
      })
      .catch((error) => {
        setPending(false)
        setError(error.toJSON())
      })
  }

  const onClickAddImage = () => {
    fileInputRef.current?.click()
  }

  //
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

    const preview = document.querySelector<HTMLImageElement>('.preview-image')

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

  useEffect(() => {
    if (!session.isAuthorized && session.isAuthDone) {
      router.push('/')
    }
  }, [session.isAuthorized, session.isAuthDone])

  if (!session.isAuthorized) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <Layout.Header canCreate={false} />
      <Layout.Content>
        <div className="vh-100">
          <div className="p-3 m-auto">
            <div className="d-flex flex-column">
              {!previewUrl ? (
                <Button onClick={onClickAddImage} variant="secondary">
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
              <Form.Group className="mb-3" controlId="formTitle">
                <Form.Label>News Title</Form.Label>
                <Form.Control type="text" name="title" placeholder="Enter title" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formContent">
                <Form.Label>News Text</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Start writing yuor article"
                  name="content"
                />
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

            {/* {previewUrl && (
              <Card>
                <Card.Img width={200} src={previewUrl}></Card.Img>
                <Card.Body>
                  <Card.Title>Preview card</Card.Title>
                  <Card.Text>Упал - встай! Встал - Упай!</Card.Text>
                </Card.Body>
              </Card>
            )} */}

            {/* <ul>
              {imageList.map(([idx, path]) => (
                <li key={idx}>
                  <Card>
                    <Card.Img src={'http://localhost:4000' + path}></Card.Img>
                  </Card>
                </li>
              ))}
            </ul> */}
          </div>
        </div>
      </Layout.Content>
    </Layout>
  )
}

export default Article
