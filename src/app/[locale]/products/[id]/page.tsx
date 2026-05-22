import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { ProductDetailView } from "@/components/products/product-detail-view"

interface ProductPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, id } = await params

  const product = await db.product.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      images: true,
      reviews: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <ProductDetailView product={product} locale={locale} />
    </div>
  )
}
