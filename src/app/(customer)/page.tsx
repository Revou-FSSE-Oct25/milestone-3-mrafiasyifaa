import React from 'react'
import Container from '@/components/Container'
import Banner from '@/components/Banner'
import ProductGrid from '@/components/ProductGrid'

const Home = () => {
  return (
    <Container>
      <Banner />
      <div className="py-10">
        <ProductGrid />
      </div>
      
    </Container>
  )
}

export default Home
