import React, { useEffect, useState } from "react";
import styles from "./ViewProducts.module.scss";
import {FaEdit, FaTrashAlt} from 'react-icons/fa'
import Loader from '../../loader/Loader'
import { toast } from "react-toastify";
import { deleteDoc, doc, } from "firebase/firestore";
import { db, storage } from "../../../firebase/config";
import { Link } from "react-router-dom";
import { deleteObject, ref } from "firebase/storage";
import Notiflix from 'notiflix'
import {useDispatch, useSelector} from 'react-redux'
import { STORE_PRODUCTS, selectProducts } from "../../../redux/slice/productSlice";
import useFetchCollection from "../../../customHooks/useFetchCollection";
import { FILTER_BY_SEARCH, selectFilteredProducts } from "../../../redux/slice/filterSlice";
import Search from "../../search/Search";
import Pagination from "../../pagination/Pagination";

const ViewProducts = () => {
  const [search,setSearch] = useState("")
  const {data,isLoading} = useFetchCollection('products')
  const products = useSelector(selectProducts)
  const filteredProducts = useSelector(selectFilteredProducts)
  const dispatch = useDispatch()


  // pagenation states 
  const [currentPage,setCurrentPage] = useState(1)
  const [productsPerPage,setProductPerpage] = useState(10)

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct,indexOfLastProduct)


  useEffect(()=>{
    dispatch(
              STORE_PRODUCTS({
                products:data,
              })
              )
             
  },[dispatch,data])

  useEffect(()=>{
    dispatch(FILTER_BY_SEARCH({products,search}))
  },[dispatch,search,products])
  
 
  const confirmDelete = (id,imgUrl,index)=>{
    Notiflix.Confirm.show(
      'Delete Product!!!',
      'You are about to delete product',
      'Delete',
      'Cancel',
      function okCb() {
        deleteProduct(id,imgUrl,index)
      },
      function cancelCb() {
        return
      },
      {
        width: '320px',
        borderRadius: '8px',
        titleColor:'orangered',
        okButtonBackground:'orangered',
        cssAnimationStyle:'zoom',
      },
    );
  }



  const deleteProduct= async(id,imgUrl,index)=>{
    try {
      await deleteDoc(doc(db, "products", id));
      const storageRef = ref(storage, imgUrl);
      deleteObject(storageRef)
      toast.success(`${index+1}) Product Deleted Successfully.`)
    } catch (error) {
      toast.error(error.messsage)
    }
  }
  return(
    <>
    {isLoading && <Loader/>}
      <div className={styles.table}>
        <h2>All Products</h2>
        <div className={styles.search}>
          <p>
            <b>{filteredProducts.length}</b> Products are founds.
          </p>
          <Search value={search} onChange={(e)=>setSearch(e.target.value)}/>
        </div>
        {products.length===0?(
          <p>No Products Found</p>
        ):(
          <table>
          <thead>
            <tr>
              <th>sr/no</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {currentProducts.map((product,index)=>{
              const {id,name,imageUrl,category,price} = product
              return (
                
                <tr key={id}>
                <td>{index+1}</td>
                <td>
                  <img src={imageUrl} alt="" style={{width:'100px'}} />
                </td>
                <td>{name}</td>
                <td>{category}</td>
                <td>{`$${price}`}</td>
                <td className={styles.icons}>
                  <Link to={`/admin/add-products/${id}`}>
                    <FaEdit size={20}  color="green"/>
                  </Link>
                  <FaTrashAlt size={18}  color="red" onClick={()=>confirmDelete(id,imageUrl,index)}/>
                </td>
              </tr>
              
              )
             
            })}
            </tbody>
          </table>
        )}
        <Pagination
          currentPage = {currentPage}
          setCurrentPage = {setCurrentPage}
          productsPerPage = {productsPerPage}
          totalProducts = {filteredProducts.length}
        />
      </div>
    </>
    )
};

export default ViewProducts;
