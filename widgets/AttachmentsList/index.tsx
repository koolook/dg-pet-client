import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'

import { api } from '@shared/api/api'
import { Attachment } from '@shared/models/Attachment'

//
export type AttachmentsListProps = {
  attachments: Attachment[]
  onAttachmentsChange: (attachments: Attachment[]) => void
}

const AttachmentsList: React.FC<AttachmentsListProps> = ({ attachments, onAttachmentsChange }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const [list, setList] = useState<Attachment[]>(attachments)
  const [selectedItems, setSelectedItems] = useState(attachments.map((a) => a.id))

  const res2attachment = (data: any) =>
    ({
      id: data.id,
      name: data.name,
      path: data.path,
      size: data.size,
      type: data.type,
    }) as Attachment

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList && fileList.length > 0) {
      const file = fileList.item(0) || ''
      const formData = new FormData()
      formData.append('fileData', file)

      try {
        setIsUploading(true)
        const res = await api.post('/upload', formData, {
          onUploadProgress(progressEvent) {
            console.log(progressEvent.loaded)
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        setIsUploading(false)
        console.log('File uploaded ' + JSON.stringify(res.data))
        const newAttachment = res2attachment(res.data)

        setList((prev) => [newAttachment, ...prev])
        setSelectedItems((prev) => [newAttachment.id, ...prev])
      } catch (error) {
        console.error('Error uploading file', error)
      }
    }
  }

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target

    if (checked) {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, value])
    } else {
      setSelectedItems((prevSelectedItems) => prevSelectedItems.filter((item) => item !== value))
    }
  }

  const handleDelete = async () => {
    try {
      const res = await api.post('/upload/delete', selectedItems)

      setList((prev) => prev.filter((a) => selectedItems.includes(a.id)))
      setSelectedItems([])
    } catch (error) {
      console.log('Error deleting attachments')
    }
  }

  useEffect(() => {
    onAttachmentsChange(list.filter((a) => selectedItems.includes(a.id)))
  }, [list, selectedItems])

  return (
    <>
      <div>
        <div>
          <Button
            variant="outline-primary"
            onClick={() => {
              inputRef.current?.click()
            }}
          >
            Choose file
          </Button>
          {/*           <Button
            variant="outline-danger"
            onClick={handleDelete}
            disabled={selectedItems.length === 0}
          >
            Delete selected
          </Button> */}
        </div>
        <input
          ref={inputRef}
          className="d-none"
          type="file"
          accept="application/pdf, image/png, image/jpg, image/jpeg"
          onChange={handleFileUpload}
        />
      </div>
      <div className="d-flex flex-column gap-2">
        {list.map((at) => (
          <div className="d-flex flex-row gap-3" key={at.id}>
            <input
              type="checkbox"
              value={at.id}
              checked={selectedItems.includes(at.id)}
              onChange={handleCheckboxChange}
            />
            <span>{at.name}</span>
          </div>
        ))}
      </div>
    </>
  )
}

export default AttachmentsList
