export const ERROR_MESSAGE = {
    COMMON_ERROR: {
        500: 'Internal server error',
        Unauthorized: "Unauthorized",
        USER_NOT_FOUND: 'User not found',
        PRODUCT_NOT_FOUND: "Product not found"
    },
    ORDER: {
        404: "No orders found."
    },
    WISHLIST: {
        ADD: {
            400: 'Product already added to wishlist'
        }
    },
    SIGN_IN:{
        401:'Invalid email or password',
        400: 'Please provide both email and password'
    },
    SIGN_UP:{
        401:'User already exists',
        400:'Please provide all required fields'
    }
}

export const SUCESS_MESSAGE = {
    WISHLIST: {
        ADD: {
            201: 'Product added to wishlist successfully',
        },

    },
    FORGET_PASSWORD: {
        200: 'Password updated successfully'
    },
    ORDER: {
        201: 'Order placed successfully'
    },
    REMOVE_WISHLIST:{
        200:"Product Removed from Wishlist"
    },
    SIGN_UP:{
        201:'User registered successfully'
    }
}