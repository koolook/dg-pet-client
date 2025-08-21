import dynamic from 'next/dynamic'

export const MyAsyncQuillReader = dynamic(
  () => import('./MyQuillReader').then((mode) => mode.MyQuillReader),
  {
    ssr: false,
  }
)
