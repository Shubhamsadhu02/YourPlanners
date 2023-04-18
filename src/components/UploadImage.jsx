import React from 'react'
import { RxCross2 } from 'react-icons/rx'

export default function UploadImage({ setOpenImage }) {
    
  return (
    <>
    <div className="">
            <div className="fixed w-full h-screen top-8  md:top-16 left-0 bg-[#00000030] z-40 flex items-center justify-center">
              <div className="w-[90%] 800px:w-[60%] h-[80vh]  800px:h-[75vh] bg-primary rounded-md shadow-sm relative p-4 pt-10 md:p-4 md:pt-16">
                <RxCross2
                  size={30}
                  className="absolute right-3 top-3 z-50 cursor-pointer"
                  onClick={() => setOpenImage(false)}
                />
                <div className="container">
                <div className=" border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
                    <h3 className='text-2xl font-semibold capitalize text-headingColor'>Upload Image</h3>
                    <div className="group flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-full p-3 cursor-pointer rounded-lg p">
                     </div>
                </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}
