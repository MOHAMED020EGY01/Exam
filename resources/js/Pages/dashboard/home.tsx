import { useAuth } from '@/hooks/useAuth'

function home() {
  const { user } = useAuth()
  return (
    <div>
      <div>home page</div>
      <div>{user?.name ?? 'N/A'}</div>
      <div>{user?.email ?? 'N/A'}</div>
    </div>
  )
}

export default home
