import React from 'react'
import styles from './search.module.scss'
import {BiSearch} from 'react-icons/bi'
const Search = ({value,onChange}) => {
  return (
    <>
        <div className={styles.search}>
        <BiSearch size={18} className={styles.icon}/>
        <input type="text" placeholder='search by name...'  value={value} onChange={onChange}/>
        </div>
    </>
  )
}

export default Search