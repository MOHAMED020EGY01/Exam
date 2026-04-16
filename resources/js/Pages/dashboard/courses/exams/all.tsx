import { ExamCard } from "@/components/page-componets/exam-components";
import { CardSmall } from "@/components/card";
import { DashboardLayout } from "@/components/layout/dashboard";
import { Pagination } from "@/components/utils/pagination";
import { EmptyFunction } from "@/components/utils/empty-function";
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
    links: any;
}

function All({ exams, links }: Props) {
    console.log(exams)
    return (
        <>
            <h3 className="text-xl font-bold">Exam</h3>
            <p className="text-foreground/80">
                Here you can View all Exam only
            </p>
            {exams.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 py-4">
                        {exams.map((item) => (
                            <CardSmall key={item.id}>
                                <ExamCard exam={item}/>
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
                        <p>this page it's only show the exam </p>
                    </EmptyFunction>
                </div>
            )}
        </>
    );
}

All.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
export default All;
