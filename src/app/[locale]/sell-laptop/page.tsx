import { UsedLaptopForm } from "@/components/forms/used-laptop-form"

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function SellLaptopPage({ params }: PageProps) {
  const { locale } = await params

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <UsedLaptopForm locale={locale} />
    </div>
  )
}
