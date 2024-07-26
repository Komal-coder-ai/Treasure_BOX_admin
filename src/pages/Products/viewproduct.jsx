
import { Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from "react-router-dom"
import { useFormik } from "formik";
import { FileUploader } from 'react-drag-drop-files';
import { TagsInput } from 'react-tag-input-component';
import { ImageUrl, ProductImageDeleteApi, ProductImageUpdateApi, addProductApi, categoryList, deleteApiCallToken, deletecolorsizeApi, getApiCallToken, getProductApi, getgstdataApi, postApiCallToken, similarCategoryList, sizecolorAdd, sizecolorUpdate, subCategoryList, updateProductApi } from '../../API/baseUrl';
import ToastMessage from '../../utils/ToastMessage';
import CkEditor from '../../Components/ckEditor';
import InputField from '../../Components/Input';

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [edit, setEdit] = useState(false)
  const [apivalue, setApiValue] = useState()
  const [title, setTitle] = useState([{ title: "", value: "" }])
  const [sizeArray, setSizeArray] = useState([{ product_size: "FreeSize", color_code: "", color_name: "", colorImage: "" }])
  const [categoryName, setCategoryName] = useState([])
  const [subCategoryName, setSubCategoryName] = useState([])
  const [similarCategoryName, setSimilarCategoryName] = useState([])
  const [loading, setLoading] = useState(false)
  const [imgUrl, setImgUrl] = useState([])
  const [editimgUrl, setEditimgUrl] = useState([])
  const [image, setImage] = useState([]);
  const [secondaryimgUrl, setSecondaryimgUrl] = useState("")
  const [secondaryimage, setSecondaryimage] = useState([]);
  const [subcategoryEmpty, setSubcategoryEmpty] = useState(false);
  const [freesize, setFreesize] = useState(false);
  const [freecolor, setFreecolor] = useState(false);
  const [subCategoryId, setCategoryId] = useState("")
  const [gstdata, setGstdata] = useState([])
  const [productid, setProductid] = useState("")
  const [currentBtnIndex, setCurrentBtnIndex] = useState()

  const initialValues = {
    product_name: "",
    files: "",
    description: "",
    mrp_amount: 0,
    gst: 0,
    taxable_amount: "",
    category_Id: "",
    similar_category: "",
    subCategory_Id: "",
    general: "",
    sku: "",
    orderlimit: "",
    color_code: "",
    color_name: "",
    product_size: "FreeSize",
    thumbnailImage: "",
    editid: edit
  }


  const handleUploadeditChange = (file) => {
    const imageeditArr = Object.entries(file).map((img) =>
      URL.createObjectURL(img[1])
    )
    setEditimgUrl([...editimgUrl, ...imageeditArr])
    // setImage(file)
    const nestedaray = [...file, image]
    setImage(nestedaray.flat())
    setFieldValue("files", file)
  };
  // ========================size Color delete api=====================================================



  const handlesecondaryUploadChange = (file) => {
    setSecondaryimgUrl(URL.createObjectURL(file[0]))
    setSecondaryimage(file[0])
    setFieldValue("thumbnailImage", file[0])
  };

  const { values, errors, touched, handleBlur, handleSubmit, handleChange, setFieldValue } =
    useFormik({
      initialValues,
      validationSchema: "",
      onSubmit: () => sendData(),
    });

  const submitFormData = (e, imageList) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    formData.delete("category_Id")
    formData.append("category_Id", values.category_Id)
    formData.delete("subCategory_Id")
    formData.append("subCategory_Id", values.subCategory_Id)
    formData.delete("similar_category")
    formData.append("similar_category", values.similar_category)
    formData.delete("files")
    formData.delete("thumbnailImage")
    if (!id) {

      for (let index = 0; index < image.length; index++) {
        const element = image[index];
        formData.append(`files`, element);
      }
      formData.append(`thumbnailImage`, secondaryimage);
    }
    formData.append("description", values.description)
    formData.append("general", JSON.stringify(title));
    setApiValue(formData)
    handleSubmit();
  }

  // ---------------------------------------get product-------------------------------------
  const editProduct = async () => {
    setEdit(false)
    try {
      const result = await getApiCallToken(`${getProductApi}${id}`)
      if (result?.data?.status) {
        ToastMessage("success", result.data.message);
        setEdit(true)
        const { productName, gst, mrp_amount, thumbnail, orderlimit, SKU, description, taxable_amount, subCategoryId, categoryId, similarId } = result?.data?.data || {}
        const { original } = result?.data?.images || {}
        setImgUrl(result?.data?.images)
        setCategoryId(categoryId)
        setSecondaryimage(thumbnail)
        setImage(original)

        { (result?.data?.Detail).length ? setTitle(result?.data?.Detail) : setTitle([{ title: "", value: "" }]) }

        { (result?.data?.Info).length ? setSizeArray(result?.data?.Info) : setSizeArray([]) }

        setSecondaryimgUrl(`${ImageUrl}${thumbnail}`)
        values.product_name = productName
        values.taxable_amount = taxable_amount
        values.mrp_amount = mrp_amount
        values.description = description
        values.category_Id = categoryId
        values.subCategory_Id = subCategoryId
        values.similar_category = similarId
        values.gst = gst
        values.sku = SKU
        values.orderlimit = orderlimit
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
      editProduct()
    }
  }, [])

  // --------------------------------------------get product-------------------------------------------
  const sendData = async () => {
    try {
      setLoading(true)
      let result
      if (id) {
        result = await postApiCallToken(`${updateProductApi}${id}`, {
          product_name: values.product_name,
          orderlimit: values.orderlimit,
          description: values.description,
          mrp_amount: values.mrp_amount,
          gst: values.gst,
          sku: values.sku,
          taxable_amount: values.taxable_amount,
          similar_category: values.similar_category,
          category_Id: values.category_Id,
          subCategory_Id: values.subCategory_Id,
          general: JSON.stringify(title),
          colorSize: JSON.stringify(sizeArray),
          colorId: "",

        })
      } else {
        result = await postApiCallToken(addProductApi, apivalue)
      }
      if (result.data.status) {
        ToastMessage("success", result.data.message);
        setLoading(false)
        setProductid(result.data.data.id)
      } else {
        ToastMessage("error", result.data.message);

      }
    } catch (error) {
      console.log("error", error);
    }
  }
  // ----------------------------------------------on submit-----------------------------------------

  const handleGoBacked = () => {
    values.product_name = ""
    values.mrp_amount = ""
    values.taxable_amount = ""
    values.files = ""
    values.description = ""
    values.similar_category = ""
    values.category_Id = ""
    values.subCategory_Id = ""
    values.gst = ""
    navigate("/dashboard/order")
  }

  const editproduct = () => {
    navigate(`/dashboard/products_add/${id}`)
  }

  // ----------------------------------------------ck editor------------------------------------------------------

  const ckChange = (text, type, key, index) => {
    values.description = type.getData()
  }

  const handleCategoryList = async () => {
    const result = await getApiCallToken(categoryList)
    setCategoryName(result?.data?.data)
  }

  useEffect(() => {
    handleCategoryList()
  }, [])

  const handleSimilarCategoryList = async () => {
    const result = await getApiCallToken(similarCategoryList)
    setSimilarCategoryName(result?.data?.data)
  }

  useEffect(() => {
    handleSimilarCategoryList()
  }, [])

  const handleSubCategoryList = async (id) => {
    const result = await getApiCallToken(`${subCategoryList}/${id}`)
    setSubCategoryName(result?.data?.list)
  };

  const checkArrId = (arr, id) => {
    const data = arr?.filter((item) => item.id == id);
    return data;
  };


  const checkArrvalue = (arr, value) => {
    const data = arr?.filter((item) => item.gst_percentage == value);
    return data;
  };



  useEffect(() => {
    if (id && subCategoryId) {
      handleSubCategoryList(subCategoryId)
    }
  }, [subCategoryId])

  const handleAutocomplete = (data, val, type, value) => {
    if (type === "category_Id") {
      handleSubCategoryList(val.id)
      values.subCategory_Id = ""
      setSubcategoryEmpty(!subcategoryEmpty)
    }
    setFieldValue(type, val.id)
  }

  const fileTypes = ["JPG", "PNG", "GIF"];

  // ------------------------------------------------------------------------------------------------------------
  const calculation = (value, mrpvalue) => {
    const Percentage = (mrpvalue / (value + 100)) * 100
    values.taxable_amount = Number(Percentage).toFixed(2)
  }

  useEffect(() => {
    calculation(values.gst, values.mrp_amount)
  }, [values.mrp_amount, values.gst])



  const handlegstchange = (data, val, type) => {
    setFieldValue(type, val.gst_percentage)
    calculation(val.gst_percentage, values.mrp_amount)
  }
  const getgstdata = async () => {
    const result = await getApiCallToken(getgstdataApi)
    setGstdata(result?.data?.data)
  }

  useEffect(() => {
    getgstdata()
  }, [])


  const handleTitleChange = (e, key, index) => {
    title[index][key] = e.target.value
    setTitle([...title])
  };

  const handleSizeChange = (e, index, key) => {
    if (key === "product_size") {
      sizeArray[index][key] = e.join(",")
      setSizeArray([...sizeArray])
    } else if (key === "colorImage") {
      sizeArray[index][key] = e[0]
      setSizeArray([...sizeArray])
    }
    else {
      sizeArray[index][key] = e.target.value
      setSizeArray([...sizeArray])
    }
  };

  return (
    <div>

      <Box component="form" onSubmit={submitFormData}>
        <Grid container spacing={4} sx={{ display: 'flex', p: 3 }}>
          <Grid item xs={12} sm={12} md={12} lg={12} sx={{ alignItems: 'center', display: 'flex', fontWeight: 'bold',justifyContent:"space-between" }}>
            <Grid sx={{ alignItems: 'center', display: 'flex', fontWeight: 'bold'}}>
              <ArrowBackIcon onClick={handleGoBacked} className='arrow_back' />
              <Typography variant="h4" component="h4" sx={{ fontWeight: 'bold', mx: 1 }}>
                Product View
              </Typography>
            </Grid>
            <Grid>
              <button className='view_btn_orderdetail viewedit_btn' style={{ cursor: "pointer" }} onClick={() => editproduct()}>Edit</button>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} sx={{}}>
            <InputField label="Product Name" disabled={id} name="product_name" value={values.product_name} type="Text"
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} sx={{ display: "flex" }}>
            <Grid item xs={11} sm={11} md={12} lg={12}>
              <Autocomplete
                disabled={id}
                disablePortal
                disableClearable
                key={checkArrId(categoryName, values?.category_Id)[0]?.category_name}
                options={categoryName}
                getOptionLabel={(option) => option.category_name}
                isOptionEqualToValue={(option, value) => value.id === option.id}
                defaultValue={checkArrId(categoryName, values.category_Id)[0]}
                onChange={(data, val) => handleAutocomplete(data, val, "category_Id",)}
                renderInput={(params) => (
                  <TextField
                    onBlur={handleBlur}
                    name="category_Id"
                    label="Category"
                    {...params}

                  />
                )}
              />
              {errors.category_Id && touched.category_Id ? (
                <p className="form-error">{errors.category_Id}</p>
              ) : null}
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} sx={{ mt: 2, display: "flex" }}>
            <Grid item xs={11} sm={11} md={12} lg={12}>
              <Autocomplete
                disabled={id}
                disablePortal
                disableClearable
                key={subCategoryName}
                options={subCategoryName}
                getOptionLabel={(option) => option.subCategory_name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                defaultValue={checkArrId(subCategoryName, values?.subCategory_Id)[0]}
                onChange={(data, val) => handleAutocomplete(data, val, "subCategory_Id")}
                renderInput={(params) => (
                  <TextField
                    onBlur={handleBlur}
                    name="subCategory_Id"
                    label="Sub Category"
                    {...params}
                  />

                )}
              />
              {errors.subCategory_Id && touched.subCategory_Id ? (
                <p className="form-error">{errors.subCategory_Id}</p>
              ) : null}
            </Grid>
          </Grid>

          <Grid item xs={12} md={6} mb={1} sx={{ mt: 2 }}>
            <Autocomplete
              disablePortal
              disabled
              disableClearable
              key={checkArrId(similarCategoryName, values?.similar_category)[0]?.category_name}
              options={similarCategoryName}
              getOptionLabel={(option) => option.category_name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              defaultValue={checkArrId(similarCategoryName, values?.similar_category)[0]}
              onChange={(data, val) => handleAutocomplete(data, val, "similar_category")}
              renderInput={(params) => (
                <TextField
                  onBlur={handleBlur}
                  name="similar_category"
                  label="Similar Category"
                  {...params}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={4} sx={{ mt: 2 }}>
            <InputField label="MRP" disabled={id} name="mrp_amount" value={values.mrp_amount} type="number"
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={4} sx={{ mt: 2 }}>
            <Autocomplete
              disabled={id}
              disablePortal
              disableClearable
              key={checkArrvalue(gstdata, values?.gst)[0]?.gst_percentage}
              options={gstdata}
              getOptionLabel={(option) => option.gst_percentage + "%"}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              defaultValue={checkArrvalue(gstdata, values?.gst)[0]}
              onChange={(gstdata, val) => handlegstchange(gstdata, val, "gst")}
              renderInput={(params) => (
                <TextField
                  onBlur={handleBlur}
                  name="gst"
                  label="GST"
                  {...params}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={4} sx={{ mt: 2 }}>
            <InputField label="Taxable amount" disabled={id} name="taxable_amount" value={values.taxable_amount} type="text"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.taxable_amount && touched.taxable_amount ? (
              <p className="form-error">{errors.taxable_amount}</p>
            ) : null}
          </Grid>

          <Box className='upload_image_box' component="form">
            <Grid container spacing={4} sx={{ display: 'flex', p: 5 }}>
              <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", flexDirection: "column" }} position="relative" className='imageUploadClass'>
                <lable className="product_image_lable">Image</lable>
                <div className="dropzone_container_Product">
                  <div>
                    <FileUploader
                      disabled={id}
                      multiple={true}
                      className="main_drop"
                      handleChange={(e) => handleUploadeditChange(e)}
                      onBlur={handleBlur}
                      name="files"
                      types={fileTypes}
                      fullWidth
                    />
                    {errors.files && touched.files ? (
                      <p className="form-error">{errors.files}</p>
                    ) : null}
                  </div>
                  <div>
                    <div className="upload_images">
                      {imgUrl ? <div className='Dropzone_Preview_container'>
                        {imgUrl.map((item, index) => {
                          return (
                            <>
                              <div>
                                <img src={`${ImageUrl}/${item.original ? item.original : item}`} alt="banner" height={100} width={100} />
                              </div>
                            </>
                          )
                        })}
                      </div>

                        : " "}
                      {editimgUrl.length ? <div className='Dropzone_Preview_container'>
                        {editimgUrl.map((item, index) => {
                          return (
                            <>
                              <div>
                                <img src={item} alt="banner" height={100} width={100} />

                              </div>
                            </>
                          )

                        })}


                      </div>

                        : " "}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", flexDirection: "column" }} position="relative" className='imageUploadClass'>
                <lable className="product_image_lable">Secondary Image</lable>
                <div className="dropzone_container_Product">
                  <div>
                    <FileUploader
                      disabled={id}
                      multiple={true}
                      className="main_drop"
                      handleChange={(e) => handlesecondaryUploadChange(e)}
                      onBlur={handleBlur}
                      name="thumbnailImage"
                      types={fileTypes}
                      fullWidth
                    />
                    {errors.thumbnailImage && touched.thumbnailImage ? (
                      <p className="form-error">{errors.thumbnailImage}</p>
                    ) : null}
                  </div>
                  {secondaryimgUrl ? <div>

                    <img src={secondaryimgUrl} alt="banner" height={100} width={100} />

                  </div>
                    : ""}
                </div>
              </Grid>

            </Grid>
          </Box>


          <Grid item xs={12} sm={12} md={6} lg={6} sx={{}}>
            <InputField label="SKU" disabled={id} name="sku" value={values.sku} type="Text"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.sku && touched.sku ? (
              <p className="form-error">{errors.sku}</p>
            ) : null}
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} sx={{}}>
            <InputField disabled={id} label="Maximum order quantity" name="orderlimit" value={values.orderlimit} type="number"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.orderlimit && touched.orderlimit ? (
              <p className="form-error">{errors.orderlimit}</p>
            ) : null}
          </Grid>

          <Grid item xs={12} md={12} >
            <p>Description</p>
            <CkEditor disabled={id} onChange={(text, type) => ckChange(text, type, "description")}
              data={values.description ? values.description : ""}
              // data={values.description}
              name="description"
              label="description"
              autoComplete="off"
              sx={{ width: '100%' }}
              onBlur={handleBlur}
            />
            {errors.description && touched.description ? (
              <p className="form-error">{errors.description}</p>
            ) : null}
          </Grid>
          <Grid item xs={12} md={12} >
            {/* <p className='generalheading'>General</p> */}
            <Typography variant="h5" component="h5" sx={{ fontWeight: 'bold', mx: 1 }}>
              Specifications</Typography>
            <Grid item xs={12} md={12} lg={12} sx={{ p: 0, m: 0 }}>
              {title.map((item, index) => {
                return (
                  <Grid container spacing={4} sx={{ marginTop: "5px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} sx={{ m: 0 }}>
                      <TextField disabled={id} name="title" label="key" variant="outlined" fullWidth
                        onChange={(e) => handleTitleChange(e, "title", index)}
                        value={item.title}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} md={5} lg={5} sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
                      <TextField disabled={id}
                        name='value'
                        label="value"
                        value={item.value}
                        fullWidth
                        onChange={(e) => handleTitleChange(e, "value", index)}
                      />
                    </Grid>
                  </Grid>
                )
              })}


            </Grid>


          </Grid>
        </Grid>
      </Box>


      <Box className="color_size_container">
        <Grid container spacing={4} sx={{ display: 'flex', p: 3, boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;" }}>

          <Grid item xs={12} sm={12} md={12} lg={12} sx={{ alignItems: 'center', display: 'flex', fontWeight: 'bold' }}>
            <Typography variant="h5" component="h5" sx={{ fontWeight: 'bold', mx: 1 }}>
              {edit ? 'Color And Size' : 'Color And Size'}
            </Typography>
          </Grid>




          <Grid item xs={12} md={12} sx={{ margin: 0, padding: 0 }} >
            {sizeArray.map((item, index) => {
              return (
                <Grid key={index} container spacing={4} sx={{ marginBottom: "40px", boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px;", paddingRight: "15px" }}>

                  <Grid item xs={12} sm={12} md={12} lg={6} sx={{ marginBottom: "5px", display: "flex", justifyContent: "space-between" }}>
                    <Grid item xs={9} sm={12} md={12} lg={9}>
                      <InputField label="Color Code" index={index} name="color_code" value={item.color_code} type="color"
                        onChange={handleSizeChange}
                        onBlur={handleBlur}
                        disabled={id}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={6} sx={{ marginBottom: "5px" }}>
                    <InputField label="Color Name" index={index} name="color_name" value={item.color_name} type="Text"
                      onChange={handleSizeChange}
                      onBlur={handleBlur}
                      disabled={id}
                    />
                    {errors.color_name && touched.color_name ? (
                      <p className="form-error">{errors.color_name}</p>
                    ) : null}
                  </Grid>


                  <Grid className='product_size_container' item xs={12} sm={12} md={12} lg={6} sx={{}}>
                    {/* <Grid item xs={9} sm={9} md={9} lg={9}> */}
                    <TagsInput
                      value={item.product_size.length ? (item.product_size).split(",") : []}
                      name='product_size'
                      required
                      disabled={id}
                      placeHolder="enter Size..."
                      onChange={(e) => handleSizeChange(e, index, "product_size")}
                    />
                    {/* </Grid> */}
                    {/* <button className={`freecolorbtn ${freesize ? "btnactive" : ""} `} onClick={()=>{setFreesize(!freesize)}}>Free Size</button> */}
                  </Grid>


                  <Grid item xs={12} sm={12} md={12} lg={6} sx={{}} position="relative" className='imageUploadClass'>
                    <div className="dropzone_container_colorimg">
                      <FileUploader
                        disabled={id}
                        multiple={true}
                        className="main_drop"
                        handleChange={(e) => handleSizeChange(e, index, "colorImage")}
                        onBlur={handleBlur}
                        name="colorImage"
                        fullWidth
                        types={fileTypes}
                      />
                    </div>
                  </Grid>

                </Grid>
              )
            })}


          </Grid>



        </Grid>


      </Box>

    </div>
  )
}

export default ViewProduct;

