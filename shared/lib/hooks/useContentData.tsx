import { StoreContext } from '@providers/StoreProvider'
import { api } from '@shared/api/api'
import { Article } from '@shared/models/Article'
import { useContext, useMemo, useState } from 'react'

export interface ContentData {
  data: Article[]
  dataLoading: boolean
  dataError: string
  dataLoadingStart: () => {}
  dataLoadingDone: () => {}
  set: (data: Article[]) => {}
  clear: () => {}
  add: (data: Article[]) => {}
  remove: (data: Article[]) => {}
  load: (ids?: string[]) => Promise<void>
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
    dispatch({
      type: 'update_content',
      payload: { contentData: [] },
    })
  }

  const dataToArticle = (item: any) => ({
    id: item.id,
    title: item.title,
    content: item.body,
    author: item.author,
    dateCreated: new Date(item.createdAt),
    isPublished: item.isPublished,
  })

  return useMemo(
    () =>
      ({
        data: state.contentData,
        dataLoading: state.dataLoading,
        dataError,
        set,
        clear,
        add: (data: Article[]) => {},
        remove: (data: Article[]) => {},
        dataLoadingStart,
        dataLoadingDone,

        load: (ids?: string[]) => {
          setDataError('')
          dataLoadingStart()

          const withBody = ids && Array.isArray(ids)
          return api
            .post('/article/feed', withBody ? { ids } : {})
            .then((res) => {
              console.log('Feed data: ' + JSON.stringify(res.data))

              if (res.data && Array.isArray(res.data)) {
                const feed = res.data as any[]
                set([...feed.map<Article>(dataToArticle), ...(withBody ? state.contentData : [])])
              }
            })
            .catch((error) => {
              setDataError((error as any).message)
            })
            .finally(() => {
              dataLoadingDone()
            })
        },
      }) as ContentData,
    [state.contentData]
  )
}

export default useContentData
