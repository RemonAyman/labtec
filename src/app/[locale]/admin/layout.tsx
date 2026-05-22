import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lap Tec Admin | Control Center",
  description: "Egypt's premium laptop e-commerce marketplace administration panel."
}

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/20 via-background to-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}
