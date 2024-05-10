import React, { useState } from "react";
import {
  GoogleAuthProvider, 
  signInWithEmailAndPassword,signInWithPopup
} from 'firebase/auth'
import {auth} from '../../firebase/config'
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import styles from "./auth.module.scss";
import loginImg from "../../assets/login.png";

import Card from "../../components/card/Card";
import Loader from "../../components/loader/Loader";

import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSelector } from "react-redux";
import { selectPreviousURL } from "../../redux/slice/cartSlice";
const Login = () => {
  const previousURL = useSelector(selectPreviousURL)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isloading,setIsLoading] = useState(false)
  const [onEyeVisibility,setOnEyeVisibility] = useState(false)
  const navigate = useNavigate();
  const redirectUser = ()=>{
    if(previousURL.includes('cart')){
      navigate('/cart')
    }else{
     return navigate('/')
    }
  }
  const onHandleVisible =()=>{
    setOnEyeVisibility(!onEyeVisibility)
  }

  const loginUser = (e)=>{
    e.preventDefault();
    setIsLoading(true)
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    toast.success('Login Successfully...')
    const user = userCredential.user;
    redirectUser()
    setIsLoading(false)
  })
  .catch((error) => {
    // toast.error(error.message);
    toast.error('Incorrect username/password')
    setIsLoading(false)
  });
  }
  // Login with Google 
  const provider = new GoogleAuthProvider();
  const signInWithGoogle = () =>{
    signInWithPopup(auth, provider)
  .then((result) => {
    const user = result.user;
    toast.success('Login Successfully')
    redirectUser()
  }).catch((error) => {
    toast.error('Incorrect username/password')
  });
  }

  return (
    <>
    {isloading && <Loader />}
      <section className={`container ${styles.auth}`}>
        <div className={styles.img}>
          <img src={loginImg} alt="Login" width={400} />
        </div>
        <Card>
          <div className={styles.form}>
            <h2>Login</h2>
            <form onSubmit={loginUser}>
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
            <span className={styles.icon} onClick={onHandleVisible}>
            {onEyeVisibility ? <AiOutlineEyeInvisible size={20}/> : <AiOutlineEye size={20}/>}
            </span>
            </div>
              <button type="submit" className="--btn --btn-primary --btn-block">Login</button>
              <div className={styles.links}>
                <Link to="/reset">Forgot Password</Link>
              </div>
              <p>-- or --</p>
            </form>
            <button onClick={signInWithGoogle} className="--btn --btn-danger --btn-block">
              <FaGoogle color="#fff" /> &nbsp; Login With Google
            </button>
            <span className={styles.register}>
              <p>Don't have an account?</p>
              <Link to="/register">Register</Link>
            </span>
          </div>
        </Card>
      </section>
    </>
  );
};

export default Login;
