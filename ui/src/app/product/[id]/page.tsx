
"use client";
import ProductDetails from '@/app/components/Product/ProductDeatails'
import React from 'react'


interface ProductDetailsProps {
  params: {
    id: string;
  };
}

const Product: React.FC<ProductDetailsProps> = ({ params }) => {
  const { id } = params;

  return (
    <ProductDetails id={Array.isArray(id) ? id[0] : id} />
  )
}

export default Product