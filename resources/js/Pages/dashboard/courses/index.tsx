import { CardCreate, CardSmall } from "@/components/card";
import { DashboardLayout } from "@/components/layout/dashboard";
import { ModalDynamic } from "@/components/modal";
import { CoursesCard } from "@/components/page-componets/corses-components";
import { Button } from "@/components/ui/button";
import { DropdownMenuDestructive } from "@/components/utils/dropdown-menu";
import { EmptyFunction } from "@/components/utils/empty-function";
import { Pagination } from "@/components/utils/pagination";
import { DropdownItemInterface } from "@/interface/global";
import { FieldForm } from "@/interface/modal-interface";
import { Book, Pen, Trash } from "lucide-react";
import { ReactNode, useState } from "react";

interface Data {
  id: string;
  name: string;
  exam_count: string;
  description: string;
  created_at: string;
  diff_for_humans: string;
}
interface Props {
  courses: Data[];
  links: any;
}
const itemAction = (courses: Data, handleEditClick: (course: Data) => void, handleDeleteClick: (course: Data) => void): DropdownItemInterface[] => {
  return [
    {
      variant: "default",
      href: route('courses.show', courses.id),
      label: "View",
      icon: <Book />,
      openModal: false
    },
    {
      variant: "default",
      href: route('courses.update', courses.id),
      label: "Edit",
      icon: <Pen />,
      openModal: true,
      openModalFn: () => handleEditClick(courses),
    },
    {
      variant: "destructive",
      href: route('courses.destroy', courses.id),
      label: "Delete",
      icon: <Trash />,
      openModal: true,
      openModalFn: () => handleDeleteClick(courses),
    },
  ]
}

const form = [
  { field: 'name', type: 'input' },
  { field: 'description', type: 'input' }
] as FieldForm[];

const Courses = ({ courses, links }: Props) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Data | null>(null);

  const handleEditClick = (course: Data) => {
    setSelectedCourse(course);
    setOpenEdit(true);
  };

  const handleDeleteClick = (course: Data) => {
    setSelectedCourse(course);
    setOpenDelete(true);
  };

  return (
    <>
      {courses.length > 0 ? (
        <>
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            <CardCreate title="Create Courses" onClick={ () => setOpen(true)} isLinK={false} />
            {courses.map((item) => (
              <CardSmall>
                  <CoursesCard courses={item} items={itemAction(item,handleEditClick,handleDeleteClick)} />
                </CardSmall>
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
            <Button
              onClick={() => setOpen(true)}>
              Create Courses
            </Button>
          </EmptyFunction>
        </div>
      )}
      {open && 
      <ModalDynamic
        open={open}
        setOpen={() => setOpen(false)}
        inputForm={form}
        url={route('courses.store')}
        title="Create Course"
        description="Create a new course"
        method='post'
      />}

      {(selectedCourse && openEdit) &&
        <ModalDynamic
          open={openEdit}
          setOpen={() => setOpenEdit(false)}
          inputForm={form}
          url={route('courses.update', selectedCourse.id)}
          title="Edit Course"
          description="Edit a the Coures"
          method='put'
          dataForm={selectedCourse}
        />}
      {(selectedCourse && openDelete) &&
        <ModalDynamic
          open={openDelete}
          setOpen={() => setOpenDelete(false)}
          url={route('courses.destroy', selectedCourse.id)}
          title="Delete Course"
          description={`Are you shour to delete Course ${selectedCourse.name}`}
          method='delete'
        />}
    </>
  );
};

Courses.layout = (page: ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);
export default Courses