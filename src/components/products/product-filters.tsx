"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, X } from "lucide-react"

interface ProductFiltersProps {
  categories: { id: string; name: string; nameAr: string | null }[]
  brands: { id: string; name: string }[]
  locale: string
}

export function ProductFilters({ categories, brands, locale }: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
  const [selectedCondition, setSelectedCondition] = useState(searchParams.get("condition") || "")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest")

  const updateFilters = (newFilters: {
    search?: string
    brand?: string
    category?: string
    condition?: string
    sort?: string
  }) => {
    const params = new URLSearchParams(searchParams.toString())

    // Update or delete keys based on parameters
    if (newFilters.search !== undefined) {
      if (newFilters.search) params.set("search", newFilters.search)
      else params.delete("search")
    }
    if (newFilters.brand !== undefined) {
      if (newFilters.brand) params.set("brand", newFilters.brand)
      else params.delete("brand")
    }
    if (newFilters.category !== undefined) {
      if (newFilters.category) params.set("category", newFilters.category)
      else params.delete("category")
    }
    if (newFilters.condition !== undefined) {
      if (newFilters.condition) params.set("condition", newFilters.condition)
      else params.delete("condition")
    }
    if (newFilters.sort !== undefined) {
      params.set("sort", newFilters.sort)
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search })
  }

  const clearAll = () => {
    setSearch("")
    setSelectedBrand("")
    setSelectedCategory("")
    setSelectedCondition("")
    setSortBy("newest")
    startTransition(() => {
      router.push(pathname)
    })
  }

  const isAr = locale === "ar"

  return (
    <div className="space-y-6 rounded-2xl border border-cyan-500/10 bg-card/40 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-cyan-500/10 pb-4">
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
          <SlidersHorizontal className="h-5 w-5 text-cyan-500" />
          {isAr ? "الفلاتر" : "Filters"}
        </h2>
        {(search || selectedBrand || selectedCategory || selectedCondition || sortBy !== "newest") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-8 text-xs text-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/10"
          >
            <X className="mr-1 h-3.5 w-3.5" />
            {isAr ? "مسح الكل" : "Clear All"}
          </Button>
        )}
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="space-y-2">
        <label className="text-sm font-semibold text-muted-foreground">
          {isAr ? "بحث بالاسم" : "Search Name"}
        </label>
        <div className="relative">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? "ابحث عن الحواسيب..." : "Search laptops..."}
            className="border-cyan-500/10 bg-background/50 pl-10 pr-4 focus-visible:border-cyan-500"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </form>

      {/* Categories */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-muted-foreground">
          {isAr ? "الفئات" : "Categories"}
        </label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedCategory("")
              updateFilters({ category: "" })
            }}
            className={selectedCategory === "" ? "bg-cyan-600 hover:bg-cyan-500" : "border-cyan-500/10 hover:border-cyan-500/30"}
          >
            {isAr ? "الكل" : "All"}
          </Button>
          {categories.map((cat) => {
            const label = isAr && cat.nameAr ? cat.nameAr : cat.name
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCategory(cat.id)
                  updateFilters({ category: cat.id })
                }}
                className={selectedCategory === cat.id ? "bg-cyan-600 hover:bg-cyan-500" : "border-cyan-500/10 hover:border-cyan-500/30"}
              >
                {label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-muted-foreground">
          {isAr ? "البراند / العلامة التجارية" : "Brands"}
        </label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedBrand === "" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedBrand("")
              updateFilters({ brand: "" })
            }}
            className={selectedBrand === "" ? "bg-cyan-600 hover:bg-cyan-500" : "border-cyan-500/10 hover:border-cyan-500/30"}
          >
            {isAr ? "الكل" : "All"}
          </Button>
          {brands.map((brand) => (
            <Button
              key={brand.id}
              variant={selectedBrand === brand.id ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedBrand(brand.id)
                updateFilters({ brand: brand.id })
              }}
              className={selectedBrand === brand.id ? "bg-cyan-600 hover:bg-cyan-500" : "border-cyan-500/10 hover:border-cyan-500/30"}
            >
              {brand.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-muted-foreground">
          {isAr ? "حالة الجهاز" : "Condition"}
        </label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={selectedCondition === "" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedCondition("")
              updateFilters({ condition: "" })
            }}
            className={selectedCondition === "" ? "bg-cyan-600 hover:bg-cyan-500" : "border-cyan-500/10 hover:border-cyan-500/30"}
          >
            {isAr ? "الكل" : "All"}
          </Button>
          <Button
            variant={selectedCondition === "NEW" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedCondition("NEW")
              updateFilters({ condition: "NEW" })
            }}
            className={selectedCondition === "NEW" ? "bg-cyan-600 hover:bg-cyan-500" : "border-cyan-500/10 hover:border-cyan-500/30"}
          >
            {isAr ? "جديد" : "New"}
          </Button>
          <Button
            variant={selectedCondition === "USED" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedCondition("USED")
              updateFilters({ condition: "USED" })
            }}
            className={selectedCondition === "USED" ? "bg-cyan-600 hover:bg-cyan-500" : "border-cyan-500/10 hover:border-cyan-500/30"}
          >
            {isAr ? "مستعمل" : "Used"}
          </Button>
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-muted-foreground">
          {isAr ? "ترتيب حسب" : "Sort By"}
        </label>
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value)
            updateFilters({ sort: e.target.value })
          }}
          className="w-full rounded-md border border-cyan-500/10 bg-background/50 px-3 py-2 text-sm text-foreground focus:border-cyan-500 focus:outline-none"
        >
          <option value="newest">{isAr ? "الأحدث" : "Newest"}</option>
          <option value="price_asc">{isAr ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</option>
          <option value="price_desc">{isAr ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</option>
          <option value="rating_desc">{isAr ? "الأعلى تقييماً" : "Best Rating"}</option>
        </select>
      </div>

      {isPending && (
        <div className="text-center text-xs text-cyan-500 animate-pulse mt-2">
          {isAr ? "جاري التحديث..." : "Updating catalog..."}
        </div>
      )}
    </div>
  )
}
