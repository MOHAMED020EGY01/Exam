import {
    ExamCard,
    ExamModalFormQuestions,
} from "@/components/page-componets/exam-components";
import { CardCreate, CardSmall } from "@/components/card";
import { DashboardLayout } from "@/components/layout/dashboard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/utils/pagination";
import { EmptyFunction } from "@/components/utils/empty-function";
import { DropdownItemInterface } from "@/interface/global";
import { Pen, Sheet, Trash } from "lucide-react";
import { ModalDynamic } from "@/components/modal";
import { ModalDynamicAdvanced } from "@/components/utils/modal-advanced";
interface Data {
    id: string;
    name: string;
    description: string;
    questions_count: number;
    questions_package: any;
    created_at: string;
    diff_for_humans: string;
}
interface Props {
    exams: Data[];
    course: any;
    links: any;
}
const itemDropDown = (
    exam: Data,
    course: any,
    handleDeleteClick: (course: Data) => void,
    handleEditClick: (course: Data) => void,
): DropdownItemInterface[] => {
    return [
        {
            variant: "default",
            href: route("exams.show", { course: course.id, exam: exam.id }),
            label: "View",
            icon: <Sheet />,
            openModal: false,
        },
        {
            variant: "default",
            href: route("exams.update", { course: course.id, exam: exam.id }),
            label: "Edit",
            icon: <Pen />,
            openModal: true,
            openModalFn: () => handleEditClick(exam),
        },
        {
            variant: "destructive",
            href: route("exams.destroy", { course: course.id, exam: exam.id }),
            label: "Delete",
            icon: <Trash />,
            openModal: true,
            openModalFn: () => handleDeleteClick(exam),
        },
    ];
};
function Index({ exams, links, course }: Props) {
    const [openModalExam, setOpenModalExam] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedEditModal, setSelectedEditModal] = useState<Data | null>(
        null,
    );
    const [selectedDeleteModal, setSelectedDeleteModal] = useState<Data | null>(
        null,
    );
    const handleDeleteClick = (item: Data) => {
        setSelectedDeleteModal(item);
        setDeleteModal(true);
    };
    const handleEditClick = (item: Data) => {
        setSelectedEditModal(item);
        setEditModal(true);
    };

    return (
        <>
            <h3 className="text-xl font-bold">Exam</h3>
            <p className="text-foreground/80">
                Here you can manage your Exam and view their details.
            </p>
            {exams.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 py-4">
                        <CardCreate
                            isLinK={false}
                            title="Create exam"
                            onClick={() => setOpenModalExam(true)}
                        />
                        {exams.map((item) => (
                            <CardSmall key={item.id}>
                                <ExamCard
                                    exam={item}
                                    items={itemDropDown(
                                        item,
                                        course,
                                        handleDeleteClick,
                                        handleEditClick,
                                    )}
                                />
                            </CardSmall>
                        ))}
                    </div>
                    <Pagination links={links} />
                </>
            ) : (
                <div className="h-full flex justify-center items-center">
                    <EmptyFunction
                        title="No Exam Yet"
                        description="You haven't created any exams yet..."
                    >
                        <Button onClick={() => setOpenModalExam(true)}>
                            Create Exam
                        </Button>
                    </EmptyFunction>
                </div>
            )}

            {selectedDeleteModal && deleteModal && (
                <ModalDynamic
                    open={deleteModal}
                    setOpen={() => setDeleteModal(false)}
                    url={route("exams.destroy", {
                        course: course.id,
                        exam: selectedDeleteModal.id,
                    })}
                    title="Delete Course"
                    description={`Are you sure to delete Course ${selectedDeleteModal.name}`}
                    method="delete"
                />
            )}
            <ModalDynamicAdvanced
                open={openModalExam}
                children={
                    <ExamModalFormQuestions
                        submitForm="Create Exam"
                        method="post"
                        url={route("exams.store", course.id)}
                        setOpen={setOpenModalExam}
                    />
                }
            />
            {selectedEditModal && editModal && (
                <ModalDynamicAdvanced
                    open={editModal}
                    children={
                        <ExamModalFormQuestions
                            submitForm="Update Exam"
                            method={"put"}
                            url={route("exams.update", {
                                course: course.id,
                                exam: selectedEditModal.id,
                            })}
                            setOpen={setEditModal}
                            exam={selectedEditModal}
                        />
                    }
                />
            )}
        </>
    );
}

Index.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
export default Index;
