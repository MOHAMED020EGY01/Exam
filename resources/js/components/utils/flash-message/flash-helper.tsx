"use client"

import { toast, Toaster } from "sonner"
import { useEffect } from "react"

interface Props {
  serverMessage?: string
}

export function SonnerTypes({ serverMessage }: Props) {
  useEffect(() => {
    if (serverMessage) {
      toast.custom((t) => (
        <div className="bg-green-500 text-white p-4 rounded-xl shadow-lg">
          {serverMessage}
        </div>
      ))
    }
  }, [serverMessage])

  return (
    <div>
      <Toaster position="top-right" richColors />
    </div>
  )
}