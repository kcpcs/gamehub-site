import { auth } from '@/lib/auth'
import { Header } from './Header'

export async function HeaderServer() {
  const session = await auth()

  return <Header user={session?.user || null} />
}
