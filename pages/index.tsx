import { Feed } from '@widgets/Feed'
import { Layout } from '@widgets/Layout/Layout'

import useSession from '@shared/lib/hooks/useSession'

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// })

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// })

export default function Home() {
  const session = useSession()

  return (
    <>
      <Layout>
        <Layout.Header canCreate={session.canEdit} />
        <Layout.Content>
          <Feed />
        </Layout.Content>
      </Layout>
    </>
  )
}
