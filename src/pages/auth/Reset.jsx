import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import resImg from '../../assets/forgot.png'
import styles from './auth.module.scss'
import Card from '../../components/card/Card'
import {auth} from '../../firebase/config'
import { sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify'
import Loader from '../../components/loader/Loader'
const Reset = () => {
  const [email, setEmail] = useState("");
  const [isloading,setIsLoading] = useState(false)

  const resetPass=(e)=>{
    e.preventDefault();
    setIsLoading(true)

    sendPasswordResetEmail(auth, email)
  .then(() => {
    setIsLoading(false)
    toast.success('Check your e-mail for reset link')
  })
  .catch((error) => {
    setIsLoading(false)
    toast.error(error.message)
    toast.error('Please enter correct e-mail')
  });
  }
  
  return (
   <>
   {isloading && <Loader />}
     <section className={`container ${styles.auth}`}>
      
      <Card>
      <div className={styles.form}>
      <h2>Reset Password</h2>
      <form onSubmit={resetPass}>
      <input type="text" placeholder='Email' required value={email} onChange={(e)=>setEmail(e.target.value)}/>
      <button type='submit' className='--btn --btn-primary --btn-block'>Reset Password</button>
      <div className={styles.links}>
        <p>
          <Link to='/login'>- Login</Link>
        </p>
        <p>
          <Link to='/register'>- Register</Link>
        </p>
      </div>
      </form>
      </div>
      </Card>
      <div className={styles.img}>
        <img src={resImg} alt="Login" width={400}/>
      </div>
      </section>
   </>
  )
}

export default Reset