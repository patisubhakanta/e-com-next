import { useParams } from "react-router-dom";
import ProductDetails from "../../components/Product/ProductDeatails";

const ProductPage = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <ProductDetails id={id} />
    )
}

export default ProductPage