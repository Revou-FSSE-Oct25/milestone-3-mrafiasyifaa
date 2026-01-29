"use client"
import React, {useState} from 'react'
import { AlignLeft } from 'lucide-react'
import SideBar from './SideBar'

const MobileMenu = () => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  return (
    <>
    <button onClick={()=> setIsSideBarOpen(!isSideBarOpen)}>
        <AlignLeft className="hover-text-darkColor hoverEffect md:hidden hover:cursor-pointer">
        </AlignLeft>
    </button>
    <div className="md:hidden">
        <SideBar isOpen={isSideBarOpen} onClose={()=> setIsSideBarOpen(false)} />
    </div>
    </>

  )
}

export default MobileMenu