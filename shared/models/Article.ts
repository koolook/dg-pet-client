export interface Article {
  id?: string | null
  author?: string
  dateCreated?: Date
  datePublished?: Date
  title: string
  content: string
  imageUrl?: string
  isPublished: boolean
}
