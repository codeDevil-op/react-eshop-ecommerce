import React, { useEffect, useState } from 'react'
import styles from './productDetails.module.scss'
import { doc, getDoc } from "firebase/firestore";
import {db} from '../../../firebase/config'
import { Link, useParams } from 'react-router-dom'
import {toast} from 'react-toastify'
import spinnerImg from '../../../assets/spinner.jpg'
import { useDispatch, useSelector } from 'react-redux'
import { ADD_TO_CART, CART_TOTAL_QUANTITY, DECREASE_CART, selectCartItems } from '../../../redux/slice/cartSlice'
import useFetchDocument from '../../../customHooks/useFetchDocument';
import useFetchCollection from '../../../customHooks/useFetchCollection';
import StarsRating from 'react-star-rate';
import Card from '../../card/Card';
const ProductDetails = () => {
  const {id} = useParams()
  const [product,setProduct] = useState(null)
  const cartItems = useSelector(selectCartItems)
  const cart = cartItems.find((item)=>item.id===id)
  const isAddedToCart = cartItems.findIndex((cart)=>{
    return cart.id===id
  })
  const dispatch = useDispatch()
  
  const {document} = useFetchDocument("products",id)
  const {data} = useFetchCollection('reviews')

  const filteredReviews = data.filter((review)=>review.productID===id)

  

  useEffect(()=>{
    setProduct(document)
  },[document])

  const addToCart = (product)=>{
    dispatch(ADD_TO_CART(product))
    dispatch(CART_TOTAL_QUANTITY())
  }
  const decreaseCart = (product)=>{
    dispatch(DECREASE_CART(product))
    dispatch(CART_TOTAL_QUANTITY())
  }
  return (
    <>
      <section >
      <div className={`container ${styles.product}`}>

      
        <h2>Product Details</h2>
        <div>
        <Link to ='/#products'>
          &larr; Back To Products
        </Link>
        </div>
        {product===null?(
          <img src={spinnerImg} style={{width:'50px'}} />
        ):(
          <div className={styles.details}>
            <div className={styles.img}>
              <img src={product.imageUrl} alt={product.name} />
            </div>
            <div className={styles.content}>
              <h3>{product.name}</h3>
              <p className={styles.price}>{`$${product.price}`}</p>
              <p>{product.desc}</p>
              <p>
              <b>SKU</b> {product.id}
              </p>
              <p>
              <b>Brand</b> {product.brand}
              </p>
              <div className={styles.count}>
              {isAddedToCart < 0 ?null:(
                <>
                <button className='--btn' onClick={()=>decreaseCart(product)}>-</button>
              <p>
                <b>{cart.cartQuantity}</b>
              </p>
              <button className='--btn' onClick={()=>addToCart(product)}>+</button>
                </>
              )}
              
              </div>
              <button className='--btn --btn-danger' onClick={()=>addToCart(product)}>ADD TO CART</button>
            </div>
          </div>
        )}
        <Card cardClass={styles.card}>
          <h3>Product Reviews</h3>
          <div>
            {filteredReviews.length === 0 ? (
              <p>There are no reviews for this product yet.</p>
            ) : (
              <>
                {filteredReviews.map((item, index) => {
                  const { rate, review, reviewDate, userName } = item;
                  return (
                    <div key={index} className={styles.review}>
                      <StarsRating value={rate} />
                      <p>{review}</p>
                      <span>
                        <b>{reviewDate}</b>
                      </span>
                      <br />
                      <span>
                        <b>by: {userName}</b>
                      </span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </Card>
        </div>
      </section>
    </>
  )
}

export default ProductDetails