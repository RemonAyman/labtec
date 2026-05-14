"use client"

import { useWishlist } from "@/store/use-wishlist"
import { ProductCard } from "@/components/products/product-card"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"

export default function WishlistPage() {
  const { items } = useWishlist()

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-cyan-500/10 p-6">
          <Heart className="h-12 w-12 text-cyan-500" />
        </div>
        <h1 className="text-2xl font-bold">Your wishlist is empty</h1>
        <p className="text-muted-foreground">
          Explore our products and save your favorites here.
        </p>
        <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center space-x-4 rtl:space-x-reverse">
        <Heart className="h-8 w-8 text-cyan-500" />
        <h1 className="text-3xl font-bold tracking-tight">Wishlist ({items.length})</h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <ProductCard 
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              category="Laptop"
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
