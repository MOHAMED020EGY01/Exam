import { DashboardLayout } from '@/components/layout/dashboard';
import { ExamModalFormQuestions } from '@/components/page-componets/exam-components';
import React from 'react'

function show({exam}:{exam:any}) {
  return (
    
  )
}
show.layout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);
export default show
