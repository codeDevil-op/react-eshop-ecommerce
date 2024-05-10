import React, { useState } from "react";
import styles from "./AddProduct.module.scss";
import Card from "../../card/Card";
import { db, storage } from "../../../firebase/config";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import { Timestamp, addDoc, collection, doc, setDoc } from "firebase/firestore";
import Loader from "../../loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectProducts } from "../../../redux/slice/productSlice";

const categories = [
  { id: 1, name: "Laptops" },
  { id: 2, name: "Electronics" },
  { id: 3, name: "Fashion" },
  { id: 4, name: "Phone" },
];
const initialState = {
  name: "",
  price: 0,
  imageUrl: "",
  category: "",
  brand: "",
  desc: "",
}

const AddProduct = () => {
  const {id} = useParams()
  const products = useSelector(selectProducts);
  const productEdit = products.find((item)=>item.id===id)
  
  
  
  function detectForm(id,f1,f2){
    if(id==='ADD'){
      return f1;
    }
    return f2;
  }
  const [product, setProduct] = useState(()=>{
    const newState = detectForm(id,
      {...initialState},
      productEdit,
      )
      return newState
  });

  


  const [uploadprogress, setUploadProgress] = useState(0)
  const [isLoading,setIsLoading] = useState(false)

  const navigate = useNavigate()


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };
  const handleImgaeChange = (e) => {
    const file = e.target.files[0]
    // console.log(file)
    const storageRef = ref(storage,`eshopImg/${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);


    uploadTask.on('state_changed', 
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setUploadProgress(progress)
   
  }, 
  (error) => {
    // Handle unsuccessful uploads
    toast.error(error.message)
  }, 
  () => {
   
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      setProduct({...product,imageUrl:downloadURL})
      toast.success('Image Uploaded Successfully...')
    });
  }
);


  };

  const addProduct = (e) => {
    e.preventDefault();
    setIsLoading(true)
    try{
      const docRef = addDoc(collection(db, "products"), {
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl,
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        createdAt:Timestamp.now().toDate()
      });
      setIsLoading(false)
      setUploadProgress(0)
      setProduct({...initialState})
      toast.success('Product Uploaded Successfully.')
      navigate('/admin/all-products')
    }catch(error){
      setIsLoading(false)
      toast.error(error.message)
    }


  };
  const editProduct = (e)=>{
    e.preventDefault()
    setIsLoading(true)
    if(product.imageUrl !== productEdit.imageUrl){
      const storageRef = ref(storage,productEdit.imageUrl)
      deleteObject(storageRef)
    }
    try {
       setDoc(doc(db, "products", id), {
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl,
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        createdAt:productEdit.createdAt,
        editedAt:Timestamp.now().toDate(),
      });
      setIsLoading(false)
      toast.success(`Product Edited Successfully.`)
      navigate('/admin/all-products')
    } catch (error) {
      setIsLoading(false)
      toast.error(message.error)
    }
  }

  return (
    <>
    {isLoading && <Loader/>}
      <div className={styles.product}>
        <h1>{detectForm(id,'Add New Product','Edit Product')}</h1>
        <Card cardClass={styles.card}>
          <form onSubmit={detectForm(id,addProduct,editProduct)}>
            <label>Product name: </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Product Name"
              value={product.name}
              onChange={(e) => handleInputChange(e)}
            />
            <label>Product name: </label>
            <Card cardClass={styles.group}>
            {uploadprogress===0? null :(
              <div className={styles.progress}>
                <div
                  className={styles["progress-bar"]}
                  style={{ width: `${uploadprogress}%` }}
                >
                  {uploadprogress < 100 ? `Uploading ${uploadprogress}`:`Upload Complete ${uploadprogress}%`}
                </div>
              </div>
            )}
              

              <input
                type="file"
                accept="image/*"
                placeholder="Product Image"
                name="image"
                onChange={(e) => handleImgaeChange(e)}
              />
              {product.imageUrl===''? null :(
                <input
                type="text"
                value={product.imageUrl}
                disabled
                // required
                name="imageUrl"
              />
              )}
              
            </Card>
            <label>Product Price: </label>
            <input
              type="number"
              name="price"
              required
              placeholder="Product Price"
              value={product.price}
              onChange={(e) => handleInputChange(e)}
            />
            <label>Product Category</label>
            <select
              name="category"
              value={product.category}
              onChange={(e) => handleInputChange(e)}
            >
              <option value="" disabled>
                --Choose product category--
              </option>
              {categories.map((cat) => {
                return (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                );
              })}
            </select>
            <label>Product Company/Brand: </label>
            <input
              type="text"
              name="brand"
              required
              placeholder="Product Brand"
              value={product.brand}
              onChange={(e) => handleInputChange(e)}
            />
            <label>Product Description</label>
            <textarea
              name="desc"
              value={product.desc}
              onChange={(e) => handleInputChange(e)}
              required
              placeholder="type here..."
              cols="30"
              rows="10"
            ></textarea>
            <button className="--btn --btn-primary">{detectForm(id,'Save Product','Edit Product')}</button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default AddProduct;
