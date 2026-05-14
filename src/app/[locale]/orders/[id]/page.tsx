"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle2, 
  Circle, 
  Package, 
  Truck, 
  MapPin, 
  ArrowLeft 
} from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "@/i18n/routing"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const statusSteps = [
  { id: "PENDING", label: "Order Placed", icon: CheckCircle2, date: "May 10, 2024" },
  { id: "PROCESSING", label: "Processing", icon: Package, date: "May 11, 2024" },
  { id: "DELIVERING", label: "In Transit", icon: Truck, date: "May 12, 2024" },
  { id: "DELIVERED", label: "Delivered", icon: MapPin, date: "Pending" },
]

export default function OrderTrackingPage() {
  const { id } = useParams()
  const currentStatus = "DELIVERING" // Mock status

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost" }), "-ml-2 mb-2 w-fit flex items-center")}>
          <ArrowLeft className="mr-2 h-4 w-4 rtl:rotate-180" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order Tracking</h1>
            <p className="text-muted-foreground">Order ID: {id}</p>
          </div>
          <Badge className="w-fit bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500/30">
            In Transit
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Tracking Stepper */}
        <Card className="border-cyan-500/10 bg-card/50">
          <CardHeader>
            <CardTitle>Delivery Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="relative">
              {statusSteps.map((step, i) => {
                const isActive = statusSteps.findIndex(s => s.id === currentStatus) >= i
                const isCurrent = step.id === currentStatus

                return (
                  <div key={step.id} className="mb-8 flex items-start last:mb-0">
                    <div className="relative mr-4 flex flex-col items-center rtl:ml-4 rtl:mr-0">
                      <div
                        className={`z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                          isActive ? "bg-cyan-500 text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <step.icon className="h-5 w-5" />
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div
                          className={`absolute top-10 h-10 w-0.5 ${
                            isActive ? "bg-cyan-500" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className={`font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {step.date}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-cyan-500/10 bg-card/50">
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">Remon Ayman</p>
              <p className="text-sm text-muted-foreground">
                123 Tech Street, Digital District<br />
                Cairo, Egypt<br />
                +20 123 456 7890
              </p>
            </CardContent>
          </Card>
          <Card className="border-cyan-500/10 bg-card/50">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>$1,599.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>$10.00</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-cyan-500">
                <span>Total</span>
                <span>$1,609.00</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
