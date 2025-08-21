import dynamic from 'next/dynamic'

export const MyAsyncQuillEditor = dynamic(
  () => import('./MyQuillEditor').then((mode) => mode.MyQuillEditor),
  {
    ssr: false,
  }
)
