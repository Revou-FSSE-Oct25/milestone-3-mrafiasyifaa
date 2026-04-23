import React from 'react'
import Shop from '@/components/Shop'

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}

interface Props{
  searchParams: Promise<{
    category?: string;
    price?: string}>;
}

const ShopPage = async ({searchParams}: Props) => {
  const params = await searchParams;
  
  const response = await fetch('https://api.escuelajs.co/api/v1/categories', {
    next: { revalidate: 300 }
  })
  const categories: Category[] = await response.json()

  const safeCategory = params.category && /^[a-zA-Z0-9-]+$/.test(params.category)
    ? params.category
    : null;

  return (
    <Shop
      categories={categories}
      initialCategory={safeCategory}
      initialPrice={params.price || null}
    />
  )
}

export default ShopPage
