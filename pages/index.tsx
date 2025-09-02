import { Feed } from '@widgets/Feed'
import { Layout } from '@widgets/Layout/Layout'

import useSession from '@shared/lib/hooks/useSession'

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
