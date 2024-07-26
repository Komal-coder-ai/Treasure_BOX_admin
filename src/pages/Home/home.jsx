import { Box, Container, Grid, Paper } from '@mui/material';
import React, { useEffect } from 'react'
import Deposits from '../../Components/chart/deposite';
import Orders from '../../Components/chart/order';
import {categorycountApi, datacountApi, getApiCall, getApiCallToken, getordercount } from '../../API/baseUrl';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [productcount , setProductcount]= useState("")
  const [categorycount , setCategorycount]= useState("")
  const [bannercount , setBannercount]= useState("")
  const [ordercount , setOrdercount]= useState("")
  const navigate = useNavigate();


  const handleDatacount = async () => {
    // const result = await getApiCall(datacountApi)
    const result = await getApiCallToken(datacountApi)
    setProductcount(result.data.data)
    setBannercount(result.data.banner)
  }
  const handleordercount = async () => {
    const result = await getApiCallToken(getordercount)
    setOrdercount(result.data.Count)
  }

  useEffect(() => {
    handleDatacount()
    handleordercount()
  }, [])


  const handlecategorycount = async () => {
    const result = await getApiCallToken(categorycountApi)
    setCategorycount(result.data.category)
  }

  useEffect(() => {
    handlecategorycount()
  }, [])



  const gotoproduct = () => {
    navigate("/dashboard/products")
  }

  const gotocategory = () => {
    navigate("/dashboard/category")
  }

  const gotobanner = () => {
    navigate("/dashboard/banner")
  }

  const gotoOrder = () => {
    navigate("/dashboard/order")
  }




  return (
    <Box
    component="main"
    sx={{
      backgroundColor: (theme) =>
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[900],
      flexGrow: 1,
      overflow: 'auto',
    }}
  >
   
    <Container maxWidth="100%" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Deposits title="Products" count={productcount} onClick={gotoproduct}/>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Deposits title="Category" count={categorycount}  onClick={gotocategory}/>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Deposits title="Orders" count={ordercount}  onClick={gotoOrder}/>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Deposits title="Banner" count={bannercount}  onClick={gotobanner}/>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Orders/>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  </Box>
  )
}

export default Home;