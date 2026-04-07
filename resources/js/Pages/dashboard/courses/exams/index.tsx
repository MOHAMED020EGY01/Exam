import { CardCreate, CardSmall } from '@/components/card';
import { DashboardLayout } from '@/components/layout/dashboard';
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/utils/pagination';
import { EmptyFunction } from '@/components/utils/empty-function';
import { DropdownItemInterface } from '@/interface/global';
import { Pen, Sheet, Trash } from 'lucide-react';

import { Link } from '@inertiajs/react';
import { ExamCard } from '@/components/page-componets/exam-components';
import { ModalDynamic } from '@/components/modal';
interface Data {
  id: string;
  name: string;
  description: string;
  questions_count: number;
  created_at: string;
  diff_for_humans: string;
}
interface Props {
  exams: Data[];
  course_id: string;
  links: any;
}
const itemDromDown = (exam: Data, course_id: string, handleDeleteClick: (course: Data) => void): DropdownItemInterface[] => {
  console.log("courses id", course_id);
  return [
    {
      variant: "default",
      href: route('exams.show', { course: course_id, exam: exam.id }),
      label: "View",
      icon: <Sheet />,
      openModal: false
    },
    {
      variant: "default",
      href: route('exams.edit', { course: course_id, exam: exam.id }),
      label: "Edit",
      icon: <Pen />,
      openModal: false,
    },
    {
      variant: "destructive",
      href: route('exams.destroy', { course: course_id, exam: exam.id }),
      label: "Delete",
      icon: <Trash />,
      openModal: true,
      openModalFn: () => handleDeleteClick(exam),
    },
  ]
}
function index({ exams, links, course_id }: Props) {
  const [open, setOpen] = useState<Data | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selected,setSelect] = useState<Data | null>(null);
  const handleDeleteClick = (item: Data) => {
    setSelect(item);
    setDeleteModal(true);
  }
  const handelar = (item: Data) => {
    setOpen(item)
  }
  return (
    <>
      {exams.length > 0 ? (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
            <CardCreate isLinK={true} title='Create exam' url={route('exams.create', course_id)} />
            {exams.map((item) => (
              <CardSmall key={item.id} onClick={() => handelar}>
                <ExamCard exam={item} items={itemDromDown(item, course_id, handleDeleteClick)} />
              </CardSmall>
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
                href={route('exams.create', course_id)}>
                Create Exam
              </Link>
            </Button>
          </EmptyFunction>
        </div>
      )}

      {(selected && deleteModal) &&
        <ModalDynamic
          open={deleteModal}
          setOpen={() => setDeleteModal(false)}
          url={route('exams.destroy',{course:course_id , exam:selected.id})}
          title="Delete Course"
          description={`Are you shour to delete Course ${selected.name}`}
          method='delete'
        />}
    </>
  );
};

index.layout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);
export default index