
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API = {
    PRODUCTS: {
        ALL_PRODUCTS: API_BASE_URL + "/products",
        PRODUCT_BY_ID: API_BASE_URL + "/product/{0}",
        SEARCH: API_BASE_URL + "/products/search/{0}"
    },
    AUTH: {
        SIGNUP: API_BASE_URL + "/auth/signup",
        SIGNIN: API_BASE_URL + "/auth/signin",
        RESET_PASSWORD: API_BASE_URL + "/auth/reset-password",
    },
    ORDER:{
        PLACE_ORDER: API_BASE_URL + "/order",
        ORDERD_ITEMS : API_BASE_URL + "/orders/{0}"
    }

}