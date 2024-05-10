import { useEffect, useState } from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {loadStripe} from '@stripe/stripe-js'
import {Elements } from '@stripe/react-stripe-js'
import { CALCULATE_SUBTOTAL, CART_TOTAL_QUANTITY, selectCartItems, selectCartTotalAmount } from '../../redux/slice/cartSlice'
import { selectEmail } from '../../redux/slice/authSlice'
import { selectBillingAddress, selectShippingAddress } from '../../redux/slice/checkoutSlice'
import CheckoutForm from '../../components/checkoutForm/CheckoutForm'
import { toast } from 'react-toastify'



const stripePromise = loadStripe(import.meta.env.REACT_APP_STRIPE_PK);

const Checkout = () => {
  const [message, setMessage] = useState("Initializing Checkout...");
  const [clientSecret, setClientSecret] = useState("");
  const cartItems = useSelector(selectCartItems)
  const totalAmount = useSelector(selectCartTotalAmount)
  const customerEmail = useSelector(selectEmail)

  const shippingAddress = useSelector(selectShippingAddress)
  const billingAddress = useSelector(selectBillingAddress)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL())
    dispatch(CART_TOTAL_QUANTITY())
  }, [dispatch,cartItems])
  
  const description = `eshop payment: email: ${customerEmail} amount: 
  ${totalAmount}`


  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("http://localhost:4242/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        items: cartItems,
        userEmail: customerEmail,
        shipping: shippingAddress,
        billing:billingAddress,
        description,
       }),
    })
      .then((res) => 
      {
        if(res.ok){
          return res.json()
        }
        return res.json().then((json)=>Promise.reject(json))
      })
      .then((data) => {
        setClientSecret(data.clientSecret)
      })
      .catch((error)=>{
        setMessage('Failed to initialized checkout')
        toast.error('Something Went wrong')
      })
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };
  return (
    <>
      <section>
        <div className='container'>
        {!clientSecret && <h3>{message}</h3>}
        </div>
      </section>

      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
        <CheckoutForm/>
        </Elements>
      )}
    </>
  )
}

export default Checkout