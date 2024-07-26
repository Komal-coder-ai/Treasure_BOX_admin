import { Container, Divider, Grid, IconButton, Paper, Typography } from '@mui/material';
import ButtonComponent from '../../Components/Button'
import InputField from '../../Components/Input'
import React, { useState } from 'react'
import { useFormik } from 'formik';
import { SpecialProductsSchema } from '../../utils/Schema';
import SearchIcon from '@mui/icons-material/Search';
import "./index.css"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import ToastMessage from '../../utils/ToastMessage';
import { DeleteselectedApi, ImageUrl, TitleSearchApi, TitleSearcheditApi, addTitleApi, deleteApiCall, deleteApiCallToken, getApiCallToken, getTitle, postApiCallToken, updateTitleApi } from '../../API/baseUrl';
import { useEffect } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import swal from 'sweetalert';


const SpecialProducts = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchtext] = useState();
  const [edit, setEdit] = useState(false)
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([])
  const [newlyAdded, setNewlyAdded] = useState([])
  const navigate = useNavigate();


  // ---------------------------------------Search Functionality start---------------------------------------------


  const handleOnSearchChange = async (e) => {
    setSearchtext(e.target.value)
    const seletedId = selectedProduct.map((item) => item.productId)
    try { 
      let result
      if (id) {
        result = await postApiCallToken(TitleSearcheditApi, {
            title_id_fk: id? id : "",
            search: e.target.value,
            productId: seletedId.join(", "),
          }) 
      } else {
        result = await postApiCallToken(TitleSearchApi, {
          limit: "",
          offset: "",
          search: e.target.value,
          column_name: "",
          sort_by: ""
          }) 
      }
      if (result.data.status) {
        setData(result.data.data)
      }
    } catch (error) {
      console.log("error", error);
    } finally {
    }
  };

  const onlistClick = (value) => {
    
    if(id){
      
      let checknewlyExist = newlyAdded.filter((item) => {
        return item.id === value.id
      })
      if (checknewlyExist.length) {
        ToastMessage("error", "Product is already selected");
      } else {
  
        setNewlyAdded([...newlyAdded, value])
      }
      let main = data.filter((val) => {
        return val.id !== value.id
      })
      setData([...main])
    }

    else{
      let checkExist = selectedProduct.filter((item) => {
        return item.id === value.id
      })
      if (checkExist.length) {
        ToastMessage("success", "Product is already selected");
      } else {
  
        setSelectedProduct([...selectedProduct, value])
      }
      let main = data.filter((val) => {
        return val.id !== value.id
      })
      setData([...main])
    }
  }
 
  // ---------------------------------------Search Functionality end---------------------------------------------

  const initialValues = {
    title_name: "",
    Products: "",
  }

  const { values, errors, touched, handleBlur, handleSubmit, handleChange , setFieldValue} =
    useFormik({
      initialValues,
      validationSchema: SpecialProductsSchema,
      onSubmit: () => handleAddTitle(),

    });
    useEffect(()=>{
      setFieldValue("Products" , selectedProduct.length ? selectedProduct.length : "" )
    },[selectedProduct.length])
  // -----------------------------------------get Title api start-----------------------------------

  const editTitle = async () => {
    try {
      const result = await getApiCallToken(`${getTitle}/${id}`)
      if (result?.data?.status) {
        ToastMessage("success", result.data.message);
        setEdit(true)
        values.title_name = result.data.products[0].product_title_title_name
        setSelectedProduct([...result.data.products])
      } else {
        ToastMessage("error", result.data.message);
      }
    } catch (error) {
      setEdit(false)
    }
  }

  useEffect(() => {
    if (id) {
      editTitle()
    }
  }, [])

  // ----------------------------------------------Delete Api---------------------------------------------
  const handleDeleteAlert = (id) => {
    swal({
        title: "Are you sure you want to delete?",
        text: "Once deleted, You won't be able to revert this!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
          handleDelete(id)
        }
    });
}


  const handleDelete = async (id) => {
    try {
      const result = await deleteApiCallToken(`${DeleteselectedApi}/${id}`)
      if (result?.data?.status) {
        ToastMessage("success", result.data.message);
        editTitle()
      } else {
        ToastMessage("error", result.data.message);
      }
    } catch (error) {
     
    }
  }

  // ----------------------------------Add edit api call start-------------------------------------

  const handleAddTitle = async () => {

    const seletedId = selectedProduct.map((item) => item.id)
    const newlyaddedId = newlyAdded.map((item) => item.id)
    try {
      setLoading(true)
      let result
      if (id) {
        result = await postApiCallToken(`${updateTitleApi}/${id}`, {
          title_name: values.title_name,
          is_active: 1,
          productId: newlyaddedId
        })
      } else {
        result = await postApiCallToken(addTitleApi, {
          title_name: values.title_name,
          is_active: 1,
          productId: seletedId
        })
      }
      if (result.data.status) {
        setLoading(false)
        navigate("/dashboard/Special")
        ToastMessage("success", result.data.message);
      } else {
        ToastMessage("error", result.data.message);

      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }
  // ---------------------------------  Add edit api call End   -------------------------------------

  const submitSpecialProducts = (e) => {
    e.preventDefault()
      handleSubmit()
  }

  const clearsearch = () => {
    setSearchtext('')
  }

  const handleGoBacked = () => {
    navigate("/dashboard/Special")
  }
  const clickSelected = (item) => {
    if (item.id){
      const main = selectedProduct.filter((val) => {
        return val.id !== item.id
      })
      setSelectedProduct([...main])
      setData([...data, item])
    }
   else if (item.productId){
    const main = selectedProduct.filter((val) => {
      return val.productId !== item.productId
    })
    setSelectedProduct([...main])
    setData([...data, item])
   }
  }
  const clicknewlyadded = (item) => {
      const main = newlyAdded.filter((val) => {
        return val.id !== item.id
      })
      setNewlyAdded([...main])
      setData([...data, item])
  }

  return (
    <>
      <Container component={"form"} maxWidth="false" className="containerdivuser" onSubmit={submitSpecialProducts}>
        <Grid container spacing={4} sx={{ display: 'flex', py: 3 }}>
          <Grid item xs={12} sm={12} md={12} lg={12} sx={{ alignItems: 'center', display: 'flex', fontWeight: 'bold' }}>
            <ArrowBackIcon className='arrow_back' onClick={handleGoBacked} />
            <Typography variant="h4" component="h4" sx={{ fontWeight: 'bold', mx: 1 }}>
              {id ? 'Edit Title' : 'Add Title'}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6} >
            <InputField label="Title" placeholder="Title" name="title_name" value={values.title_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.title_name && Boolean(errors.title_name)}
              helperText={touched.title_name && errors.title_name}
            />
            {errors.title_name && touched.title_name ? (
              <p className="form-error">{errors.title_name}</p>
            ) : null}
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column' }}>
            <Paper
              sx={{ display: 'flex', alignItems: 'center', width: '100%', p: "5px" }}
            >
              <input class="input" placeholder="Search..."
                required="" 
                onChange={(e) => handleOnSearchChange(e)}
                type="search"
                value={searchText}
              />
              {searchText ?
                <button class="reset" type="reset" onClick={clearsearch}>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button> :
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                  <SearchIcon />
                </IconButton>}



            </Paper>
            {searchText ? <Paper
              sx={{ width: '100%', zIndex: 1, px: 3 , height: '100px', overflowY:"scroll" }}
            >
              {data.map((item, index) => {
                return (
                  <>
                    <p onClick={() => onlistClick(item)} className='listClick'> {item.productName} </p>
                    <Divider />
                  </>
                )
              })}
            </Paper>
              : ""}
          </Grid>

          {id?
           <Grid item xs={12} md={12} >
           <h1 className='selected_heading'>Newly Added</h1>
           <Container className='specialproduct_container'>
             <Grid container sx={{ display: 'flex', gap: 1 }}>
               {newlyAdded.map((item) => {
                 return (
                   <Grid item xs={6} md={4} className='product_container_box'>
                     <div className='image_div'>
                       <img src={`${ImageUrl}${item?.files}`} alt='image' height={80} width={80} />
                     </div>
                     <div>
                       <p className='product_data_list'>{item.productName}</p>
                       <p className='product_data'>{item.category_name}</p>
                       <p className='product_data align'><CurrencyRupeeIcon sx={{fontSize:"14px"}} />{item.mrp_amount}/-</p>
                     </div>
                       <button onClick={() => clicknewlyadded(item)}  type='button' className='product_remove_btn'><DeleteForeverIcon sx={{ color: "red" }} /></button>
                   </Grid>
                 )
               })}
             </Grid>
           </Container>
         </Grid>  : ""}

         

          <Grid item xs={12} md={12} >
            <h1 className='selected_heading'>Selected Products</h1>
            <Container className='specialproduct_container'>
              <Grid container sx={{ display: 'flex', gap: 1 }}>
                {selectedProduct.map((item) => {
                  return (
                    <Grid item xs={6} md={4} className='product_container_box'>
                      <div className='image_div'>
                        <img src={`${ImageUrl}${item?.files}`} alt='image' height={80} width={80} />
                      </div>
                      <div>
                        <p className='product_data_list'>{item.productName}</p>
                        <p className='product_data'>{item.category_name}</p>
                        <p className='product_data align'><CurrencyRupeeIcon sx={{fontSize:"14px"}} />{item.mrp_amount}/-</p>
                        {/* <p >{item.description}</p> */}
                      </div>
                      {id? <button onClick={() => handleDeleteAlert(item.id? item.id: "")}  type='button' className='product_remove_btn'><DeleteForeverIcon sx={{ color: "red" }} /></button>
                  :
                  <button onClick={() => clickSelected(item)}  type='button' className='product_remove_btn'><DeleteForeverIcon sx={{ color: "red" }} /></button>      
                  }
                        </Grid>
                  )
                })}
              </Grid>
            </Container>
            {errors.Products && touched.Products ? (
              <p className="form-error">{errors.Products}</p>
            ) : null}
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: "flex", justifyContent: "end" }}>
          {edit ? <ButtonComponent btn_name="UPDATE" loading={loading} type="submit" /> :
           <ButtonComponent btn_name="SUBMIT" loading={loading} type="submit" />
          }
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default SpecialProducts;

