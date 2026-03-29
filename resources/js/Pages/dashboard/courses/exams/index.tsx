import { CardSmall } from '@/components/card';
import { DashboardLayout } from '@/components/layout/dashboard';
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/utils/pagination';
import { DropdownMenuDestructive } from '@/components/utils/dropdown-menu';
import { EmptyFunction } from '@/components/utils/empty-function';
interface Data {
  id: string;
  name: string;
  questions_count: number;
  created_at: string;
  diff_for_humans: string;
}
interface Props {
  exams: Data[];
  links: any;
}
function index ({ exams, links }: Props){
  console.log(exams)
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  return (
    <>
      {exams.length > 0 ? (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>

            <CardSmall isCreate={true} onClick={() => setOpen(true)} />

            {exams.map((item) => (
              <CardSmall
                key={item.id}
                footer={
                  <DropdownMenuDestructive
                    target={<Button>Action</Button>}/>
                  
                }
              />
            ))}
          </div>
          <Pagination links={links} />
        </>
      ) : (
        <div className='h-full flex justify-center items-center'>
          <EmptyFunction
            title="No Courses Yet"
            description="You haven't created any courses yet..."
          >
            <Button>Create Courses</Button>
          </EmptyFunction>
        </div>
      )}
    </>
  );
};
index.layout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);
export default index