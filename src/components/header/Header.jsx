import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaTimes, FaUserCircle } from "react-icons/fa";
import {  useDispatch, useSelector } from "react-redux";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { auth } from "../../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { REMOVE_ACTIVE_USER, SET_ACTIVE_USER } from "../../redux/slice/authSlice";
import ShowOnLogin, { ShowOnLogout } from "../hiddenLinks/HiddenLink";
import AdminOnlyRoute, { AdminOnlyLink } from "../adminOnlyRoute/AdminOnlyRoute";
import { CART_TOTAL_QUANTITY, selectCartTotalQuantity } from "../../redux/slice/cartSlice";

const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : ``);

const logo = (
  <div className={styles.logo}>
    <Link to="/">
      <h2>
        e<span>Shop</span>.
      </h2>
    </Link>
  </div>
);


const Header = () => {
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  const [scrollPage,setScrollPage] = useState(false)
  const [showMenu, setShowMenu] = useState(false);
  const [displayname, setDisplayName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
useEffect(()=>{
  dispatch(CART_TOTAL_QUANTITY())
},[])
  
  const fixNavbar = ()=>{
    if(window.scrollY > 50){
      setScrollPage(true)
    }else{
      setScrollPage(false)
    }
  }
  window.addEventListener('scroll',fixNavbar)

  // Monitor Currently signed in

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        if(user.displayName===null){
          const usrName = user.email.slice(0, -10);
          const uName = usrName.charAt(0).toUpperCase() + usrName.slice(1);
          setDisplayName(uName)
        }else{
          setDisplayName(user.displayName);
        }
       
        dispatch(SET_ACTIVE_USER({
          email:user.email,
          userName:user.displayName? user.displayName:displayname,
          userID:user.uid,
        }))
      } else {
        setDisplayName("");
        dispatch(REMOVE_ACTIVE_USER())
      }
    });
  }, [dispatch,displayname]);


  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const hideMenu = () => {
    setShowMenu(false);
  };

  const userLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("success");
        toast.success("Logout Successfully...");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  const cart = (
    <span className={`${styles.cart}`}>
      <Link to="/cart">
        Cart <FaShoppingCart size={20} />
        <p>{cartTotalQuantity}</p>
      </Link>
    </span>
  );

  return (
    <header className={scrollPage ? `${styles.fixed}`:null}>
      <div className={styles.header}>
        {logo}
        <nav
          className={
            showMenu ? `${styles["show-nav"]}` : `${styles["hide-nav"]}`
          }
        >
          <div
            onClick={hideMenu}
            className={
              showMenu
                ? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}`
                : `${styles["nav-wrapper"]}`
            }
          ></div>
          <ul onClick={hideMenu}>
            <li className={styles["logo-mobile"]}>
              <Link to="/">{logo}</Link>
              <FaTimes size={20} color="#fff" />
            </li>
            <li>
            <AdminOnlyLink>
           <Link to='/admin/home'>
              <button className="--btn --btn-primary">Admin</button>
           </Link>
            </AdminOnlyLink>
            </li>
            <li>
              <NavLink to="/" className={activeLink}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className={activeLink} to="/contact">
                Contact us
              </NavLink>
            </li>
          </ul>
          <div className={styles["header-right"]} onClick={hideMenu}>
            <span className={styles.links}>
            <ShowOnLogout>
              <NavLink className={activeLink} to="/login">
                Login
              </NavLink>
              </ShowOnLogout>
              <ShowOnLogin>
              <a href="#" style={{color:'#ff7722'}}>
                <FaUserCircle /> Hi, &nbsp;
                {displayname}
              </a>
              </ShowOnLogin>
              <ShowOnLogin>
              <NavLink className={activeLink} to="/order-history">
                My Order
              </NavLink>
              </ShowOnLogin>
              <ShowOnLogin>
              <NavLink to="/" onClick={userLogout}>
                Logout
              </NavLink>
              </ShowOnLogin>
            </span>
            {cart}
          </div>
        </nav>
        <div className={styles["menu-icon"]}>
          {cart}
          <HiOutlineMenuAlt3 size={28} onClick={toggleMenu} />
        </div>
      </div>
    </header>
  );
};

export default Header;
