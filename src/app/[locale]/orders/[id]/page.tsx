import { auth } from "@/auth"
import { getOrderDetails } from "@/app/actions/order-actions"
import { redirect, notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  ArrowLeft,
  XCircle,
  FileText,
  CreditCard,
  Receipt
} from "lucide-react"
import { Link } from "@/i18n/routing"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getTranslations } from "next-intl/server"
import Image from "next/image"

interface OrderTrackingPageProps {
  params: Promise<{ id: string; locale: string }>
}

export default async function OrderTrackingPage(props: OrderTrackingPageProps) {
  const { id, locale } = await props.params
  const session = await auth()

  if (!session?.user?.id) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/orders/${id}`)
  }

  const order = await getOrderDetails(id)

  if (!order) {
    notFound()
  }

  const isAr = locale === "ar"
  const t = await getTranslations("OrderTracking")
  const tCommon = await getTranslations("Common")
  const tDash = await getTranslations("Dashboard")

  const currentStatus = order.status

  // Map order status to steps
  const statusSteps = [
    { id: "PENDING",    label: isAr ? "تم استلام طلبك" : "Order Placed",  icon: CheckCircle2 },
    { id: "PROCESSING", label: isAr ? "جاري التجهيز والفحص" : "Processing",   icon: Package },
    { id: "DELIVERING", label: isAr ? "شحن الجهاز وتوصيله" : "In Transit",    icon: Truck },
    { id: "DELIVERED",  label: isAr ? "تم التوصيل بنجاح" : "Delivered",    icon: MapPin },
  ]

  const isCancelled = currentStatus === "CANCELLED"
  const activeIndex = statusSteps.findIndex(s => s.id === currentStatus)

  // Payment status badge formatting
  const getPaymentStatusBadge = () => {
    if (order.paymentStatus === "PAID") {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/10">
          {isAr ? "مدفوع بالكامل" : "Paid"}
        </Badge>
      )
    }
    if (order.paymentStatus === "COD") {
      return (
        <Badge className="bg-amber-500/20 text-amber-500 border border-amber-500/10">
          {isAr ? "الدفع عند الاستلام" : "Cash on Delivery"}
        </Badge>
      )
    }
    return (
      <Badge className="bg-red-500/20 text-red-500 border border-red-500/10">
        {isAr ? "غير مدفوع" : "Unpaid"}
      </Badge>
    )
  }

  // Format creation date
  const orderDate = new Date(order.createdAt).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  // Estimated delivery: 3 days from checkout
  const estimatedDate = new Date(order.createdAt)
  estimatedDate.setDate(estimatedDate.getDate() + 3)
  const estFormatted = estimatedDate.toLocaleDateString(isAr ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  return (
    <div className="container max-w-4xl py-10 md:py-16 space-y-8">
      {/* Navigation and Order Header */}
      <div>
        <Link 
          href="/dashboard" 
          className={cn(buttonVariants({ variant: "ghost" }), "mb-6 inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-400")}
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {tDash("title")}
        </Link>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
              {t("title")}
              <span className="text-cyan-500">#{order.id.slice(-6).toUpperCase()}</span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {isAr ? "تاريخ الطلب: " : "Placed on: "} {orderDate}
            </p>
            {!isCancelled && (
              <p className="text-cyan-500/80 mt-1 text-sm font-semibold">
                {t("estimatedDelivery")}: {estFormatted}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {getPaymentStatusBadge()}
            {isCancelled ? (
              <Badge variant="destructive" className="bg-red-500/20 text-red-500 border border-red-500/10">
                {isAr ? "ملغي" : "Cancelled"}
              </Badge>
            ) : (
              <Badge className="bg-cyan-500/20 text-cyan-500 border border-cyan-500/10">
                {isAr ? "نشط" : "Active"}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Tracking Stepper */}
        {isCancelled ? (
          <Card className="border-red-500/20 bg-red-500/5 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center gap-3">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <CardTitle className="text-red-500">{isAr ? "تم إلغاء الطلب" : "Order Cancelled"}</CardTitle>
                <CardDescription>
                  {isAr 
                    ? "تم إلغاء هذا الطلب. إذا كان لديك أي استفسار يرجى التواصل مع الدعم." 
                    : "This order has been cancelled. For details, please contact customer support."}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <Card className="border-cyan-500/10 bg-card/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-500" />
                {isAr ? "حالة توصيل الطلب" : "Real-time Order Status"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-4 md:items-center">
                {/* Horizontal progress bar for larger screens */}
                <div className="absolute left-[20px] top-[20px] right-[20px] h-[3px] bg-cyan-500/10 -z-10 hidden md:block" />
                
                {statusSteps.map((step, i) => {
                  const isActive = activeIndex >= i
                  const isCurrent = activeIndex === i
                  
                  return (
                    <div key={step.id} className="flex md:flex-col items-center gap-4 md:text-center flex-1 relative">
                      {/* Vertical line for mobile */}
                      {i < statusSteps.length - 1 && (
                        <div className={cn(
                          "absolute left-5 top-10 w-[2px] h-10 -z-10 md:hidden",
                          isActive ? "bg-cyan-500" : "bg-cyan-500/10"
                        )} />
                      )}

                      <div className={cn(
                        "z-10 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 shadow-md shadow-black/50",
                        isCurrent ? "bg-cyan-500 border-cyan-500 text-white ring-4 ring-cyan-500/20 scale-110" :
                        isActive ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-500" :
                        "bg-background border-cyan-500/10 text-muted-foreground"
                      )}>
                        <step.icon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex flex-col md:items-center">
                        <span className={cn(
                          "text-sm font-bold",
                          isCurrent ? "text-cyan-500" :
                          isActive ? "text-foreground" :
                          "text-muted-foreground"
                        )}>
                          {step.label}
                        </span>
                        {isActive && isCurrent && (
                          <span className="text-[10px] text-cyan-500/80 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full mt-1 w-fit">
                            {isAr ? "الحالة الحالية" : "Current Step"}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dynamic details breakdown */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Shipping details */}
          <Card className="border-cyan-500/10 bg-card/40 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center gap-2">
              <MapPin className="h-5 w-5 text-cyan-500" />
              <CardTitle className="text-md">{t("shippingAddress")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-bold text-foreground text-md">{order.address.name}</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {order.address.address}<br />
                  {order.address.city}, {isAr ? "مصر" : "Egypt"}<br />
                </p>
                <p className="text-sm font-semibold text-cyan-500 mt-2">
                  {isAr ? "رقم الهاتف: " : "Phone: "} {order.address.phone}
                </p>
              </div>
              <div className="border-t border-cyan-500/10 pt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{isAr ? "نوع الاستلام: " : "Delivery method: "}</span>
                <span className="font-bold text-cyan-500/90">
                  {order.total - order.items.reduce((acc, it) => acc + it.price * it.quantity, 0) > 0 
                    ? (isAr ? "توصيل سريع للمنزل" : "Home Delivery") 
                    : (isAr ? "استلام من الفرع" : "Store Pickup")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Cart item pricing summary */}
          <Card className="border-cyan-500/10 bg-card/40 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center gap-2">
              <Receipt className="h-5 w-5 text-cyan-500" />
              <CardTitle className="text-md">{t("orderSummary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product items loop */}
              <div className="space-y-3 max-h-36 overflow-y-auto pr-1">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      {item.product.images[0]?.url && (
                        <div className="h-10 w-10 relative overflow-hidden rounded bg-cyan-950/20 border border-cyan-500/5">
                          <Image 
                            src={item.product.images[0].url} 
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-foreground text-xs line-clamp-1 max-w-[150px]">
                          {isAr && item.product.nameAr ? item.product.nameAr : item.product.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">{item.quantity} x {item.price} {isAr ? "ج.م" : "EGP"}</span>
                      </div>
                    </div>
                    <span className="font-bold text-foreground">
                      {item.price * item.quantity} {isAr ? "ج.م" : "EGP"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order total math */}
              <div className="space-y-2 pt-3 border-t border-cyan-500/10 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("subtotal")}</span>
                  <span>{order.items.reduce((acc, it) => acc + it.price * it.quantity, 0)} {isAr ? "ج.م" : "EGP"}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("shipping")}</span>
                  <span>
                    {order.total - order.items.reduce((acc, it) => acc + it.price * it.quantity, 0) > 0
                      ? `${order.total - order.items.reduce((acc, it) => acc + it.price * it.quantity, 0)} ${isAr ? 'ج.م' : 'EGP'}`
                      : (isAr ? 'مجاني' : 'Free')
                    }
                  </span>
                </div>
                <div className="flex justify-between border-t border-cyan-500/15 pt-2 text-sm font-bold text-cyan-500">
                  <span>{t("total")}</span>
                  <span>{order.total} {isAr ? "ج.م" : "EGP"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
