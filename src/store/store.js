import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice/index'
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";
import shopProductsSlice from "./shop/products-slice";
import shoppingCartSlice from "./shop/cart-slice";
import shopAddressSlice from './shop/address-slice.js'
import shopOrderSlice from './shop/order-slice';
import shopSearchSlice from './shop/search-slice';

const store=configureStore({
    reducer:{
        auth:authReducer,
        adminProducts:adminProductsSlice,
        adminOrder: adminOrderSlice,
        shopProducts:shopProductsSlice,
        shoppingCart:shoppingCartSlice,
        shopAddress:shopAddressSlice,
        shopOrder:shopOrderSlice,
        shopSearch:shopSearchSlice
    }
})

export default store


