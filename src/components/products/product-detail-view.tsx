"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/store/use-cart"
import { useWishlist } from "@/store/use-wishlist"
import { toast } from "sonner"
import { 
  Heart, 
  ShoppingCart, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  RefreshCcw, 
  Star,
  Cpu,
  Layers,
  HardDrive,
  Monitor
} from "lucide-react"

interface ProductDetailViewProps {
  product: {
    id: string
    name: string
    nameAr: string | null
    description: string
    descAr: string | null
    price: number
    condition: string
    rating: number
    stock: number
    category: { id: string; name: string; nameAr: string | null }
    brand: { id: string; name: string }
    images: { id: string; url: string }[]
    reviews: {
      id: string
      rating: number
      comment: string | null
      createdAt: Date
      user: { name: string | null }
    }[]
  }
  locale: string
}

export function ProductDetailView({ product, locale }: ProductDetailViewProps) {
  const router = useRouter()
  const { addItem: addToCart } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(product.id)

  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const isAr = locale === "ar"
  const productName = isAr && product.nameAr ? product.nameAr : product.name
  const productDesc = isAr && product.descAr ? product.descAr : product.description
  const categoryName = isAr && product.category.nameAr ? product.category.nameAr : product.category.name

  // Fallback if no images are present
  const images = product.images.length > 0 
    ? product.images.map(img => img.url)
    : ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"]

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast.info(isAr ? "تمت إزالة الجهاز من المفضلة" : `${productName} removed from wishlist`)
    } else {
      addToWishlist({ id: product.id, name: productName, price: product.price, image: images[0] })
      toast.success(isAr ? "تمت إضافة الجهاز للمفضلة!" : `${productName} added to wishlist!`)
    }
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: productName,
      price: product.price,
      image: images[0],
      condition: product.condition
    })
    toast.success(isAr ? "تمت إضافة الجهاز إلى السلة!" : `${productName} added to cart!`)
  }

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      name: productName,
      price: product.price,
      image: images[0],
      condition: product.condition
    })
    router.push(isAr ? "/ar/checkout" : "/en/checkout")
  }

  // Parse custom mock specs for specs sheet based on names
  const specs = {
    cpu: productName.includes("M3") ? "Apple M3 Chip" : productName.includes("ASUS") ? "Intel Core i9-14900HX" : "Intel Core Ultra 7",
    ram: productName.includes("Max") ? "48GB Unified Memory" : productName.includes("16\"") || productName.includes("ROG") || productName.includes("Spectre") || productName.includes("ThinkPad") ? "32GB DDR5" : "16GB LPDDR5X",
    storage: productName.includes("SCAR") || productName.includes("Spectre") ? "2TB NVMe SSD" : "1TB PCIe SSD",
    screen: productName.includes("16\"") ? "16.0\" Liquid Retina XDR (3456x2234)" : productName.includes("Zephyrus") ? "14.0\" 3K OLED 120Hz" : "14.0\" 2.8K OLED Touch Screen"
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
      {/* Product Image Gallery (lg:col-span-6) */}
      <div className="space-y-4 lg:col-span-6">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-cyan-500/10 bg-card/25 backdrop-blur-sm">
          <Image
            src={images[activeImageIndex]}
            alt={productName}
            fill
            className="object-cover transition-all duration-300"
            priority
          />
          <button
            onClick={handleWishlistToggle}
            className="absolute right-4 top-4 rounded-full bg-background/80 p-3 backdrop-blur-md transition-all hover:scale-110 hover:bg-background"
          >
            <Heart
              className={`h-6 w-6 transition-colors ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"
              }`}
            />
          </button>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={`relative aspect-[4/3] w-24 overflow-hidden rounded-xl border-2 bg-muted transition-all ${
                  activeImageIndex === i ? "border-cyan-500 scale-95" : "border-cyan-500/10 hover:border-cyan-500/30"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Information (lg:col-span-6) */}
      <div className="flex flex-col justify-between lg:col-span-6">
        <div className="space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-cyan-500/15 text-cyan-500 hover:bg-cyan-500/25">
              {categoryName}
            </Badge>
            <Badge className={product.condition === "NEW" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"}>
              {product.condition === "NEW" ? (isAr ? "جديد" : "New") : (isAr ? "مستعمل" : "Used")}
            </Badge>
            {product.stock > 0 ? (
              <Badge variant="outline" className="border-cyan-500/20 text-cyan-400">
                {isAr ? "متوفر في المخزن" : "In Stock"} ({product.stock})
              </Badge>
            ) : (
              <Badge variant="destructive">
                {isAr ? "نفذت الكمية" : "Out of Stock"}
              </Badge>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">{productName}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isAr ? "العلامة التجارية: " : "Brand: "} <span className="font-semibold text-foreground">{product.brand.name}</span>
            </p>
          </div>

          {/* Pricing & Rating */}
          <div className="flex items-center gap-6 border-y border-cyan-500/10 py-4">
            <div>
              <p className="text-3xl font-black text-cyan-400">${product.price.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{isAr ? "شامل ضريبة القيمة المضافة" : "VAT Included"}</p>
            </div>
            <div className="h-8 w-px bg-cyan-500/10" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(product.rating || 4.5)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted"
                    }`}
                  />
                ))}
                <span className="ml-2 font-bold text-foreground">{product.rating || 4.8}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-0.5">
                {product.reviews.length} {isAr ? "تقييمات العملاء" : "customer reviews"}
              </span>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">{productDesc}</p>

          {/* Key Specs Panel */}
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-cyan-500/5 bg-cyan-500/[0.02] p-4 text-sm">
            <div className="flex items-center gap-3">
              <Cpu className="h-5 w-5 text-cyan-500" />
              <div>
                <p className="text-xs text-muted-foreground">{isAr ? "المعالج" : "Processor"}</p>
                <p className="font-semibold">{specs.cpu}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Layers className="h-5 w-5 text-cyan-500" />
              <div>
                <p className="text-xs text-muted-foreground">{isAr ? "الرامات" : "RAM"}</p>
                <p className="font-semibold">{specs.ram}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HardDrive className="h-5 w-5 text-cyan-500" />
              <div>
                <p className="text-xs text-muted-foreground">{isAr ? "التخزين" : "Storage"}</p>
                <p className="font-semibold">{specs.storage}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Monitor className="h-5 w-5 text-cyan-500" />
              <div>
                <p className="text-xs text-muted-foreground">{isAr ? "الشاشة" : "Display"}</p>
                <p className="font-semibold">{specs.screen}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          {product.stock > 0 ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAddToCart}
                size="lg"
                variant="outline"
                className="flex-1 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/5 hover:border-cyan-500/40"
              >
                <ShoppingCart className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
                {isAr ? "أضف إلى السلة" : "Add to Cart"}
              </Button>
              <Button
                onClick={handleBuyNow}
                size="lg"
                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
              >
                <CreditCard className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
                {isAr ? "اشترِ الآن" : "Buy Now"}
              </Button>
            </div>
          ) : (
            <Button disabled className="w-full bg-muted text-muted-foreground" size="lg">
              {isAr ? "نفذت الكمية" : "Out of Stock"}
            </Button>
          )}

          {/* Secure / Delivery trust badges */}
          <div className="grid grid-cols-3 gap-4 border-t border-cyan-500/10 pt-4 text-center text-xs text-muted-foreground">
            <div className="flex flex-col items-center">
              <ShieldCheck className="mb-1 h-5 w-5 text-cyan-500" />
              <span>{isAr ? "ضمان سنة كاملة" : "1 Year Warranty"}</span>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="mb-1 h-5 w-5 text-cyan-500" />
              <span>{isAr ? "شحن سريع وآمن" : "Fast Secure Shipping"}</span>
            </div>
            <div className="flex flex-col items-center">
              <RefreshCcw className="mb-1 h-5 w-5 text-cyan-500" />
              <span>{isAr ? "استرجاع 14 يوم" : "14 Days Return"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for detailed description and reviews (lg:col-span-12) */}
      <div className="mt-12 lg:col-span-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="border-b border-cyan-500/10 bg-cyan-500/5 p-1 w-full justify-start rounded-xl">
            <TabsTrigger value="description" className="rounded-lg data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
              {isAr ? "تفاصيل إضافية" : "Description Details"}
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-lg data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
              {isAr ? "المراجعات والآراء" : "Reviews"} ({product.reviews.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              {isAr
                ? "يمثل هذا اللابتوب قمة الابتكار التكنولوجي من حيث الأداء وقابلية النقل. صمم خصيصاً ليتحمل أعباء العمل الشاقة مثل تعديل الفيديوهات بدقة عالية والبرمجة المكثفة وتشغيل الألعاب ثلاثية الأبعاد دون أي تباطؤ."
                : "This laptop represents the pinnacle of technology innovation in terms of performance and mobility. Designed specifically to handle heavy workloads such as high-resolution video rendering, compilation, and high-fidelity gaming without any latency."}
            </p>
            <p>
              {isAr
                ? "يأتي الجهاز بهيكل ألومنيوم معزز مقاوم للصدمات، ونظام تبريد حراري متطور بفتحات تهوية متعددة لضمان أداء مستقر ومثالي تحت الضغط الطويل. شاشته تدعم ألواناً مشبعة ودرجات تباين استثنائية لراحة عينيك خلال جلسات العمل الطويلة."
                : "The machine comes encased in an aluminum chassis featuring enhanced thermal cooling grids to deliver consistent performance. Its screen reproduces high-dynamic range content, allowing creatives to accurately review graphics and colors."}
            </p>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6 space-y-6">
            {product.reviews.length === 0 ? (
              <div className="rounded-xl border border-dashed border-cyan-500/10 p-6 text-center text-muted-foreground text-sm">
                {isAr ? "لا توجد مراجعات بعد. كن أول من يضيف مراجعته!" : "No reviews available yet. Be the first to leave a review!"}
              </div>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div key={review.id} className="rounded-2xl border border-cyan-500/10 bg-card/30 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-foreground">{review.user.name || (isAr ? "عميل لاب تك" : "Lap Tec Customer")}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                    <p className="mt-2 text-right text-xs text-muted-foreground/50">
                      {new Date(review.createdAt).toLocaleDateString(locale)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
