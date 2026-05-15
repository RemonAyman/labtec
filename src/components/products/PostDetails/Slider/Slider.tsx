import { Card, CardContent } from "@/components/ui/card"
import {
   Carousel,
   CarouselContent,
   CarouselItem,
} from "@/components/ui/carousel"
import Image from "next/image"
import demoItem from "../../../../../public/images/photo-1531297484001-80022131f5a1.avif"
import { Button } from "@/components/ui/button"
import { ShoppingBasketIcon } from "lucide-react"

const Slider = () => {
  return (
    <Carousel
                  opts={{
                     align: "start",
                     loop:true,
                  }}
                  className=""
               >
                  <CarouselContent>
                     {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index} className="md:basic-1/2 lg:basis-1/3">
                           <div className=''>
                              <Card className='p-0'>
                                 <CardContent className="flex p-0 flex-col">
                                    <div className='w-full h-80'>
                                       <Image src={demoItem} className='w-full h-full' width={400} height={350} alt='card' />
                                    </div>
                                    <div className='px-2 py-4'>
                                       <p className='text-md mb-2'>Name of Product</p>
                                       <p className='text-sm text-slate-400'>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                                       <div className='flex items-center justify-between mt-5'>
                                          <p className='text-xl text-sky-300'>$899</p>
                                          <Button variant={"outline"} className={"w-10 h-10 cursor-pointer"}><ShoppingBasketIcon  className='text-2xl h-full w-full' fontSize={"30px"}/></Button>
                                       </div>
                                    </div>
                                 </CardContent>
                              </Card>
                           </div>
                        </CarouselItem>
                     ))}
                  </CarouselContent>
                 
               </Carousel>
  )
}

export default Slider