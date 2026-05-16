"use client"

import { progressStepCart } from "@/utils"
import { usePathname } from "next/navigation"


const ProgressTimeLineStper = () => {
   const pathname = usePathname()

   // اسم الصفحة الحالية
   const currentPath = pathname.split("/").pop()

   // ترتيب الصفحات
   const steps = ["cart", "details", "payment"]

   // index الصفحة الحالية
   const currentStepIndex = steps.indexOf(currentPath || "")

   return (
      <div className='flex items-center justify-around px-5 md:px-10 py-8'>

         {progressStepCart.map((step, index) => {

            const isActive = index <= currentStepIndex

            return (
               <div key={step.id} className='flex items-center gap-5'>

                  <div className='flex flex-col gap-3 items-center'>

                     <div
                        className={`
                           font-bold text-2xl border rounded-full 
                           w-20 h-20 flex items-center justify-center
                           ${isActive
                              ? "bg-sky-600 text-white border-sky-600"
                              : ""}
                        `}
                     >
                        {step.id}
                     </div>

                     <h2
                      
                     >
                        {step.title}
                     </h2>

                  </div>

               </div>
            )
         })}
      </div>
   )
}

export default ProgressTimeLineStper