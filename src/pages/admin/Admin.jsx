import React from 'react'
import {Routes,Route} from 'react-router-dom'

import { AddProduct, Home, Orders, ViewProducts } from '../../components'

import styles from './Admin.module.scss'
import Navbar from '../../components/admin/navbar/Navbar'
import OrderDetails from '../../components/admin/orderDetails/OrderDetails'
const Admin = () => {
  return (
    <>
      <div className={styles.admin}>
        <div className={styles.navbar}>
        <Navbar/>
        </div>
        <div className={styles.content}>
          <Routes>
            <Route path='home' element={<Home/>}/>
            <Route path='all-products' element={<ViewProducts/>}/>
            <Route path='add-products/:id' element={<AddProduct/>}/>
            
            <Route path='orders' element={<Orders/>}/>
            <Route path='order-details/:id' element={<OrderDetails/>}/>
            
          </Routes>
        </div>
      </div>
    </>
  )
}

export default Admin