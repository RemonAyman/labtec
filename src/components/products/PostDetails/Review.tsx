import Image from 'next/image'
import user from '../../../../public/images/rev-1.jpg'

const Review = () => {
   return (
      <div className='p-4 rounded-2xl bg-black/90'>


         <div className='flex gap-2 mb-2 flex-wrap'>
            {/* account info */}
            <div className='w-11 h-11 rounded-full'>
               <Image src={user} className='rounded-full w-full h-full' alt="user-profile" width={30} height={30} />
            </div>
            <div>
               <p className='capitalize'>Omar Shawky</p>
               {/* date time he wrote a comment */}
               <span className='text-sm text-gray-400'>2 days ago</span>
            </div>
            {/* rate */}
            <div>
               {/* stars rating  */}
            </div>

         </div>
         <p className='text-sm leading-7'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, tenetur dicta quaerat temporibus saepe ratione delectus porro consequatur ad. Placeat possimus dolorum commodi numquam. Voluptates, sit enim. Officiis inventore tempora ipsum accusantium voluptate beatae odio impedit at laborum sapiente accusamus unde est, error dolor iste? Mollitia delectus qui aperiam libero?</p>
      </div>
   )
}

export default Review