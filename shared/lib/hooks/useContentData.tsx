import { useContext, useMemo, useState } from 'react'

import { StoreContext } from '@providers/StoreProvider'

import { api } from '@shared/api/api'
import { Article } from '@shared/models/Article'
import { QuoteItem } from '@shared/models/QuoteItem'

export interface ContentData {
  data: Article[]
  dataLoading: boolean
  dataError: string
  dataLoadingStart: () => {}
  dataLoadingDone: () => {}
  get: (id: string) => Article
  clear: () => {}
  load: (ids?: string[]) => Promise<void>
  deleteById: (id: string) => Promise<void>
  create: (formData: FormData) => Promise<string>
  update: (id: string, formData: FormData) => Promise<void>

  // quites operations
  quotes: QuoteItem[]
  addQuote: (quote: QuoteItem) => void
  clearQuotes: () => void
}

const useContentData = () => {
  const { state, dispatch } = useContext(StoreContext)
  const [dataError, setDataError] = useState('')

  const dataLoadingStart = () => {
    dispatch({ type: 'data_loading_start' })
  }

  const dataLoadingDone = () => {
    dispatch({ type: 'data_loading_done' })
  }

  const set = (data: Article[]) => {
    dispatch({ type: 'update_content', payload: { contentData: data } })
  }

  const clear = () => {
    set([])
  }

  const loadData = (ids?: string[]) => {
    const withBody = ids && Array.isArray(ids)
    return api.post('/article/feed', withBody ? { ids } : {}).then((res) => {
      console.log('Feed data: ' + JSON.stringify(res.data))

      return res.data && Array.isArray(res.data)
        ? (res.data as any[]).map<Article>(dataToArticle)
        : []
    })
  }

  const dataToArticle = (item: any) => {
    const article: Article = {
      id: item.id,
      title: item.title,
      content: item.body,
      author: item.author,
      createdAt: new Date(item.createdAt),
      isPublished: item.isPublished,
      attachments: [],
    }
    if (item.imageUrl) {
      article.imageUrl = process.env.NEXT_PUBLIC_HOST_API + item.imageUrl
    }

    if (item.publishAt) {
      article.publishAt = new Date(item.publishAt)
    }

    return article
  }

  return useMemo(
    () =>
      ({
        data: state.contentData,
        dataLoading: state.dataLoading,
        dataError,
        // set,
        clear,
        // add: (data: Article[]) => {},
        // remove: (data: Article[]) => {},
        dataLoadingStart,
        dataLoadingDone,

        get: (id: string) => {
          return state.contentData.find((article) => article.id === id)
        },

        load: (ids?: string[]) => {
          setDataError('')
          dataLoadingStart()

          const withBody = ids && Array.isArray(ids)
          return loadData(ids)
            .then((articles) => {
              set([...articles, ...(withBody ? state.contentData : [])])
            })
            .catch((error) => {
              setDataError((error as any).message)
              throw error
            })
            .finally(() => {
              dataLoadingDone()
            })
        },

        deleteById: (id: string) => {
          setDataError('')
          dataLoadingStart()

          return api
            .delete(`/article/${id}`)
            .then(() => {
              console.log(`Delete article ${id}`)
              const idx = state.contentData.findIndex((a) => a.id === id)
              if (idx !== -1) {
                set([...state.contentData.slice(0, idx), ...state.contentData.slice(idx + 1)])
              }
            })
            .catch((error) => {
              setDataError((error as any).message)
              throw error
            })
            .finally(() => {
              dataLoadingDone()
            })
        },

        create: (formData) => {
          setDataError('')
          dataLoadingStart()

          return api
            .post<{ id: string }>('/article', formData)
            .then((res) => {
              const { id } = res.data
              return loadData([id])
            })
            .then(([article]) => {
              set([article, ...state.contentData])
              return article.id
            })
            .catch((error) => {
              setDataError((error as any).message)
              throw error
            })
            .finally(() => {
              dataLoadingDone()
            })
        },

        update: (id, formData) => {
          setDataError('')
          dataLoadingStart()

          return api
            .put(`/article/${id}`, formData)
            .then(() => {
              return loadData([id])
            })
            .then(([article]) => {
              const idx = state.contentData.findIndex((a) => a.id === id)
              if (idx !== -1) {
                set([
                  ...state.contentData.slice(0, idx),
                  article,
                  ...state.contentData.slice(idx + 1),
                ])
              }
            })
            .catch((error) => {
              setDataError((error as any).message)
              throw error
            })
            .finally(() => {
              dataLoadingDone()
            })
        },

        quotes: state.quotes,
        addQuote: (quote: QuoteItem) => {
          dispatch({ type: 'quote_add', payload: { quote } })
        },
        clearQuotes: () => {
          dispatch({ type: 'quote_clear' })
        },
      }) as ContentData,
    [state.contentData, state.quotes]
  )
}

export default useContentData
