
import { Box, Grid, TextField } from '@mui/material'
import { Container } from '@mui/material';
import './index.css'
import InputField from '../../Components/Input'
import { useFormik } from 'formik'
import { deliveryChargesSchema } from '../../utils/Schema'
import { LoadingButton } from '@mui/lab';
import { deliveryChargesApi, getApiCallToken, getdeliveryvalue, postApiCallToken, updatedeliverycharge } from '../../API/baseUrl'
import ToastMessage from '../../utils/ToastMessage'
import { useEffect, useState } from 'react'
import SearchToolbar from '../../Components/Search/Search'
import { DeliveryHeading } from '../../Components/Heading';
import ButtonComponent from '../../Components/Button';

const DeliveryCharges = () => {
    const [totalamount , setTotalamount] = useState("")
    const [deliverycharge , setDeliverycharge] = useState("")
    const [loading , setLoading] = useState(false)


    const initialValues = {
        fixDeliveryCharges: "",
        minimumDeliveryCharges:""
    }

    const { values, errors, touched, handleBlur, handleSubmit, handleChange, setFieldValue } =
        useFormik({
            initialValues,
            validationSchema: deliveryChargesSchema,
            onSubmit: () => deliveryChargesApiFunc(),
        });


        const getdelivery = async () => {
            try {
              const {data} = await getApiCallToken(getdeliveryvalue)
              if (data?.status) {
                setFieldValue("fixDeliveryCharges",data?.data.cart_value)
                setFieldValue("minimumDeliveryCharges",data?.data.delivery_charges)
              } else {
                ToastMessage("error", data?.message);
              }
            } catch (error) {
              console.log("error", error);
            } finally {
            }
          }
        
    useEffect(() => {
            getdelivery()
    }, [])
        


    const deliveryChargesApiFunc = async () => {
        setLoading(true)
        try {
            const result = await postApiCallToken(`${updatedeliverycharge}/${1}`,
                {
                    cart_value: values.fixDeliveryCharges,
                    delivery_charges: values.minimumDeliveryCharges
                }
            )
            if (result.data.status) {
                setLoading(false)
                ToastMessage('success', result.data.message)
            }
        } catch (error) {
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


    return (

        <Box
            component='form'
            onSubmit={submitFixCharge}
            className='deliveryChargesClassOutside'
        >

{DeliveryHeading}




            <Grid container spacing={2} className='deliveryChargesClass'>


                <Grid item xs={12} lg={12} md={12}>
                    <TextField

                        sx={{ width: '100%' }}
                        name="fixDeliveryCharges"
                        type="text"
                        label="Total amount"
                        value={values.fixDeliveryCharges}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.fixDeliveryCharges && Boolean(errors.fixDeliveryCharges)}
                        helperText={touched.fixDeliveryCharges && errors.fixDeliveryCharges}
                    />
                </Grid>
                <Grid item xs={12} lg={12} md={12}>
                    <TextField
                        sx={{ width: '100%' }}
                        name="minimumDeliveryCharges"
                        type="text"
                        label="Delivery Charge"
                        value={values.minimumDeliveryCharges}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.minimumDeliveryCharges && Boolean(errors.minimumDeliveryCharges)}
                        helperText={touched.minimumDeliveryCharges && errors.minimumDeliveryCharges}
                    />
                </Grid>
                <Grid item xs={12} lg={12} md={12} className='delivery_btn'>
                <ButtonComponent btn_name="UPDATE" loading={loading} type="submit" /> 
                </Grid>


            </Grid>
        </Box>
    )
}
export default DeliveryCharges