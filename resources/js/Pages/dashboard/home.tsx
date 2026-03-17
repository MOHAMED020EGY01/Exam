import { useAuth } from '@/hooks/useAuth' 

function home() {
  const { user } = useAuth()
  return (
    <div>
      <div>home page</div>
      <div>{user?.name}</div>
    </div>
  )
}

export default home