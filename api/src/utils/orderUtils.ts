
import { ERROR_MESSAGE } from '../constatnts/messages';
import Product from '../modals/productModal';

// Function to fetch detailed product information for each order item
export const getFullOrderDetails = async (orders: any[]) => {
    const fullOrderDetails = await Promise.all(
        orders.map(async (order) => {
            const detailedItems = await Promise.all(
                order.items.map(async (item: any) => {
                    const detailedOrders = await Promise.all(
                        item.orders.map(async (orderItem: any) => {
                            const product = await Product.findById(orderItem.productId);

                            if (!product) {
                                throw new Error(ERROR_MESSAGE.COMMON_ERROR.PRODUCT_NOT_FOUND);
                            }

                            return {
                                productId: product._id,
                                name: product.name,
                                description: product.description,
                                inStock: product.inStock,
                                image: product.image,
                                qty: orderItem.qty,       
                                price: orderItem.price     
                            };
                        })
                    );

                    return {
                        timestamp: item.timestamp,
                        orders: detailedOrders,   
                    };
                })
            );

            return {
                userId: order.userId,
                items: detailedItems,         // Full details for each item
            };
        })
    );

    return fullOrderDetails;
};
