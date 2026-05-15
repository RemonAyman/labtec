import Image from 'next/image'
import demoItem from "../../../../../public/images/photo-1531297484001-80022131f5a1.avif"
import { Check, CircleCheckBig, ShoppingBasket } from 'lucide-react'
import { Button } from '@/components/ui/button'

import Slider from '@/components/products/PostDetails/Slider/Slider'
import Review from '@/components/products/PostDetails/Review'

interface Props {
   params: Promise<{ productId: string }>
}

const ProductDetails = async ({ params }: Props) => {
   // get params
   const {productId} = await params
   console.log(productId)
   return (
      <div className='container mx-auto py-10'>

         {/* first section */}
         <div className='flex flex-col md:flex-row'>

            <div className='flex flex-2 flex-col gap-6 mb-10 px-6'>
               <Image src={demoItem} className='rounded-2xl shadow-sm shadow-slate-300' alt='item' width={800} height={500} />
               <div className='flex items-center gap-3 flex-wrap justify-center'>
                  <Image src={demoItem} className='rounded-2xl border  hover:border hover:shadow transition-all cursor-pointer' alt='item' width={100} height={100} />
                  <Image src={demoItem} className='rounded-2xl   hover:border hover:shadow transition-all cursor-pointer' alt='item' width={100} height={100} />
                  <Image src={demoItem} className='rounded-2xl  hover:border hover:shadow transition-all cursor-pointer ' alt='item' width={100} height={100} />
                  <Image src={demoItem} className='rounded-2xl  hover:border hover:shadow transition-all cursor-pointer' alt='item' width={100} height={100} />
               </div>
            </div>

            <div className='flex flex-1 flex-col px-6'>
               <h2 className='font-bold text-5xl mb-9'>Lorem ipsum dolor sit amet consectetur.</h2>
               <div className='flex items-center gap-7 mb-7'>
                  <h2 className='text-5xl font-bold text-sky-500'>$1,100</h2>
                  <del className='text-2xl text-gray-500'>$1,400</del>
               </div>

               <div className='flex flex-col w-full gap-4 mb-9'>
                  <button className='bg-sky-500 flex items-center justify-center gap-1 hover:bg-sky-600 transition-all rounded py-3 cursor-pointer text-black border hover:shadow font-semibold'><ShoppingBasket /> Add To Cart</button>
                  <button className='bg-white hover:bg-slate-200 transition-all rounded py-3 cursor-pointer text-black  border hover:shadow font-semibold'>Buy Now</button>
                  <button className='bg-black/90 rounded py-3 hover:bg-black/20 transition-all cursor-pointer text-white  border hover:shadow font-semibold'>Connect By WhatsApp</button>
               </div>

               <div className='p-2'>
                  <p className='capitalize text-gray-400 mb-2'>core specifition</p>
                  <div className='grid grid-cols-1 md:grid-cols-2 mb-9 gap-5'>
                     <div className='p-4 flex flex-col items-start justify-center gap-3 bg-black border rounded-xl'>
                        <p className='text-sky-300 font-semibold'>CPU</p>
                        <p>intel core i5-12938</p>
                     </div>
                     <div className='p-4 flex flex-col items-start justify-center gap-3 bg-black border rounded-xl'>
                        <p className='text-sky-300 font-semibold'>CPU</p>
                        <p>intel core i5-12938</p>
                     </div>
                     <div className='p-4 flex flex-col items-start justify-center gap-3 bg-black border rounded-xl'>
                        <p className='text-sky-300 font-semibold'>CPU</p>
                        <p>intel core i5-12938</p>
                     </div>
                     <div className='p-4 flex flex-col items-start justify-center gap-3 bg-black border rounded-xl'>
                        <p className='text-sky-300 font-semibold'>CPU</p>
                        <p>intel core i5-12938</p>
                     </div>


                  </div>
               </div>

               <div className='p-4 bg-black/40 rounded mb-12'>
                  <h3 className="flex items-center gap-2 text-2xl font-bold"><CircleCheckBig className='text-orange-400' /> Condition: Grade A++</h3>
                  <p className='text-sm my-5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore harum incidunt quidem doloribus est nulla fuga veniam quisquam adipisci magni perspiciatis vero dolorem accusantium eaque explicabo, officiis impedit repellendus ullam.</p>
                  <ul>
                     <li className='flex items-center gap-2'><Check className='text-green-500 h-4 w-4' /> point one</li>
                     <li className='flex items-center gap-2 my-3'><Check className='text-green-500 h-4 w-4' /> point one</li>
                     <li className='flex items-center gap-2 '><Check className='text-green-500 h-4 w-4' /> point one</li>
                  </ul>
               </div>

            </div>
         </div>

         {/* second section */}
         <div className='mb-10 px-2 md:px-6'>

            <div className='p-1 border-l-sky-500 border-l-3 mb-4'>
               <h2 className='ml-2'>Technical Breakdown</h2>
            </div>
            <div className='p-2 bg-black rounded-xl border'>

               <div className='flex space-x-7 py-3 border-b '>
                  <p className='uppercase text-gray-400'>Display</p>
                  <p className='capitalize text-gray-400'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, atque?</p>
               </div>
               <div className='flex space-x-7 py-3 border-b'>
                  <p className='uppercase text-gray-400'>Display</p>
                  <p className='capitalize text-gray-400'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, atque?</p>
               </div>
               <div className='flex space-x-7 py-3 border-b'>
                  <p className='uppercase text-gray-400'>Display</p>
                  <p className='capitalize text-gray-400'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, atque?</p>
               </div>
               <div className='flex space-x-7 py-3 border-b'>
                  <p className='uppercase text-gray-400'>Display</p>
                  <p className='capitalize text-gray-400'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, atque?</p>
               </div>
               <div className='flex space-x-7 py-3'>
                  <p className='uppercase text-gray-400'>Display</p>
                  <p className='capitalize text-gray-400'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, atque?</p>
               </div>


            </div>
         </div>

         {/* third section */}
         <div className='p-2 md:p-6 mb-9'>
            <div>
               <div className='flex items-center justify-between mb-6'>
                  <div>
                     <h2 className='text-2xl font-semibold capitalize'>customers voices</h2>
                     <p className='text-sm font-semibold text-slate-400 capitalize'>real expericenses from verified power users</p>
                  </div>
                  <Button className={"cursor-pointer bg-sky-800/0 border-sky-700 shadow hover:shadow-sky-600 text-white font-semibold hover:bg-sky-800 transition"}>Write a review</Button>
               </div>

               <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <Review />
                  <Review />
               </div>

            </div>
         </div>

         {/* fourth section */}
         <div className='mb-7 p-4 md:p-6'>
            <h2 className='font-bold capitalize text-xl mb-6'>You might also like</h2>
            <div className='px-10 '>
               {/* slider for products */}
               <Slider />
            </div>
         </div>
      </div>
   )
}

export default ProductDetails