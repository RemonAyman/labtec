"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import { useWishlist } from "@/store/use-wishlist"
import { useCart } from "@/store/use-cart"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  category: string
  condition?: string
}

export function ProductCard({ id, name, price, image, category, condition = "NEW" }: ProductCardProps) {
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { addItem: addToCart } = useCart()
  const isWishlisted = isInWishlist(id)
  const t = useTranslations("Navigation")

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(id)
      toast.info(`${name} removed from wishlist`)
    } else {
      addToWishlist({ id, name, price, image })
      toast.success(`${name} added to wishlist!`)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({ id, name, price, image, condition })
    toast.success(`${name} added to cart!`)
  }

  return (
    <Card className="group overflow-hidden border-cyan-500/10 bg-card/50 transition-all hover:border-cyan-500/50 hover:shadow-cyan-500/5 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={image || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
          <span className={cn(
            "absolute left-3 top-3 rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md",
            condition === "NEW" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
          )}>
            {condition === "NEW" ? "New" : "Used"}
          </span>
          <button
            onClick={toggleWishlist}
            className="absolute right-3 top-3 rounded-full bg-background/80 p-2 backdrop-blur-md transition-all hover:bg-background hover:scale-110"
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )}
            />
          </button>
        </div>
        <div className="p-4">
          <p className="text-xs text-cyan-500 font-medium uppercase tracking-wider">{category}</p>
          <h3 className="mt-1 line-clamp-1 font-semibold text-lg tracking-tight group-hover:text-cyan-400 transition-colors">{name}</h3>
          <p className="mt-2 text-2xl font-black text-cyan-400">${price.toLocaleString()}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all">
          <ShoppingCart className="mr-2 h-4 w-4" />
          {t("cart")}
        </Button>
      </CardFooter>
    </Card>
  )
}

