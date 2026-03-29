import { DashboardLayout } from '@/components/layout/dashboard';
import React from 'react'

function edit() {
  return (
    <div>edit</div>
  )
}
edit.layout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);
export default edit