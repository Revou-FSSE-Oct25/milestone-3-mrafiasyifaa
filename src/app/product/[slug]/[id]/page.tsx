import React from 'react'
import Container from '@/src/components/Container'
import ImageView from '@/src/components/ImageView'
import AddToCart from '@/src/components/AddToCart'

interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  images: string[];
  category: {
    id: number;
    name: string;
    slug: string;
    image: string;
  };
}

const SingleProductPage = async ({params}:{params: Promise<{slug: string; id: string}>}) => {
    const {id} = await params;
    const response = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`)
    const product: Product = await response.json();

  return (
    <Container className="flex flex-col md:flex-row gap-10 py-10">
        {product?.images && <ImageView images={product?.images}/>}
        <div className="w-full md:w-1/2 flex flex-col gap-5">
            <div>
                <h2 className="text-2xl font-semibold">{product?.title}</h2>
                <p className="text-sm text-gray-600 tracking-wide">
                    {product?.description}
                </p>
            </div>
            <div>
                <p className="text-lg font-bold text-revoshop-navy">
            ${product?.price ? product.price : "0"}
          </p>
            </div>
            <div>
                <AddToCart product={product} />
            </div>
        </div>
    </Container>
  )
}

export default SingleProductPage