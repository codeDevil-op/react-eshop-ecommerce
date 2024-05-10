import { createSlice } from '@reduxjs/toolkit'
import { act } from 'react';
import { toast } from 'react-toastify';

const initialState = {
    cartItems:localStorage.getItem('cartItems')?JSON.parse(localStorage.getItem('cartItems')):[],
    cartTotalQuantity:0,
    cartTotalAmount:0,
    previousURL:'',
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    ADD_TO_CART:(state,action)=>{
       
        const productIndex = state.cartItems.findIndex((item)=>item.id===action.payload.id)

        if(productIndex>=0){
            // Item already exist in the cart 
            // Increase the quantity

            state.cartItems[productIndex].cartQuantity +=1
            toast.info(`${action.payload.name} increased by one`,{position:'top-left'})
        }else{
            // Item does,nt exist in the cart 
            // Add item to the cart first time 
            const tempProducts = {...action.payload,cartQuantity:1}

            state.cartItems.push(tempProducts)
            toast.success(`${action.payload.name} added to the cart`,{position:'top-left'})
        }
        // save cart to the LS 
        localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
    },
    DECREASE_CART: (state,action)=>{
      const productIndex = state.cartItems.findIndex((item)=>item.id===action.payload.id)
      if(state.cartItems[productIndex].cartQuantity > 1){
        state.cartItems[productIndex].cartQuantity -= 1
        toast.info(`${action.payload.name} decreased by one`,{position:'top-left'})
      }else if(state.cartItems[productIndex].cartQuantity === 1){
        const newCartItem = state.cartItems.filter((item)=>item.id !== action.payload.id)
        toast.success(`${action.payload.name} removed from the cart`,{position:'top-left'})
        state.cartItems = newCartItem
      }
      localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
    },
    REMOVE_FROM_CART:(state,action)=>{
      console.log(action.payload)
      const newCartItem = state.cartItems.filter((item)=>item.id !== action.payload.id)
        toast.success(`${action.payload.name} removed from the cart`,{position:'top-left'})
        state.cartItems = newCartItem
      localStorage.setItem('cartItems',JSON.stringify(state.cartItems))

    },
    CLEAR_CART:(state,action)=>{
      state.cartItems = []
      toast.info(`Cart has been cleared`,{position:'top-left'})
      localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
    },
    CALCULATE_SUBTOTAL:(state,action)=>{
      const array = [];
      state.cartItems.map((item)=>{
        const {price,cartQuantity} = item;
        const cartItemAmount = price * cartQuantity
        array.push(cartItemAmount)
      })
      const totalAmount = array.reduce((a,b)=>{
        return a + b;
      },0)
      state.cartTotalAmount = totalAmount
    },
    CART_TOTAL_QUANTITY:(state,action)=>{
      const array = [];
      state.cartItems.map((item)=>{
        const {cartQuantity} = item;
        const quantity = cartQuantity
        array.push(quantity)
      })
      const cartItemQuantity = array.reduce((a,b)=>{
        return a + b;
      },0)
      state.cartTotalQuantity = cartItemQuantity
    },
    SAVE_URL:(state,action)=>
    {
      state.previousURL = action.payload
    }
  }
});

export const {ADD_TO_CART,DECREASE_CART,REMOVE_FROM_CART,CLEAR_CART,CALCULATE_SUBTOTAL,CART_TOTAL_QUANTITY,SAVE_URL} = cartSlice.actions;
export const selectCartItems = (state)=>state.cart.cartItems;
export const selectCartTotalQuantity = (state)=>state.cart.cartTotalQuantity
export const selectCartTotalAmount = (state)=>state.cart.cartTotalAmount
export const selectPreviousURL =  (state)=>state.cart.previousURL
export default cartSlice.reducer;