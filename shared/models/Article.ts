import { Attachment } from './Attachment'

export interface Article {
  id: string
  author: string
  createdAt: Date
  updatedAt?: Date
  publishAt?: Date
  title: string
  content: string
  imageUrl?: string
  isPublished: boolean
  attachments: Attachment[]
}
