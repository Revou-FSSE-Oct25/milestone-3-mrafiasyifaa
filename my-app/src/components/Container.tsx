import React from 'react'
import {cn} from '@/lib/utils'

const Container = ({
  children, 
  className
}:{
  children:React.ReactNode,
  className?:string;
}) => {
  return (
    <div className={cn("max-w-sceen-xl mx-auto px-4", className)}>
      {children}
    </div>
  )
}

export default Container
