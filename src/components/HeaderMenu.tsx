"use client"
import React from 'react'
import Link from 'next/link'
import {headerNavigation} from '@/src/config/navigation'
import { usePathname } from 'next/navigation'

function HeaderMenu() {
  const pathname = usePathname();

  return (
    <div className="hidden md:inline-flex w-1/3 items-center gap-7 text-sm capitalize font-semibold text-revoshop-navy">
      {headerNavigation?.map((item) => (
        <Link key={item?.title} href={item?.href} className={`hover:text-revoshop-accent-hover hoverEffect relative group ${pathname === item?.href ? 'text-revoshop-accent' : ''}`}>
            {item?.title}
            <span className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-revoshop-accent-hover group-hover:w-1/2 hoverEffect group-hover:left-0 ${pathname === item?.href ? 'w-1/2 left-0' : ''}`}/>
            <span className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-revoshop-accent-hover group-hover:w-1/2 hoverEffect group-hover:right-0 ${pathname === item?.href ? 'w-1/2 right-0' : ''}`}/>
        </Link>))}
    </div>
  )
}

export default HeaderMenu
