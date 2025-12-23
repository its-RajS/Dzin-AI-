import React from 'react'
import Link from 'next/link'

const Logo = () => {
  return (
    <Link 
    href="/"
    className='flex flex-1 items-center gap-1 text-2xl'
    >
        <span className="font-semibold text-foreground pr-0 mr-0">Dzin</span>
        {/* <span className='inline-block font-extrabold text-primary'>Z</span> */}
        {/* <span className="font-semibold text-foreground">in</span> */}
        <span className='inline-block font-extrabold text-primary pl-0 ml-0'>AI</span>
    </Link>
  )
}

export default Logo