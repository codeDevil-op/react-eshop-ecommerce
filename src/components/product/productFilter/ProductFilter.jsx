import React, { useEffect, useState } from 'react'
import styles from './productFilter.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { selectMax, selectMin, selectProducts, } from '../../../redux/slice/productSlice'
import { FILTER_BY_BRAND, FILTER_BY_CATEGORY, FILTER_BY_PRICE } from '../../../redux/slice/filterSlice'
const ProductFilter = ({setShowFilter}) => {
  const [category, setCategory] = useState('All')
  const [brand, setBrand] = useState('All')
  const [price, setPrice] = useState(3000)
  const products = useSelector(selectProducts)
  const maxPrice = useSelector(selectMax)
  const minPrice = useSelector(selectMin)



  const dispatch = useDispatch()
  // allCategories 
  const allCategories = [
    'All',
    ...new Set(products.map((product)=>product.category))
  ]
  const filterProduct=(cat)=>{
    setShowFilter(false)
    setCategory(cat)
    dispatch(FILTER_BY_CATEGORY({products,category:cat}))
  }
  // allBrand
  const allBrand = [
    'All',
    ...new Set(products.map((product)=>product.brand))
  ]
  useEffect(()=>{
    dispatch(FILTER_BY_BRAND({products,brand}),setShowFilter(false))
  },[products,brand,dispatch])

  // range 
  useEffect(()=>{
    dispatch(FILTER_BY_PRICE({products,price}))
  },[products,price,dispatch])

  
  const clearFilters =()=>{
    setShowFilter(false)
    setBrand('All')
    setCategory('All')
    setPrice(maxPrice)
  }

  
  return (
    <>
      <div className={styles.filter}>
        <h4>Categories</h4>
        <div className={styles.category}>
        {
          allCategories.map((cat,index)=>(
            <button key={index}
            type='button'
            className={`${category}`===cat?`${styles.active}`:null}
            onClick={()=>filterProduct(cat)}
            >&#8250;{cat}</button>
          ))
        }
          

        </div>
        <h4>Brand</h4>
        <div className={styles.brand}>
          <select name="brand" id="" value={brand} onChange={(e)=>setBrand(e.target.value)}>
          {allBrand.map((brand,index)=>(
            <option key={index} value={brand}>{brand}</option>
          ))}
            
          </select>
        <h4>Price</h4>
        <p>{`$${price}`}</p>
        <div className={styles.price}>
          <input type="range" value={price} onChange={(e)=>setPrice(e.target.value)} min={minPrice} max={maxPrice} />
        </div>
        <br />
        <button className='--btn --btn-danger' onClick={clearFilters}>Clear Filter</button>
        </div>
      </div>
    </>
  )
}

export default ProductFilter