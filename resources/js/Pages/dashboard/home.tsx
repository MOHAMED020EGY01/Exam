import { Head } from '@inertiajs/react';
import { DashboardLayout } from '@/components/layout/dashboard';
import { SonnerTypes } from '@/components/utils/flash-message/flash-helper';


function Home() {
  return (
    <>
      <Head title="Home" />
      <SonnerTypes />
    </>
  );
}

Home.layout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Home;