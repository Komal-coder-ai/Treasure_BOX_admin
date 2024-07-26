import React, { useState } from 'react'
import Box from '@mui/material/Box';
import InputField from '../../Components/Input';
import { useFormik } from "formik";
import { FormControl, Grid, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Typography } from '@mui/material';
import { LoginFormSchema } from "../../utils/Schema";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import "./index.css"
import logo from "../../assets/logo.png"
import { useNavigate } from 'react-router-dom';
import { signinApi, postApiCallToken } from '../../API/baseUrl';
import ToastMessage from '../../utils/ToastMessage';
import ButtonComponent from '../../Components/Button';

const initialValues = {
  email: "",
  password: "",
}

const Signin = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: LoginFormSchema,
      onSubmit: () => submitForm()
    });
    
  const handleSubmit2 = (e) => {
    e.preventDefault()
    handleSubmit()
    console.log("error", errors)
    console.log("values", values)
  }

  // -------------------------------------------api call---------------------------------------------
  const submitForm = async () => {
    const apiValue = {
      email: values.email,
      password: values.password
    }
    try {
      setLoading(true)
      const result = await postApiCallToken(signinApi, apiValue)
      if (result.data.status) {
        setLoading(false)
        navigate("/dashboard/app")
        ToastMessage("success", result.data.message);
        values.email = ""
        values.password = ""
        localStorage.setItem("auth", true);
        localStorage.setItem('accessToken', result.data.accessToken);
        localStorage.setItem('refreshToken', result.data.refreshToken);
      } else {
        ToastMessage("error", result.data.message);
      }
    } catch (error) {
      console.error(error)

    } finally {
      setLoading(false)
    }

  }
  // ----------------------------------------------api call-----------------------------------------------
  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: 'center'
      }}
    >
      <Typography sx={{ my: 2 }}>
        <img src={logo} alt='logo' width="300" height="80" />
      </Typography>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit2}
        sx={{ mt: 1 }}
      >
        <InputField label="Email" placeholder="email" name="email" value={values.email} type="email"
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.email && touched.email ? (
          <p className="form-error">{errors.email}</p>
        ) : null}
        <FormControl variant="outlined" fullWidth sx={{mt:2}}>
          <InputLabel htmlFor="password" required >Password</InputLabel>
          <OutlinedInput
            name="password"
            autoComplete='off'
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"

          />
          {errors.password && touched.password ? (
            <p className="form-error">{errors.password}</p>
          ) : null}
        </FormControl>
        <Grid sx={{display:"flex", justifyContent:"center", mt:5}}>
        <ButtonComponent btn_name="Sign In" loading={loading} type="submit"/>
        </Grid>
      </Box>
    </Box>
  )
}

export default Signin;