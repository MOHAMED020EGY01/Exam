import { DashboardLayout } from '@/components/layout/dashboard';
import React from 'react'

function show() {
  return (
    <div>show</div>
  )
}
show.layout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);
export default show