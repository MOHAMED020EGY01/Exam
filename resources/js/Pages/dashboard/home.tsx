import {DashboardLayout} from '@/components/layout/dashboard';
import { useAuth } from '@/hooks/use-auth'

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

home.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export default home
