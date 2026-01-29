"use client"
import React from 'react'
import Cart from './Cart'
import {cn} from '@/lib/utils'
import { Button } from './ui/button'

interface Product {
    id: number
    title: string
    slug: string
    price: number
    description: string
    category: {
        id: number
        name: string
        slug: string
        image: string
    }
    images: string[]
}

interface Props {
    product: Product;
    className?: string;
}

const AddToCart = ({product, className}: Props) => {
    const handleAddToCart = () => {
        window.alert(`Added ${product.title} to cart!`)
    }
    
  return (
    <div>
      <Button 
        onClick={handleAddToCart}
        className={cn("flex items-center justify-center space-x-2 bg-revoshop-accent hover:bg-revoshop-accent-hover text-white px-4 py-2 rounded-md hoverEffect w-full", className)}
      >
        <Cart/>
        <span>Add to Cart</span>
      </Button>
    </div>
  )
}

export default AddToCart
