import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { CheckoutForm } from "@/components/forms/checkout-form"
import { getTranslations } from "next-intl/server"

interface CheckoutPageProps {
  params: Promise<{ locale: string }>
}

export default async function CheckoutPage(props: CheckoutPageProps) {
  const { locale } = await props.params
  const session = await auth()

  if (!session?.user?.id) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/checkout`)
  }

  // Fetch user's saved addresses to pre-fill the form
  const savedAddress = await db.address.findFirst({
    where: {
      userId: session.user.id,
      isDefault: true,
    },
  })

  const isAr = locale === "ar"

  return (
    <div className="container min-h-screen py-10 md:py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-cyan-500">
            {isAr ? "إتمام الشراء" : "Checkout"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isAr 
              ? "يرجى تعبئة بيانات الشحن واختيار وسيلة الدفع المناسبة لإتمام طلبك." 
              : "Please fill out your shipping information and payment preference below to complete your order."}
          </p>
        </div>

        <CheckoutForm 
          locale={locale} 
          userEmail={session.user.email || ""}
          defaultAddress={savedAddress ? {
            name: savedAddress.name,
            phone: savedAddress.phone,
            city: savedAddress.city,
            address: savedAddress.address,
          } : undefined}
        />
      </div>
    </div>
  )
}
