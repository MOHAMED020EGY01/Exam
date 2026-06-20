/**
 * home.tsx
 *
 * Purpose:
 * Renders the dashboard home page.
 *
 * Responsibilities:
 * - Render main dashboard portal elements
 *
 * Dependencies:
 * - DashboardLayout
 */

import { Head } from '@inertiajs/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';


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
