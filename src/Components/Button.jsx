import React from 'react'
import "./Button.css"
import { ThreeDots } from 'react-loader-spinner';


const loader = <>
  Loading
  <ThreeDots
    height="20"
    width="20"
    radius="9"
    color="var(--white)"
    wrapperStyle={{}}
    ariaLabel="three-dots-loading"
    wrapperClassName=""
    visible={true}
  />
</>
const ButtonComponent = ({ loading, disabled, btn_name, type, fullWidth , onClick }) => {
  

  return (
    
    <button disabled={loading} className='loading_btn' type={type} onClick={onClick}>{loading ? loader : btn_name}</button>
 
  
  )
}

export default ButtonComponent;
