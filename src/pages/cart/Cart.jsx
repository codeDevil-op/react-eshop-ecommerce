import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import styles from "./Cart.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_TO_CART,
  CALCULATE_SUBTOTAL,
  CART_TOTAL_QUANTITY,
  CLEAR_CART,
  DECREASE_CART,
  REMOVE_FROM_CART,
  SAVE_URL,
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalQuantity,
} from "../../redux/slice/cartSlice";
import Card from "../../components/card/Card";
import { selectIsLoggedIn } from "../../redux/slice/authSlice";

const Cart = () => {
  const cartItems = useSelector(selectCartItems);
  const cartTotalAmount = useSelector(selectCartTotalAmount);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
const increaseCart = (cart)=>{
  dispatch(ADD_TO_CART(cart))
}
const decreaseCart = (cart)=>{
  dispatch(DECREASE_CART(cart))
}
const removeFromCart = (cart)=>{
  dispatch(REMOVE_FROM_CART(cart))
}
const clearCart = ()=>{
  dispatch(CLEAR_CART())
}
useEffect(()=>{
    dispatch(CALCULATE_SUBTOTAL())
    dispatch(CART_TOTAL_QUANTITY())
    dispatch(SAVE_URL(''))
},[dispatch,cartItems])

const url = window.location.href;

const checkout = ()=>{
  if(isLoggedIn){
    navigate('/checkout-details')

  }else{
    dispatch(SAVE_URL(url))
    navigate('/login')
  }
}

  return (
    <section>
      <div className={`container ${styles.table}`}>
        <h2>Shopping Cart </h2>
        {cartItems.length === 0 ? (
          <>
            <p>Your cart is currently empty.</p>
            <br />
            <div>
              <Link to="/#products">&larr; Continue Shopping</Link>
            </div>
          </>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((cart, index) => {
                  const { id, name, price, imageUrl, cartQuantity } = cart;
                  return (
                    <>
                      <tr key={id}>
                        <td>{index + 1}</td>
                        <td>
                          <p>
                            <b>{name}</b>
                          </p>
                          <img src={imageUrl} alt={name} width={100} />
                        </td>
                        <td>{price}</td>
                        <td>
                          <div className={styles.count}>
                            <button className="--btn" onClick={()=>decreaseCart(cart)}>-</button>
                            <p>
                              <b>{cartQuantity}</b>
                            </p>
                            <button className="--btn" onClick={()=>increaseCart(cart)}>+</button>
                          </div>
                        </td>
                        <td>{(price * cartQuantity).toFixed(2)}</td>
                        <td className={styles.icons} onClick={()=>removeFromCart(cart)}>
                          <FaTrashAlt size={19} color="red" />
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
            <div className={styles.summary}>
            {cartItems.length===1? ``:<button className="--btn --btn-danger" onClick={clearCart}>Clear Cart</button>}
              
              <div className={styles.checkout}>
                <div>
                  <Link to='/#products'>&larr; Continue Shopping</Link>
                </div>
                <br />
                <Card cardClass={styles.card}>
                <p>{`cart items (s): ${cartTotalQuantity}`}</p>
                <div className={styles.text}>
                <h4>subtotal:</h4>
                <h3>{`$${cartTotalAmount.toFixed(2)}`}</h3>
                </div>
                <p>Taxes and shipping calculated at checkout</p>
                <Link to='/checkout-details'>
                <button className="--btn --btn-primary --btn-block" onClick={checkout}>Checkout</button>
                </Link>          
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Cart;
