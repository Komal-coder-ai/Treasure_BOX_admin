import { Box, Grid,Typography, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { deliveryChargesSchema, discountSchema, discountfieldschema } from '../../utils/Schema'
import {  addDiscountApi, getApiCallToken, getDiscountApi, getdeliveryvalue, postApiCallToken, updateDiscountApi, updatedeliverycharge } from '../../API/baseUrl'
import ToastMessage from '../../utils/ToastMessage'
import { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ButtonComponent from '../../Components/Button';
import { useNavigate, useParams } from "react-router-dom"

const Discount = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [loading , setLoading] = useState(false)
    const [edit, setEdit] = useState(false)
    const [ischeckvalue, setIscheckvalue] = useState(true)
    

    const initialValues = {
        discount_percent: "",
        minimum_order_amount:"",
        coupon_code:"",
    }


    const { values, errors, touched, handleBlur, handleSubmit, handleChange, setFieldValue } =
        useFormik({
            initialValues,
            validationSchema: ischeckvalue ? discountfieldschema :discountSchema,
            onSubmit: () => deliveryChargesApiFunc(),
        });

    const getdiscount = async () => {
        setEdit(false)
        try {
          const result = await getApiCallToken(`${getDiscountApi}/${id}`)
          if (result?.data?.status) {
            setEdit(true)
            const { minimum_order_amount,coupon_code, discount_percent } = result?.data?.data || {}


           values.minimum_order_amount = minimum_order_amount
           values.coupon_code = coupon_code
           values.discount_percent = discount_percent

          } else {
            ToastMessage("error", result.data.message);
          }
        } catch (error) {
          console.log("error", error);
        } finally {
          setEdit(true)
        }
      }
    
      useEffect(() => {
        if (id) {
          getdiscount()
        }
      }, [])


      useEffect(() => {
        const length = values.coupon_code?.length
        setIscheckvalue(length === 0 ? true : false)
      }, [values.coupon_code])
        

    const deliveryChargesApiFunc = async () => {
        const apivalue = {
            discount_percent: values.discount_percent,
            minimum_order_amount: values.minimum_order_amount,
            coupon_code: values.coupon_code
          }
        try {
            setLoading(true)
            let result
            if (id) {
              result = await postApiCallToken(`${updateDiscountApi}/${id}`,apivalue )
            } else {
              result = await postApiCallToken(addDiscountApi, apivalue)
            }
            if (result.data.status) {
              ToastMessage("success", result.data.message);
              setLoading(false)
            } else {
              ToastMessage("error", result.data.message);
      
            }
          }
         catch (error) {
            console.log("error", error);
        }
        finally{
            setLoading(false)
        }
    }


    const submitFixCharge = (e) => {
        e.preventDefault()
        handleSubmit()
    }
    const handleGoBacked = () => {
        navigate("/dashboard/discount")
    }


    return (

        <Box
            component='form'
            onSubmit={submitFixCharge}
            className='deliveryChargesClassOutside'
        >

            <Grid container spacing={2} className='deliveryChargesClass'>

            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ alignItems: 'center', display: 'flex', fontWeight: 'bold' }}>
            <ArrowBackIcon onClick={handleGoBacked} className='arrow_back' />
            <Typography variant="h4" component="h4" sx={{ fontWeight: 'bold', mx: 1 }}>
              {edit ? 'Edit Discount' : 'Add Discount'}
            </Typography>
          </Grid>


                <Grid item xs={12} lg={12} md={12}>
                    <TextField

                        sx={{ width: '100%' }}
                        name="discount_percent"
                        type="number"
                        label="Discount (In %)"
                        value={values.discount_percent}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.discount_percent && Boolean(errors.discount_percent)}
                        helperText={touched.discount_percent && errors.discount_percent}
                    />
                </Grid>
                <Grid item xs={12} lg={12} md={12}>
                    <TextField
                        sx={{ width: '100%' }}
                        name="minimum_order_amount"
                        type="text"
                        label="Order Amount"
                        value={values.minimum_order_amount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.minimum_order_amount && Boolean(errors.minimum_order_amount)}
                        helperText={touched.minimum_order_amount && errors.minimum_order_amount}
                    />
                </Grid>
                <Grid item xs={12} lg={12} md={12}>
                    <TextField
                        sx={{ width: '100%' }}
                        name="coupon_code"
                        type="text"
                        label="Coupon code"
                        value={values.coupon_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.coupon_code && Boolean(errors.coupon_code)}
                        helperText={touched.coupon_code && errors.coupon_code}
                    />
                </Grid>
                <Grid item xs={12} lg={12} md={12} className='delivery_btn'>
                <ButtonComponent btn_name={edit ? "UPDATE" : "SUBMIT"} loading={loading} type="submit" /> 
                </Grid>


            </Grid>
        </Box>
    )
}
export default Discount;