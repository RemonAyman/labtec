"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { useCart } from "@/store/use-cart"
import { placeOrder } from "@/app/actions/order-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  ShoppingBag, 
  Phone, 
  User, 
  Building,
  Store,
  ChevronRight,
  ShieldCheck,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const checkoutSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number (at least 10 digits)." }),
  city: z.string().min(2, { message: "City name is required." }),
  address: z.string().min(5, { message: "Please specify a detailed street address." }),
  fulfillment: z.enum(["DELIVERY", "PICKUP"]),
  paymentMethod: z.enum(["STRIPE", "COD"]),
})

type CheckoutSchema = z.infer<typeof checkoutSchema>

interface CheckoutFormProps {
  locale: string
  userEmail: string
  defaultAddress?: {
    name: string
    phone: string
    city: string
    address: string
  }
}

export function CheckoutForm({ locale, userEmail, defaultAddress }: CheckoutFormProps) {
  const router = useRouter()
  const { items, getCartTotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isAr = locale === "ar"
  const cartTotal = getCartTotal()
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: defaultAddress?.name || "",
      phone: defaultAddress?.phone || "",
      city: defaultAddress?.city || "",
      address: defaultAddress?.address || "",
      fulfillment: "DELIVERY",
      paymentMethod: "STRIPE",
    },
  })

  const watchedFulfillment = watch("fulfillment")
  const watchedPaymentMethod = watch("paymentMethod")

  // standard EGP pricing or USD standard
  const shippingCost = watchedFulfillment === "DELIVERY" ? 150 : 0
  const orderTotal = cartTotal + shippingCost

  const onSubmit = async (data: CheckoutSchema) => {
    if (items.length === 0) {
      toast.error(isAr ? "سلة المشتريات فارغة!" : "Your cart is empty!")
      return
    }

    setIsSubmitting(true)
    
    // Structure order inputs
    const orderItems = items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }))

    const result = await placeOrder({
      name: data.name,
      phone: data.phone,
      city: data.city,
      address: data.address,
      fulfillment: data.fulfillment,
      paymentMethod: data.paymentMethod,
      items: orderItems,
    })

    if (result.error) {
      toast.error(result.error)
      setIsSubmitting(false)
      return
    }

    toast.success(isAr ? "تم تسجيل طلبك بنجاح!" : "Order placed successfully!")

    // Clear client-side cart
    clearCart()

    if (data.paymentMethod === "STRIPE" && result.stripeUrl) {
      // Redirect to Stripe checkout
      toast.loading(isAr ? "جاري توجيهك لبوابة الدفع..." : "Redirecting to payment gateway...")
      window.location.href = result.stripeUrl
    } else {
      // COD Order redirect directly to Order tracking details
      router.push(`/${locale}/orders/${result.orderId}?status=cod`)
    }
  }

  if (items.length === 0) {
    return (
      <Card className="border-cyan-500/10 bg-card/40 backdrop-blur-xl p-8 text-center max-w-md mx-auto">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4 animate-bounce" />
        <h2 className="text-xl font-bold">
          {isAr ? "سلة المشتريات فارغة" : "Your Cart is Empty"}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          {isAr 
            ? "لا يمكنك إتمام الشراء بدون إضافة أجهزة لابتوب في السلة أولاً." 
            : "You must add laptops to your cart before proceeding to checkout."}
        </p>
        <Button 
          onClick={() => router.push(`/${locale}/products`)} 
          className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        >
          {isAr ? "تصفح أجهزة اللابتوب" : "Browse Laptops"}
        </Button>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-3">
      {/* Checkout Steps */}
      <div className="lg:col-span-2 space-y-6">
        {/* Step 1: Shipping Details */}
        <Card className="border-cyan-500/10 bg-card/40 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-500">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {isAr ? "بيانات التوصيل والشحن" : "Shipping & Contact Info"}
              </CardTitle>
              <CardDescription>
                {isAr ? "يرجى كتابة العنوان والاسم بدقة لضمان وصول الطلب سرياً." : "Provide accurate details for flawless delivery."}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-cyan-500" />
                  {isAr ? "الاسم الكامل" : "Full Name"}
                </Label>
                <div className="relative">
                  <Input 
                    id="name" 
                    placeholder={isAr ? "مثال: أحمد محمد علي" : "e.g., John Doe"}
                    {...register("name")}
                    className={`bg-background/50 pl-3 ${errors.name ? 'border-red-500/50' : 'border-cyan-500/10'}`}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500 font-semibold">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-cyan-500" />
                  {isAr ? "رقم الهاتف" : "Phone Number"}
                </Label>
                <Input 
                  id="phone" 
                  placeholder={isAr ? "مثال: 01012345678" : "e.g., 01012345678"} 
                  {...register("phone")}
                  className={`bg-background/50 ${errors.phone ? 'border-red-500/50' : 'border-cyan-500/10'}`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 font-semibold">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-cyan-500" />
                  {isAr ? "المحافظة / المدينة" : "City / State"}
                </Label>
                <Input 
                  id="city" 
                  placeholder={isAr ? "مثال: القاهرة" : "e.g., Cairo"} 
                  {...register("city")}
                  className={`bg-background/50 ${errors.city ? 'border-red-500/50' : 'border-cyan-500/10'}`}
                />
                {errors.city && (
                  <p className="text-xs text-red-500 font-semibold">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-500" />
                  {isAr ? "العنوان بالتفصيل" : "Street Address"}
                </Label>
                <Input 
                  id="address" 
                  placeholder={isAr ? "مثال: 15 شارع النصر، المعادي" : "e.g., 15 El-Nasr St, Maadi"} 
                  {...register("address")}
                  className={`bg-background/50 ${errors.address ? 'border-red-500/50' : 'border-cyan-500/10'}`}
                />
                {errors.address && (
                  <p className="text-xs text-red-500 font-semibold">{errors.address.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Fulfillment & Store pickup choice */}
        <Card className="border-cyan-500/10 bg-card/40 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-500">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {isAr ? "طريقة الاستلام" : "Fulfillment Method"}
              </CardTitle>
              <CardDescription>
                {isAr ? "اختر استلام اللابتوب من فرعنا أو التوصيل المباشر لمنزلك." : "Choose direct delivery or store collection."}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Delivery */}
              <div 
                onClick={() => setValue("fulfillment", "DELIVERY")}
                className={`relative flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all duration-300 ${
                  watchedFulfillment === "DELIVERY" 
                    ? "border-cyan-500 bg-cyan-500/5 text-cyan-500" 
                    : "border-cyan-500/10 hover:bg-cyan-500/5 hover:border-cyan-500/30"
                }`}
              >
                <Truck className="h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold">{isAr ? "توصيل سريع للمنزل" : "Home Delivery"}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isAr ? "توصيل آمن لباب البيت خلال 24-48 ساعة" : "Delivered safely in 24-48 hours."}
                  </p>
                  <span className="text-xs font-semibold mt-2 inline-block">
                    {isAr ? "+150 ج.م مصاريف شحن" : "+150 EGP delivery fee"}
                  </span>
                </div>
              </div>

              {/* Pickup */}
              <div 
                onClick={() => setValue("fulfillment", "PICKUP")}
                className={`relative flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all duration-300 ${
                  watchedFulfillment === "PICKUP" 
                    ? "border-cyan-500 bg-cyan-500/5 text-cyan-500" 
                    : "border-cyan-500/10 hover:bg-cyan-500/5 hover:border-cyan-500/30"
                }`}
              >
                <Store className="h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold">{isAr ? "استلام من فرع لاب تك" : "Store Pickup"}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isAr ? "استلم جهازك فوراً وفحصه بنفسك مجاناً" : "Collect your device directly for free."}
                  </p>
                  <span className="text-xs font-semibold mt-2 inline-block text-cyan-500">
                    {isAr ? "مجاني" : "Free"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Payment Method */}
        <Card className="border-cyan-500/10 bg-card/40 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-500">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {isAr ? "طريقة الدفع" : "Payment Method"}
              </CardTitle>
              <CardDescription>
                {isAr ? "الدفع الآمن بالبطاقات الائتمانية أو الدفع عند الاستلام." : "Secure Stripe card checkout or COD."}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Stripe */}
              <div 
                onClick={() => setValue("paymentMethod", "STRIPE")}
                className={`relative flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all duration-300 ${
                  watchedPaymentMethod === "STRIPE" 
                    ? "border-cyan-500 bg-cyan-500/5 text-cyan-500" 
                    : "border-cyan-500/10 hover:bg-cyan-500/5 hover:border-cyan-500/30"
                }`}
              >
                <CreditCard className="h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold">{isAr ? "دفع بالبطاقة (Stripe)" : "Credit Card / Stripe"}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isAr ? "دفع مشفر وآمن 100% يدعم فيزا وماستركارد" : "100% encrypted, Visa/Mastercard support."}
                  </p>
                </div>
              </div>

              {/* COD */}
              <div 
                onClick={() => setValue("paymentMethod", "COD")}
                className={`relative flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all duration-300 ${
                  watchedPaymentMethod === "COD" 
                    ? "border-cyan-500 bg-cyan-500/5 text-cyan-500" 
                    : "border-cyan-500/10 hover:bg-cyan-500/5 hover:border-cyan-500/30"
                }`}
              >
                <Store className="h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold">{isAr ? "الدفع عند الاستلام" : "Cash on Delivery"}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isAr ? "ادفع نقداً عند استلام الجهاز من المندوب" : "Pay in cash during delivery."}
                  </p>
                </div>
              </div>
            </div>

            {watchedPaymentMethod === "COD" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-500 flex items-start gap-3"
              >
                <ShieldCheck className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold block mb-1">
                    {isAr ? "ملاحظة هامة للطلبات النقدية:" : "Important COD Notice:"}
                  </span>
                  {isAr 
                    ? "لتأكيد طلبات الدفع عند الاستلام، سيقوم فريق خدمة عملاء لاب تك بالتواصل معك هاتفياً لتأكيد الطلب وشحن الجهاز فوراً." 
                    : "To ensure fast processing, our support team will contact you via phone shortly to confirm your COD request before dispatching."}
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cart Summary Panel */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="border-cyan-500/10 bg-card/30 backdrop-blur-xl sticky top-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{isAr ? "ملخص طلبك" : "Order Summary"}</span>
              <ShoppingBag className="h-5 w-5 text-cyan-500 animate-pulse" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Items List */}
            <div className="divide-y divide-cyan-500/10 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between py-3 text-sm">
                  <div className="space-y-1">
                    <span className="font-semibold text-foreground line-clamp-1 max-w-[150px]">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{item.quantity} x</span>
                      <span className="text-xs text-cyan-500 font-semibold">{item.price} {isAr ? "ج.م" : "EGP"}</span>
                    </div>
                  </div>
                  <span className="font-bold mt-1 text-foreground">
                    {item.price * item.quantity} {isAr ? "ج.م" : "EGP"}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-3 pt-3 border-t border-cyan-500/10 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
                <span>{cartTotal} {isAr ? "ج.م" : "EGP"}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{isAr ? "الشحن والتوصيل" : "Shipping"}</span>
                <span>{shippingCost > 0 ? `${shippingCost} ${isAr ? 'ج.م' : 'EGP'}` : (isAr ? 'مجاني' : 'Free')}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-cyan-500/15 pt-3 text-cyan-500">
                <span>{isAr ? "الإجمالي الكلي" : "Grand Total"}</span>
                <span>{orderTotal} {isAr ? "ج.م" : "EGP"}</span>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/30 p-3 rounded-lg border border-cyan-500/5">
              <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span>
                {isAr 
                  ? "تسوق آمن ومحمي 100%. يتم حماية بياناتك وتشفيرها بالكامل." 
                  : "Safe & Secure. Complete customer protection and encryption."}
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-md rounded-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {isAr ? "جاري تجهيز طلبك..." : "Processing your order..."}
                </>
              ) : (
                <>
                  {isAr ? "تأكيد وإرسال الطلب" : "Place Order"}
                  <ChevronRight className={`h-5 w-5 ${isAr ? 'rotate-180' : ''}`} />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
