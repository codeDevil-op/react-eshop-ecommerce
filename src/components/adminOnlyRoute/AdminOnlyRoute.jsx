import React from 'react'
import { selectEmail } from '../../redux/slice/authSlice'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export const AdminOnlyLink = ({children}) => {
  const userEmail = useSelector(selectEmail)
  // console.log(userEmail)
if(userEmail===import.meta.env.REACT_APP_ADMIN_USER){
  return children
}
return null
}

const AdminOnlyRoute = ({children}) => {
    const userEmail = useSelector(selectEmail)
    // console.log(userEmail)
  if(userEmail===import.meta.env.REACT_APP_ADMIN_USER){
    return children
  }
  return(
    <section style={{height:'80vh'}}>
    <div className='container'>
      <h2>Permision Denied</h2>
      <p>This Page is only be access by the admin user!</p>
      <br />
      <Link to='/'>
      <button className='--btn'>&larr; Back To Home</button>
      </Link>
    </div>
    </section>
  )
}


export default AdminOnlyRoute