
import Slider from '@/components/products/PostDetails/Slider/Slider';
import React from 'react'
import ProgressTimeLineStper from '@/components/Cart/ProgressTimeLineStper';

const CheckoutLayout = ({ children }: { children: React.ReactNode; }) => {
  
  return (
    <div className='container mx-auto'>
      {/* Step progress */}
      <ProgressTimeLineStper />
      {children}
      {/* section for might like */}
      <div className='px-10'>
      <h2 className='text-3xl font-bold mb-5'>You Might Need</h2>
      <Slider />
      </div>
    </div>
  )
}

export default CheckoutLayout