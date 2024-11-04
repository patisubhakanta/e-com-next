import { ERROR_MESSAGE } from '../constatnts/messages';
import Product from '../modals/productModal';



export const getFullCartDetails = async (cartItems: any[]) => {
    const fullCartDetails = await Promise.all(
        cartItems.map(async (item) => {
            const product = await Product.findById(item.productId);
            if (!product) {
                throw new Error(ERROR_MESSAGE.COMMON_ERROR.PRODUCT_NOT_FOUND);
            }

            return {
                productId: product._id,
                name: product.name,
                description: product.description,
                inStock: product.inStock,
                image: product.image,
                qty: item.quantity,  
                price: product.price
            };
        })
    );

    return fullCartDetails;
};
