import React from 'react'

const SearchBar = () => {
  return (
    <div className='w-full max-w-[600px] relative before:absolute before:bg-neutral-100
        before:block before:top-1/2 before:-translate-y-1/2
        before:left-1/2 before:-translate-x-1/2 before:bg-gradient-to-r before:from-white before:to-red-500 
        before:opacity-50 before:blur-3xl before:rounded-full before:w-160 before:h-120 before:rotate-45 before:-z-1'>
        <div className='bg-neutral-800/40 border-neutral-700 focus-within:border-transparent border-2 rounded-3xl p-5 py-0 w-full focus:outline-none
            focus-within:ring-2 focus-within:ring-neutral-100 transition-all duration-300
            shadow-md flex items-center'>
            <input
            type="text" 
            className='hover:outline-none focus:outline-none bg-transparent w-full pr-5 py-5'
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
        </div>
    </div>
  )
}

export default SearchBar
