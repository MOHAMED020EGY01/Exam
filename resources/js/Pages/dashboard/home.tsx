import { Head } from '@inertiajs/react';
import { DashboardLayout } from '@/components/layout/dashboard';


function Home() {
  return (
    <>
      <Head title="Home" />
      
    </>
  );
}

Home.layout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Home;