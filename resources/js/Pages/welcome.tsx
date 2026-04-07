import { WelcomeLayout } from "@/components/layout/dashboard";
import { Head, Link} from "@inertiajs/react";

 function Welcome() {

    return (
        <>
            <Head title="Welcome" />
        </>
    );
}

Welcome.layout = (page: React.ReactNode) => (
  <WelcomeLayout>{page}</WelcomeLayout>
);

export default Welcome;