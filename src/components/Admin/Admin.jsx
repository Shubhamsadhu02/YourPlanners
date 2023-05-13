import React, { useState } from 'react'
import { FaEye } from 'react-icons/fa';
import { motion } from "framer-motion";
import { useStateValue } from '../../context/StateProvider';
import VendorDetails from './VendorDetails';
import { AiOutlineSearch } from 'react-icons/ai';

export default function Admin() {
    const [{ plannerItems, appointmentItems }] = useStateValue();
    const [open, setOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [searchValue, setSearchValue] = useState("");

    const [currentTab, setCurrentTab] = useState("appointment");
    const activeTabStyle = {
        backgroundColor: 'rgb(231 237 244)',
        color: '#0353A4',
        borderRight: '4px solid #0353A4'
    }

    const inactiveTabStyle = {
        backgroundColor: '#fff',
        color: '#333',
    }
    const handleTabClick = (e) => {
        setCurrentTab(e.target.id)
    }

    const [{ user }] = useStateValue();
    if (user && user.email !== "santysadhu02@gmail.com") {
        return alert("You are not an admin.");
    }

    const handleSearch = (event) => {
        setSearchValue(event.target.value);
    };

    return (
        <>
            <section>
                <div className="container">
                    <h2 className=' text-textColor text-xl font-bold text-center mb-8'>Admin Dashboard</h2>
                    <div className="grid grid-cols-12">
                        <div className="flex flex-col col-span-3 border-2 mr-2 shadow-inner inset-y-4 bg-white">
                            <button type="submit" className="p-2 md:p-3 text-sm md:text-base"
                                id={"pendingPlanners"} onClick={handleTabClick} style={currentTab === 'pendingPlanners' ? activeTabStyle : inactiveTabStyle}>Pending Planners</button>
                            <button type="submit" className="p-2 md:p-3 text-sm md:text-base"
                                id={"approvedPlanners"} onClick={handleTabClick} style={currentTab === 'approvedPlanners' ? activeTabStyle : inactiveTabStyle}>Approved Planners</button>
                            <button type="submit" className="p-2 md:p-3 text-sm md:text-base"
                                id={"pastAppointment"} onClick={handleTabClick} style={currentTab === 'pastAppointment' ? activeTabStyle : inactiveTabStyle}>Past Appointments</button>
                            <button type="submit" className="p-2 md:p-3 text-sm md:text-base"
                                id={"appointment"} onClick={handleTabClick} style={currentTab === 'appointment' ? activeTabStyle : inactiveTabStyle}>Appointments</button>
                        
                        </div>
                        <div className="col-span-9 content p-4 border-2 border-b-0 rounded-[10px] shadow-inner inset-y-4 flex justify-center bg-white ">
                            {
                                currentTab === "pendingPlanners" &&
                                <>
                                    <table className="w-full divide-y divide-gray-200 table-fixed">
                                        <thead className=" bg-blue-100 border-b-4 border-blue-500">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    Company Name
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    Register As
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-blue-200">
                                            {plannerItems?.filter((n) => n.isVerified === false)
                                                .map((item, index) => (
                                                    <tr key={item?.id}>
                                                        <td className='px-6 py-4 capitalize break-words'>{item?.firstName}</td>
                                                        <td className='px-6 py-4 w-24 capitalize break-words'>{item?.company}</td>
                                                        <td className='px-6 py-4 w-24 capitalize break-words'>{item.email}</td>
                                                        <td className='px-6 py-4 whitespace-nowrap capitalize'>{item?.register}</td>
                                                        <td className='px-6 py-4'><motion.div
                                                            whileTap={{ scale: 0.99 }}
                                                            className="cursor-pointer"
                                                            onClick={() => {
                                                                setSelectedVendor(item);
                                                                setOpen(true);
                                                            }}
                                                        >
                                                            <FaEye size={20} className="text-textBlue" />

                                                        </motion.div>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>


                                </>
                            }
                            {
                                currentTab === "approvedPlanners" &&
                                <>
                                <div className="flex flex-col items-center">
                                    <div className="relative w-80 lg:w-96">
                                        <input
                                            type="text"
                                            placeholder="Search With Company Name, Name, Register..."
                                            value={searchValue}
                                            onChange={handleSearch}
                                            className="border rounded my-8 p-3 w-80 lg:w-96 hover:border-indigo-500  text-sm md:text-base drop-shadow-xl"
                                        />
                                        <AiOutlineSearch size={20} className="absolute font-bold right-2 bottom-12 bg-white" />
                                    </div>
                                    <table className="w-full divide-y divide-gray-200 table-fixed">
                                        <thead className=" bg-blue-100 border-b-4 border-blue-500">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    Company Name
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    Register As
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-blue-200">
                                            {plannerItems?.filter((n) => n.isVerified === true)
                                            .filter((n) => n.company.toLowerCase().includes(searchValue.toLowerCase()) || n.register.toLowerCase().includes(searchValue.toLowerCase()) || n.firstName.toLowerCase().includes(searchValue.toLowerCase()))
                                                .map((item, index) => (
                                                    <tr>
                                                        <td className='px-6 py-4 capitalize break-words'>{item.firstName}</td>
                                                        <td className='px-6 py-4 w-24 capitalize break-words'>{item.company}</td>
                                                        <td className='px-6 py-4 w-24 capitalize break-words'>{item.email}</td>
                                                        <td className='px-6 py-4 whitespace-nowrap capitalize'>{item.register}</td>
                                                        <td className='px-6 py-4'><motion.div
                                                            whileTap={{ scale: 0.99 }}
                                                            className="cursor-pointer"
                                                            onClick={() => {
                                                                setSelectedVendor(item);
                                                                setOpen(true);
                                                            }}
                                                        >
                                                            <FaEye size={20} className="text-textBlue" />

                                                        </motion.div></td>
                                                    </tr>
                                                    // <div className="xl:w-1/4 md:w-1/3 lg:w-1/3 2xl:w-1/5">
                                                    //     <RowContainer key={index} flag={false} data={item} />
                                                    // </div>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                                </>
                            }
                            {
                                currentTab === "pastAppointment" &&
                                <>
                                <table className="w-full divide-y divide-gray-200 table-fixed">
                                    <thead className=" bg-blue-100 border-b-4 border-blue-500">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                               Customer Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                Customer Conatct No
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                Company Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                Vendor Contact No
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                Booking For
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-blue-200">
                                        {appointmentItems?.filter((n) => n.isDone === true)
                                            .map((item, index) => (
                                                <tr key={item?.id}>
                                                    <td className='px-6 py-4 capitalize break-words'>{item.fullName}</td>
                                                    <td className='px-6 py-4 w-24 capitalize break-words'>{item.contactNo}</td>
                                                    <td className='px-6 py-4 w-24 capitalize break-words'>{item.vCompany}</td>
                                                    <td className='px-6 py-4 whitespace-nowrap capitalize'>{item.vContactNo}</td>
                                                    <td className='px-6 py-4'><motion.div
                                                        whileTap={{ scale: 0.99 }}
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedVendor(item);
                                                            setOpen(true);
                                                        }}
                                                    >
                                                        <FaEye size={20} className="text-textBlue" />

                                                    </motion.div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </>
                            }
                            {
                                currentTab === "appointment" &&
                                <div className=""></div>
                            }
                            {open && (
                                <VendorDetails setOpen={setOpen} data={selectedVendor} />
                            )}
                        </div>
                    </div>
                </div>
            </section >

        </>
    )
}
