import { CardSmall, CardSmallExam } from '@/components/card';
import { DashboardLayout } from '@/components/layout/dashboard';
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/utils/pagination';
import { DropdownMenuDestructive } from '@/components/utils/dropdown-menu';
import { EmptyFunction } from '@/components/utils/empty-function';
import { DropdownItemInterface } from '@/interface/global';
import { Pen, Sheet, Trash } from 'lucide-react';

import { Link } from '@inertiajs/react';
interface Data {
  id: string;
  name: string;
  description:string;
  questions_count: number;
  created_at: string;
  diff_for_humans: string;
}
interface Props {
  exams: Data[];
  course_id:string;
  links: any;
}
const itemDromDown = (exam: Data, course_id:string ,handleDeleteClick: (course: Data) => void): DropdownItemInterface[] => {
  console.log("courses id",course_id);
  return [
    {
      variant: "default",
      href: route('exams.show',{course: course_id, exam: exam.id}),
      label: "View",
      icon: <Sheet />,
      openModal: false
    },
    {
      variant: "default",
      href: route('exams.edit', {course: course_id, exam: exam.id}),
      label: "Edit",
      icon: <Pen />,
      openModal:false,
    },
    {
      variant: "destructive",
      href: route('exams.destroy', {course: course_id, exam: exam.id}),
      label: "Delete",
      icon: <Trash />,
      openModal: true,
      openModalFn: () => handleDeleteClick(exam),
    },
  ]
}
function index ({ exams, links,course_id }: Props){
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Data | null>(null);
  
  const handleDeleteClick = ($exam:Data) => {
    setSelectedExam($exam);
    setOpenDelete(true);
  }
  return (
    <>
      {exams.length > 0 ? (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>

            <CardSmallExam id={course_id} isCreate={true} onClick={() => setOpen(true)} />

            {exams.map((item) => (
              <CardSmallExam
                key={item.id}
                exams={exams}
                footer={
                  <DropdownMenuDestructive
                    target={<Button>Action</Button>}
                    items={itemDromDown(item,course_id, handleDeleteClick)}
                  />
                }
              />
            ))}
          </div>
          <Pagination links={links} />
        </>
      ) : (
        <div className='h-full flex justify-center items-center'>
          <EmptyFunction
            title="No Exam Yet"
            description="You haven't created any exams yet..."
          >
            <Button asChild>
              <Link
              href={route('exams.create',course_id)}>
                Create Exam
              </Link>
            </Button>
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