import { db } from "@/lib/db"
import { ProductCard } from "@/components/products/product-card"
import { ProductFilters } from "@/components/products/product-filters"
import { Prisma } from "@prisma/client"
import { getTranslations } from "next-intl/server"
import { Laptop } from "lucide-react"

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductsPage(props: PageProps) {
  const { locale } = await props.params
  const searchParams = await props.searchParams

  const t = await getTranslations("Navigation")
  const tHome = await getTranslations("HomePage")

  // Parse search params
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined
  const brandId = typeof searchParams.brand === "string" ? searchParams.brand : undefined
  const categoryId = typeof searchParams.category === "string" ? searchParams.category : undefined
  const condition = typeof searchParams.condition === "string" ? searchParams.condition : undefined
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "newest"

  // Fetch available categories and brands for filters
  const categories = await db.category.findMany({
    orderBy: { name: "asc" }
  })
  const brands = await db.brand.findMany({
    orderBy: { name: "asc" }
  })

  // Build Prisma query filters
  const whereClause: Prisma.ProductWhereInput = {}

  if (brandId) {
    whereClause.brandId = brandId
  }
  if (categoryId) {
    whereClause.categoryId = categoryId
  }
  if (condition) {
    whereClause.condition = condition
  }
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { nameAr: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { descAr: { contains: search, mode: "insensitive" } }
    ]
  }

  // Build sorting
  let orderByClause: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" }
  if (sort === "price_asc") {
    orderByClause = { price: "asc" }
  } else if (sort === "price_desc") {
    orderByClause = { price: "desc" }
  } else if (sort === "rating_desc") {
    orderByClause = { rating: "desc" }
  }

  // Fetch products
  const products = await db.product.findMany({
    where: whereClause,
    orderBy: orderByClause,
    include: {
      category: true,
      brand: true,
      images: true
    }
  })

  const isAr = locale === "ar"

  return (
    <div className="container py-8 md:py-12">
      {/* Header Banner */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-cyan-500/10 bg-gradient-to-r from-cyan-950/20 via-background to-cyan-950/20 p-8 md:p-12">
        <div className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-500">
            <Laptop className="h-4 w-4" />
            {isAr ? "كتالوج اللابتوبات المميز" : "Premium Laptops Catalog"}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            {isAr ? "استكشف أجهزتنا" : "Explore Our Catalog"}
          </h1>
          <p className="mt-4 text-muted-foreground md:text-lg">
            {isAr
              ? "ابحث عن اللابتوب المثالي الذي يناسب عملك، دراستك أو شغفك بالألعاب. شحن سريع وضمان حقيقي."
              : "Discover high-performance laptops designed specifically for your professional, gaming, or academic lifestyle."}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <ProductFilters categories={categories} brands={brands} locale={locale} />
        </div>

        {/* Catalog Grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-500/10 bg-card/10 p-12 text-center backdrop-blur-sm">
              <Laptop className="mb-4 h-16 w-16 text-muted-foreground/40 animate-pulse" />
              <h3 className="text-xl font-bold text-foreground">
                {isAr ? "لم نجد أي حواسيب تطابق بحثك" : "No Laptops Found"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {isAr
                  ? "جرب إزالة بعض الفلاتر أو البحث بكلمة مختلفة."
                  : "Try clearing some filters or using different keywords to explore further."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const name = isAr && product.nameAr ? product.nameAr : product.name
                const category = isAr && product.category.nameAr ? product.category.nameAr : product.category.name
                const mainImage = product.images[0]?.url || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"
                
                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={name}
                    price={product.price}
                    image={mainImage}
                    category={category}
                    condition={product.condition}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
