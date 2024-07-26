import React from 'react'
import TextField from '@mui/material/TextField';
const InputField = ({label,placeholder,name,value,onChange,onBlur,type, disabled , index, disable,size}) => {
  return (
    <div>
        <TextField name={name} disabled={disabled || disable} label={label} placeholder={placeholder} value={value} variant="outlined" 
         fullWidth autoComplete='off' type={type} onChange={(e)=>onChange(e , index , name)} onBlur={onBlur} 
         sx={{minWidth:"300px"}} 
         size={size? size :""}
         />
    </div>
  )
}

export default InputField;