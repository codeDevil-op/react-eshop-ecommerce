import React from 'react'
import styles from './checkoutDetails.module.scss'
import { Link } from 'react-router-dom'
const CheckoutSuccess = () => {
  return (
    <section>
      <div className='container'>
        <h1>Checkout Successfully</h1>
        <p>Thanks for Your Purchase</p>
        <br />
        <Link to='/order-history'>
          <button className='--btn --btn-primary'>View Order History</button>
        </Link>
      </div>
    </section>
  )
}

export default CheckoutSuccess