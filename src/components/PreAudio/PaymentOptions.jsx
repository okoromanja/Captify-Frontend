import React from 'react'
import { MdOutlinePaid } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { MdPayment } from "react-icons/md";
import { useState } from 'react';
const PaymentOptions = ({
    fileName,
    duration,
    cost,
    handlePaymentOptions,
    setShowPaymentModal,
    setCost,
    currentBalance,
    handleTranscriptions
}) => {


    const [minutes, setMinutes] = useState('');
    const [total, setTotal] = useState(0);

    const handleMinutesChange = (e) => {
        const value = e.target.value;
        setMinutes(value);
        setTotal(value * 0.5);
    };




    return (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 py-3">
            <div className="bg-bg-navy-blue h-[550px] md:w-[500px] w-[330px] p-5 rounded-lg overflow-y-scroll overflow-x-hidden">

                <div className='w-full  flex flex-row items-center justify-end  gap-10 px-5 py-5'>

                    <span className='flex flex-1  flex-row items-center gap-2'>
                        {/* <MdOutlinePaid className='text-2xl' /> */}
                        <h1 className='md:text-2xl font-semibold font-poppins '> Billing </h1>
                    </span>

                    <MdClose onClick={() => setShowPaymentModal(false)} className='text-end w-10 h-10 cursor-pointer hover:bg-gray-800 p-2 rounded-full ' size={25} />

                </div>









                {/* Direct Payment Method */}
                <div className='flex flex-col my-2 gap-2 p-2  border-b'>

                    <p className='text-xl mb-2 font-semibold font-poppins '>Direct Payment</p>

                    <span className='flex justify-between '>

                        <p className=' text-center font-medium  font-poppins'>File Name</p>
                        <p className=' text-center font-medium  font-poppins'>{fileName}</p>
                    </span>
                    <span className='flex justify-between '>

                        <p className='text-center font-medium  font-poppins'>Transcript Duration:</p>
                        <p className=' text-center font-medium  font-poppins'>{duration} min</p>
                    </span>
                    <span className='flex justify-between '>

                        <p className=' text-center font-medium  font-poppins'> Charge per minute</p>
                        <p className=' text-center font-medium  font-poppins'>0.5$ </p>
                    </span>
                    <span className='flex justify-between '>

                        <p className=' text-center font-medium  font-poppins'> Total</p>
                        <p className=' text-center font-medium  font-poppins'>{cost} $ </p>
                    </span>
                    <button onClick={handleTranscriptions} className='text-center px-5 py-3 w-full h-14
rounded-md bg-purple-500 text-white text-xl font-medium font-roboto hover:bg-purple-400 mb-2 '><span className='flex items-center text-center justify-center gap-2 '>
                            <MdPayment size={25} /> <p>Pay with Credit </p>
                        </span></button>
                    <button onClick={handlePaymentOptions} className='text-center px-5 py-3 w-full h-14
rounded-md bg-purple-500 text-white text-xl font-medium font-roboto hover:bg-purple-400 mb-2 '><span className='flex items-center text-center justify-center gap-2'>
                            <MdPayment size={25} /> <p>Direct Pay </p>
                        </span></button>

                </div>
            </div>
        </div>
    )
}

export default PaymentOptions; 
