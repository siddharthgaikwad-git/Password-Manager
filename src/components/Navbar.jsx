import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-violet-950 text-white">
      <div className="mycontainer flex justify-between items-center px-4 py-5 h-14 ">

        <div className='logo font-bold text-white text-2xl'>

          <span className='text-indigo-500'>&lt;</span>
          Pass
          <span className='text-indigo-500'>OP/&gt;</span>
        </div>
        <a
  href="https://github.com/siddharthgaikwad-git/Password-Manager"
  target="_blank"
  rel="noopener noreferrer"
  className="text-white bg-white my-5 rounded-lg flex gap-1 h-9
  justify-between items-center ring-black ring-1"
>
  <img
    className="p-1 w-11"
    src="/icons/github.svg"
    alt="github logo"
  />
  <span className="font-bold text-black">GitHub</span>
</a>
      </div>
    </nav>
  )
}

export default Navbar
