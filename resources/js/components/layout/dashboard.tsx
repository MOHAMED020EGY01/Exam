import { ReactNode, useState } from "react";
import { Footer, Navbar, Sidebar } from "../page-component";
import { Toaster } from "@/components/ui/sonner"





const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <main className="flex gap-4 min-h-screen p-4 bg-background-secondary">
      <Sidebar open={open} />
      <div className="flex flex-col gap-4 w-full mx-auto">
        <Navbar open={open} setOpen={setOpen} />
        <div className="grow card-page">
          {children}
        </div>
        <Toaster />
        <div className="card-page">
          <Footer />
        </div>
      </div>
    </main>
  )
}

const WelcomeLayout = ({children}:{children:ReactNode}) => {
  const [open, setOpen] = useState(false);
  return (
    <main className="flex gap-4 min-h-screen p-4 bg-background-secondary">
      <div className="flex flex-col gap-4 w-full mx-auto">
        <Navbar open={open} setOpen={setOpen} />
        <div className="grow card-page">
          {children}
        </div>
        <div className="card-page">
          <Footer />
        </div>
      </div>
    </main>
  )
}

export {DashboardLayout,WelcomeLayout}