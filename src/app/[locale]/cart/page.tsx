import Image from "next/image"
import demo from "../../../../public/images/photo-1531297484001-80022131f5a1.avif"
import { ArrowRight, CircleX } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const CartPage = () => {
   return (
      <div className='p-6 md:p-8'>
         <h2 className="text-3xl font-bold mb-5">Review Order</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-wrap">
            <div className="rounded bg-amber-900/50 p-4 flex gap-3">
               <Image className="rounded shadow" src={demo} width={170} height={170} alt="product-image" />
               <div>
                  <h2 className="mb-5 text-xl font-semibold">Title of product</h2>
                  <p className="text-gray-400">32 GB Ram . 128 GB ssd . RTX 3060</p>
                  <div className="border rounded-2xl py-3 mt-5 px-6 flex items-center justify-between">
                     <button className="cursor-pointer text-2xl font-bold hover:scale-125 transition-all">-</button>
                     <span className="font-semibold text-2xl">1</span>
                     <button className="cursor-pointer text-2xl font-bold hover:scale-125 transition-all">+</button>
                  </div>
               </div>
               <div className="flex flex-col items-center  gap-3">
                  <button className="cursor-pointer hover:scale-125 transition-all hover:text-red-800"><CircleX /></button>
                  <p className="text-2xl font-semibold text-sky-600">1200$</p>
               </div>

            </div>
            



         </div>
         <hr  className="mt-12"/>
         <div className="mt-7">
            <h2 className="text-3xl font-bold mb-5 uppercase">promotions</h2>
            <div className="flex items-baseline gap-5">
               <Input className="p-6 text-xl" type="text" placeholder="Enter code"/>
               <Button className={"p-6 cursor-pointer"} variant={"outline"}>Apply</Button>
            </div>
         </div>
         <div className="mt-7">
            <div className="flex flex-col gap-5">
               <div className="flex justify-between items-center">
                  <p className="text-2xl font-semibold capitalize text-gray-400">sub total </p>
                  <p className="text-2xl font-semibold capitalize">20394$</p>
               </div>
               <div className="flex justify-between items-center">
                  <p className="text-2xl font-semibold capitalize text-gray-400">delivering </p>
                  <p className="text-2xl font-semibold capitalize">free</p>
               </div>
               <div className="flex justify-between items-center">
                  <p className="text-2xl font-semibold capitalize text-gray-400">Tax </p>
                  <p className="text-2xl font-semibold capitalize">234$</p>
               </div>
            </div>
         </div>
         <hr  className="mt-12"/>

         <div className="fixed bottom-0 z-20 bg-gray-900 flex items-center justify-center gap-10 right-0 left-0 py-5 shadow-lg backdrop:shadow-2xl">
            <div>
               <p >Total</p>
               <p className="text-2xl font-semibold">$23845</p>
            </div>
            <Button className={"p-7 cursor-pointer text-xl"} variant={"secondary"}>Checkout <ArrowRight /></Button>
         </div>
      </div>
   )
}

export default CartPage