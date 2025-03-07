import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderHistory:[],
    totalOrderAmount:null
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    STORE_ORDERS: (state,action)=>{
      state.orderHistory = action.payload
    },
    CALC_TOTAL_ORDER_AMOUNT:(state,action)=>{
      const array = [];
      state.orderHistory.map((item)=>{
        const {orderAmount} = item;
        array.push(orderAmount)
      })
     
      const totalAmount = array.reduce((a,b)=>{
        return a + b;
      },0)
      
      state.totalOrderAmount = totalAmount
    }
  }
});

export const {STORE_ORDERS,CALC_TOTAL_ORDER_AMOUNT} = orderSlice.actions
export const selectOrderHistory = (state)=>state.order.orderHistory
export const selectTotalOrderAmount = (state)=>state.order.totalOrderAmount

export default orderSlice.reducer