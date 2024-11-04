"use client";
import { useParams } from "next/navigation";
import ProductDetails from "../../../components/product/ProductDeatails";

const ProductPage = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <ProductDetails id={id} />
    )
}

export default ProductPage