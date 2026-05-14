"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import { useWishlist } from "@/store/use-wishlist"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  category: string
}

export function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(id)

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeItem(id)
    } else {
      addItem({ id, name, price, image })
    }
  }

  return (
    <Card className="group overflow-hidden border-cyan-500/10 bg-card/50 transition-all hover:border-cyan-500/50">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <button
            onClick={toggleWishlist}
            className="absolute right-3 top-3 rounded-full bg-background/80 p-2 backdrop-blur-md transition-all hover:bg-background"
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
          <p className="text-xs text-cyan-500">{category}</p>
          <h3 className="line-clamp-1 font-semibold">{name}</h3>
          <p className="mt-1 text-lg font-bold text-cyan-500">${price}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
