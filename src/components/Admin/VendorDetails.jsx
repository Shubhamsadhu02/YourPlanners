import React from 'react'
import { RxCross2 } from 'react-icons/rx'

export default function VendorDetails({ setOpen, data }) {
  return (
    <>
    {
        data ? (
            <>
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-75">
                <div className="bg-white p-8 rounded-lg">
                <RxCross2
                  size={30}
                  className="float-right mb-6 cursor-pointer"
                  onClick={() => setOpen(false)}
                />
                    <div className="flex items-center mt-16">
                        <h3 className='font-bold mr-4 text-textColor'>First Name: </h3><p className=' capitalize'>{data.firstName}</p>
                    </div>
                    <div className="flex items-center mt-4">
                        <h3 className='font-bold mr-4 text-textColor'>Last Name: </h3><p className=' capitalize'>{data.lastName}</p>
                    </div>
                    <div className="flex items-center mt-4">
                        <h3 className='font-bold mr-4 text-textColor'>Company Name: </h3><p className=' capitalize'>{data.company}</p>
                    </div>
                    <div className="flex items-center mt-4">
                        <h3 className='font-bold mr-4 text-textColor'>Register As: </h3><p className=' capitalize'>{data.register}</p>
                    </div>
                    <div className="flex items-center mt-4">
                        <h3 className='font-bold mr-4 text-textColor'>Email: </h3><p className=' capitalize'>{data.email}</p>
                    </div>
                    <div className="flex items-center mt-4">
                        <h3 className='font-bold mr-4 text-textColor'>Contact No: </h3><p className=' capitalize'>{data.contactNo}</p>
                    </div>
                    <div className="flex items-center mt-4">
                        <h3 className='font-bold mr-4 text-textColor'>Address 1: </h3><p className=' capitalize'>{data.address1}</p>
                    </div>
                    <div className="flex items-center mt-4">
                        <h3 className='font-bold mr-4 text-textColor'>Address 2: </h3><p className=' capitalize'>{data.address2}</p>
                    </div>
                    <div className="flex items-center mt-4">
                        <h3 className='font-bold mr-4 text-textColor'>Pin Code: </h3><p className=' capitalize'>{data.pinCode}</p>
                    </div>
                </div>
            </div>
            </>
        ): null
    }
    </>
  )
}
