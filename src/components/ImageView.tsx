"use client"
import React, { useState } from 'react'
import Image from 'next/image'

interface Props{
    images: string[]
}


const ImageView=({images = []}:Props) => {
    const [active, setActive] = useState(0);
  return (
    <div className="w-full md:w-1/2 space-y-2 md:space-y-4">
        <div>
            <Image src={images[active] || ''} alt="productImage" width={700}
            height={700}
            priority
            className={`w-full h-96 max-h-137.5 min-h-137.5 object-contain group-hover:scale-110  hoverEffect rounded-md`}/>
        </div>
      <div className="grid grid-cols-6 gap-2 h-20 md:g-24">
        {images?.map((image, index)=>(
            <button key={index} onClick={()=> setActive(index)} className={`border rounded-md overflow-hidden ${active === index ? "ring-1 border-revoshop-navy opacity-80" : "opacity-80"}`}>
                <Image src={image}
                alt={`Thumbnail ${index}`}
                    width={100}
                    height={100}
                    className="w-full h-auto object-contain"
                />
            </button>
        ))}
      </div>
    </div>
  );
};

export default ImageView
