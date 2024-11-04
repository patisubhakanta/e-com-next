"use client";

import ProductDetails from "@/components/productComponents/ProductDeatails";
import { useParams } from "next/navigation";


const ProductPage = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <ProductDetails id={id} />
    )
}

export default ProductPage