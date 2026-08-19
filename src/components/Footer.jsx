import React from 'react'


const Footer = () => {
    return (
        <div className='text-white bg-violet-950 flex flex-col justify-center items-center  w-full'>
            <div className='logo font-bold text-white text-2xl'>

                <span className='text-indigo-500'>&lt;</span>
                Pass
                <span className='text-indigo-500'>OP/&gt;</span>
            </div>
            <div className="text-base flex justify-center items-center font-semibold">
                 Created with <img className='w-6 mx-1 mt-1' src="/icons/heart.png" alt="" /><p>By Siddharth </p>
            </div>
        </div>
    )
}

export default Footer
