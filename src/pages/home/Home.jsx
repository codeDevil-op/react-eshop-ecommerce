import  { useEffect } from 'react'
// import styles from './Home.module.scss'
// import Loader from '../../components/loader/Loader'
import Slider from '../../components/slider/Slider'
// import AdminOnlyRoute from '../../components/adminOnlyRoute/AdminOnlyRoute'
import Product from '../../components/product/Product'
const Home = () => {
  const url = window.location.href;
 

useEffect(()=>{
  const scrollToProducts = ()=>{
    if(url.includes('#products')){
      window.scrollTo({
        top:700,
        behavior:'smooth'
      })
      return
    }  
  }
  scrollToProducts()
},[url])


  return (
   <>
     <Slider/>
     <Product/>
     {/* <h1>Home is </h1> */}
     
   </>
  )
}

export default Home