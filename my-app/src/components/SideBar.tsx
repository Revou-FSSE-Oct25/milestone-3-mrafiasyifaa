"use client"
import { X } from 'lucide-react';
import React, {FC} from 'react'
import Logo from './Logo';
import Link from 'next/link';
import {headerNavigation} from '@/src/config/navigation';
import { usePathname } from 'next/navigation';
import { useOutsideClick } from '../hooks';

interface SideBarProps{
    isOpen: boolean;
    onClose: ()=> void;
}

const SideBar:FC<SideBarProps> = ({isOpen, onClose}) => {
    const pathname = usePathname();
    const sideBarRef=useOutsideClick<HTMLDivElement>(onClose);

    return(
    <div className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-neutral-400/50 shadow-xl ${isOpen ? "translate-x-0" : "-translate-x-full"} hoverEffect`}>
        <div className="min-w-72 max-w-96 bg-black h-screen p-10 border-r border-r-revoshop-accent-hover flex flex-col gap-6">
            <div className="flex items-center justify-between gap-5">
                <Logo className="text-white" spanDesign="group-hover:text-white"/>
                <button onClick={onClose} className="text-white hover:text-revoshop-accent-hover hoverEffect">
                    <X />
                </button>
            </div>
            <div ref={sideBarRef} className="flex flex-col space-y-3.5 font-semibold tracking-wide">
                {headerNavigation?.map((item)=>(
                    <Link href={item?.href} key={item?.title} className={`text-white hover:text-revoshop-accent-hover hoverEffect capitalize ${pathname === item?.href && "text-revoshop-accent-hover"}`}       >
                        {item?.title}
                    </Link>
                ))}
            </div>
        </div>
    </div>
    )
};

export default SideBar