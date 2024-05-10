import React, { useEffect, useState } from "react";
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {auth} from '../../firebase/config'
import styles from "./auth.module.scss";
import Card from "../../components/card/Card";
import Loader from '../../components/loader/Loader'
import regImg from "../../assets/register.png";
import { Link, useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [isloading,setIsLoading] = useState(false)
  const [onEyeVisibility,setOnEyeVisibility] = useState(false)
  const navigate = useNavigate()

  const onHandleVisible =()=>{
    setOnEyeVisibility(!onEyeVisibility)
  }

const registerUser =(e)=>{
  e.preventDefault();
  if(password !== cpassword){
    toast.error('Password do not match.')
  }
  setIsLoading(true)

  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    toast.success("Registration Successfully...")
    const user = userCredential.user;
    setIsLoading(false)
    navigate('/login')
    // ...
  })
  .catch((error) => {
    // const errorCode = error.code;
    // const errorMessage = error.message;
    toast.error(error.message)
    setIsLoading(false)
    // ..
  });
}


  return (
    <>
    {isloading && <Loader />}
    <section className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <h2>Register</h2>
          <form onSubmit={registerUser}>
            <input
              type="text"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className={styles.password}>
            <input
              type={onEyeVisibility ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            </div>

            <div className={styles.password}>
            <input
              type={onEyeVisibility ? "text" : "password"}
              placeholder="Confirm Password"
              required
              value={cpassword}
              onChange={(e) => setCPassword(e.target.value)}
            />
            <span className={styles.icon} onClick={onHandleVisible}>
            {onEyeVisibility ? <AiOutlineEyeInvisible size={20}/> : <AiOutlineEye size={20}/>}
            </span>
            </div>
            <button type="submit" className="--btn --btn-primary --btn-block">
              Register
            </button>
          </form>
          <span className={styles.register}>
            <p>Already have an account?</p>
            <Link to="/login">Login</Link>
          </span>
        </div>
      </Card>
      <div className={styles.img}>
        <img src={regImg} alt="Login" width={400} />
      </div>
    </section>
    </>
  );
};

export default Register;
