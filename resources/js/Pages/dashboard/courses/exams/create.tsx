import { DashboardLayout } from '@/components/layout/dashboard';
import React from 'react'

function create() {
  return (
    <div>create</div>
  )
}
create.layout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);
export default create