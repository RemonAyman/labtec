"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Loader2, Laptop, Plus, Trash, Image as ImageIcon } from "lucide-react"
import { submitUsedLaptopRequest } from "@/app/actions/laptop-actions"
import { useRouter } from "@/i18n/routing"

const usedLaptopSchema = z.object({
  brand: z.string().min(2, "Brand must be at least 2 characters"),
  model: z.string().min(2, "Model must be at least 2 characters"),
  specs: z.string().min(10, "Please provide detailed specifications (CPU, RAM, Storage, Screen)"),
  condition: z.enum(["EXCELLENT", "GOOD", "FAIR"]),
  images: z.array(z.string().url("Must be a valid image URL")).min(1, "Please provide at least one image URL")
})

type UsedLaptopFormValues = z.infer<typeof usedLaptopSchema>

interface UsedLaptopFormProps {
  locale: string
}

export function UsedLaptopForm({ locale }: UsedLaptopFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [addedImages, setAddedImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"
  ])

  const isAr = locale === "ar"

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UsedLaptopFormValues>({
    resolver: zodResolver(usedLaptopSchema),
    defaultValues: {
      condition: "GOOD",
      images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"]
    }
  })

  const addImage = () => {
    if (!imageUrl) return
    if (!imageUrl.startsWith("http")) {
      toast.error(isAr ? "الرجاء إدخال رابط صورة صحيح يبدأ بـ http" : "Please enter a valid image URL starting with http")
      return
    }
    const newImages = [...addedImages, imageUrl]
    setAddedImages(newImages)
    setValue("images", newImages, { shouldValidate: true })
    setImageUrl("")
    toast.success(isAr ? "تمت إضافة الصورة بنجاح" : "Image added successfully")
  }

  const removeImage = (index: number) => {
    const newImages = addedImages.filter((_, i) => i !== index)
    setAddedImages(newImages)
    setValue("images", newImages, { shouldValidate: true })
    toast.info(isAr ? "تم حذف الصورة" : "Image removed")
  }

  async function onSubmit(data: UsedLaptopFormValues) {
    setIsLoading(true)
    try {
      const response = await submitUsedLaptopRequest(data)
      if (response.error) {
        toast.error(response.error)
      } else {
        toast.success(
          isAr
            ? "تم تقديم طلبك بنجاح! سيقوم فريقنا بمراجعته قريباً."
            : "Your request has been submitted successfully! Our team will review it soon."
        )
        router.push("/dashboard")
      }
    } catch (error) {
      toast.error(isAr ? "حدث خطأ غير متوقع. حاول مرة أخرى." : "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-2xl"
    >
      <Card className="border-cyan-500/20 bg-background/50 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-500">
            <Laptop className="h-6 w-6" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            {isAr ? "بيع لابتوب مستعمل" : "Sell Your Used Laptop"}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            {isAr
              ? "املأ هذا النموذج لطلب تقييم جهازك وعرضه للبيع في سوق لاب تك المميز."
              : "Fill out the form below to request a review for your device and display it on our premium catalog."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brand">{isAr ? "الشركة المصنعة (البراند)" : "Brand"}</Label>
                <Input
                  id="brand"
                  placeholder="e.g. Apple, Dell, ASUS"
                  className="bg-background/50 border-cyan-500/10 focus:border-cyan-500/40"
                  {...register("brand")}
                />
                {errors.brand && (
                  <p className="text-xs text-destructive">{errors.brand.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">{isAr ? "الموديل" : "Model"}</Label>
                <Input
                  id="model"
                  placeholder="e.g. MacBook Pro 14, XPS 15"
                  className="bg-background/50 border-cyan-500/10 focus:border-cyan-500/40"
                  {...register("model")}
                />
                {errors.model && (
                  <p className="text-xs text-destructive">{errors.model.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">{isAr ? "الحالة العامة للجهاز" : "Condition"}</Label>
              <select
                id="condition"
                className="w-full rounded-lg border border-cyan-500/10 bg-background/50 p-2.5 text-sm text-foreground focus:border-cyan-500/40 focus:outline-none"
                {...register("condition")}
              >
                <option value="EXCELLENT">{isAr ? "ممتازة جداً (شبه جديد)" : "Excellent (Like New)"}</option>
                <option value="GOOD">{isAr ? "جيدة جداً (استعمال خفيف)" : "Good (Minor Scratches)"}</option>
                <option value="FAIR">{isAr ? "مقبولة (آثار استخدام واضحة)" : "Fair (Visible Usage)"}</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specs">{isAr ? "المواصفات بالتفصيل" : "Technical Specifications"}</Label>
              <textarea
                id="specs"
                rows={4}
                placeholder={
                  isAr
                    ? "مثال: المعالج Core i7، الرامات 16 جيجا، الهارد 512 SSD، كارت الشاشة Nvidia RTX 3050، حالة البطارية 85%"
                    : "e.g. Intel Core i7 12th Gen, 16GB RAM, 512GB SSD, NVIDIA RTX 3050, Battery health 85%, Screen is flawless..."
                }
                className="w-full rounded-lg border border-cyan-500/10 bg-background/50 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-cyan-500/40 focus:outline-none"
                {...register("specs")}
              />
              {errors.specs && (
                <p className="text-xs text-destructive">{errors.specs.message}</p>
              )}
            </div>

            <div className="space-y-4 rounded-xl border border-cyan-500/10 bg-cyan-500/[0.01] p-4">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-cyan-500" />
                {isAr ? "صور الجهاز (روابط صور)" : "Device Images (URLs)"}
              </Label>
              
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com/laptop-image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="bg-background/50 border-cyan-500/10 focus:border-cyan-500/40 flex-1"
                />
                <Button type="button" onClick={addImage} size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold">
                  <Plus className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                  {isAr ? "إضافة" : "Add"}
                </Button>
              </div>

              {addedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 mt-4">
                  {addedImages.map((url, index) => (
                    <div key={index} className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-cyan-500/20 bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="Uploaded preview" className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 rounded-full bg-red-500/80 p-1.5 text-white hover:bg-red-600"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {errors.images && (
                <p className="text-xs text-destructive">{errors.images.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-base"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0" />}
              {isAr ? "إرسال طلب المراجعة" : "Submit Device for Review"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
