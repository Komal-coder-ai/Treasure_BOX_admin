/* eslint-disable no-lone-blocks */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from "react-router-dom"
import { useFormik } from "formik";
import "./index.css";
import InputField from '../../../Components/Input';
import { ProductSchema, ProductSchemaedit } from '../../../utils/Schema';
import { ImageUrl, ProductImageDeleteApi, ProductImageUpdateApi, addProductApi, categoryList, deleteApiCall, deleteApiCallToken, deletecolorsizeApi, getApiCallToken, getProductApi, getgstdataApi, postApiCallToken, similarCategoryList, sizecolorAdd, sizecolorUpdate, subCategoryList, updateProductApi } from '../../../API/baseUrl';
import CkEditor from '../../../Components/ckEditor';
import ToastMessage from '../../../utils/ToastMessage';
import ButtonComponent from '../../../Components/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { FileUploader } from 'react-drag-drop-files';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CachedIcon from '@mui/icons-material/Cached';
import AddIcon from '@mui/icons-material/Add';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ClearIcon from '@mui/icons-material/Clear';
import { TagsInput } from 'react-tag-input-component';
import swal from "sweetalert";

const AddProduct = () => {
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
    editid: edit,
    discount_percent: "",
    discount_amount: "",

  }



  const handleUploadChange = (file) => {
   
    const imageArr = Object.entries(file).map((img) =>
      URL.createObjectURL(img[1])
    )
    setImgUrl([...imgUrl, ...imageArr])
    // setImage(file)
    setImage([...file, ...image])
    setFieldValue("files",file)
  };
 

  const handleUploadeditChange = (file) => {
    const imageeditArr = Object.entries(file).map((img) =>
      URL.createObjectURL(img[1])
    )
    setEditimgUrl([...editimgUrl, ...imageeditArr])
    // setImage(file)
    const nestedaray = [...file, image]
    setImage(nestedaray.flat())
    setFieldValue("files",file)
  };
  // ========================size Color delete api=====================================================

  const handlecolorsizeDelete = async (id) => {
    try {
      const result = await deleteApiCallToken(`${deletecolorsizeApi}/${id}`)
      if (result?.data?.status) {
        ToastMessage("success", result.data.message);
        editProduct()
      } else {
        ToastMessage("error", result.data.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  }


  const handleImageDelete = (item, index, array) => {
    // debugger
    if(array?.length === 1){
      ToastMessage("error", "Atleast one image is required");
    }
    else{
      const main = imgUrl.filter((val) => {
        return item !== val
      });

      const mainapiValue = image.filter((val,ind) => {
        console.log("valval",ind)
        return index !== ind
      });

      
      setImgUrl([...main]);
      setImage([...mainapiValue]);
    }
  };

  console.log("hello",imgUrl)
  console.log("hello image",image)

  const handleImageeditDelete = (item, index) => {
    const main = editimgUrl.filter((val) => {
      return item !== val
    });
    setEditimgUrl([...main]);
    setImage([...main]);
  };


  const handlesecondaryImageDelete = () => {
    setSecondaryimgUrl("")
    setSecondaryimage("")
  }

  const handlesecondaryUploadChange = (file) => {
    setSecondaryimgUrl(URL.createObjectURL(file[0]))
    setSecondaryimage(file[0])
    setFieldValue("thumbnailImage",file[0])
  };




  const { values, errors, touched, handleBlur, handleSubmit, handleChange, setFieldValue } =
    useFormik({
      initialValues,
      validationSchema: edit ? ProductSchemaedit : ProductSchema,
      onSubmit: () => sendData(),
    });

  const submitFormData = (e, imageList) => {
    e.preventDefault();
    debugger
    const formData = new FormData(e.currentTarget)
    formData.delete("category_Id")
    formData.append("category_Id", values.category_Id)
    formData.delete("subCategory_Id")
    formData.append("subCategory_Id", values.subCategory_Id)
    formData.delete("similar_category")
    formData.append("similar_category", values.similar_category)
    formData.append("discount_amount", values.discount_amount)
    formData.delete("files")
    formData.delete("thumbnailImage")
    if (!id) {

      for (let index = 0; index < image.length; index++) {
        const element = image[index];
        formData.append(`files`, element);
      }
      // formData.append(`files`, image);
      formData.append(`thumbnailImage`, secondaryimage);
    }
    formData.append("description", values.description)
    formData.append("general", JSON.stringify(title));
    // formData.append("general", title);
    setApiValue(formData)
    handleSubmit();
  }

  const submitimageuploadFormData = async (e, imageList) => {
    e.preventDefault();

    const formData = new FormData()
    for (let index = 0; index < image?.length; index++) {
      const element = image[index];
      formData.append(`files`, element);
    }
    formData.append(`thumbnailImage`, secondaryimage);
    formData.append(`product_id_fk`, id);

    setLoading(true)


    try {
      const result = await postApiCallToken(ProductImageUpdateApi, formData)
      if (result?.data?.status) {
        setLoading(false)
        ToastMessage("success", result.data.Message);
      } else {
        ToastMessage("error", result.data.Message);
      }
    } catch (error) {
      console.log("error", error);
    
    } finally {
      setLoading(false)
    }
  }


  const submitsizeupload = async (colorid, index) => {

    setCurrentBtnIndex(index)
    const data = sizeArray[index]
    const formData = new FormData()
    formData.append(`colorImage`, freecolor? "FreeColor" : data.colorImage);
    formData.append(`product_id_fk`, id ? id : productid);
    formData.append(`product_size`, data.product_size? data.product_size : "FreeSize");
    formData.append(`color_code`, freecolor? "FreeColor" : data.color_code);
    formData.append(`color_name`, freecolor? "FreeColor" : data.color_name);
    
    if (id) {
      formData.append(`colorId`, colorid ? colorid : "");
    }

    setLoading(true)
    try {
      let result
      if (id) {
        result = await postApiCallToken(sizecolorUpdate, formData
        )
      } else {
        result = await postApiCallToken(sizecolorAdd, formData)
      }
      if (result?.data?.status) {
        setLoading(false)
        ToastMessage("success", result.data.message);
      } else {
        ToastMessage("error", result.data.message);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false)
    }
  }

  // ---------------------------------------get product-------------------------------------
  const editProduct = async () => {
    setEdit(false)
    try {
      const result = await getApiCallToken(`${getProductApi}${id}`)
      if (result?.data?.status) {
        ToastMessage("success", result.data.message);
        setEdit(true)
        const { productName,discount_percent,discount_amount, gst, mrp_amount, thumbnail,orderlimit, SKU, description, taxable_amount, subCategoryId, categoryId, similarId } = result?.data?.data || {}
        const { original } = result?.data?.images || {}
        setImgUrl(result?.data?.images)
        setCategoryId(categoryId)
        setSecondaryimage(thumbnail)
        setImage(original)

        { (result?.data?.Detail).length ? setTitle(result?.data?.Detail) : setTitle([{ title: "", value: "" }]) }

        { (result?.data?.Info).length ? setSizeArray(result?.data?.Info) : setSizeArray([]) }

        setSecondaryimgUrl(`${ImageUrl}${thumbnail}`)
        values.product_name = productName
        values.discount_percent = discount_percent
        values.discount_amount = discount_amount
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
          discount_percent: values.discount_percent,
          discount_amount: values.discount_amount,
          orderlimit: values.orderlimit,
          description: values.description,
          mrp_amount: values.mrp_amount,
          gst: values.gst,
          sku: values.sku,
          taxable_amount: values.taxable_amount,
          similar_category: values.similar_category,
          category_Id: values.category_Id,
          subCategory_Id: values.subCategory_Id,
          // general: JSON.stringify(title),
          general: title,
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
    // finally {
    //   setLoading(false)
    // }
  }
  // ----------------------------------------------on submit-----------------------------------------

  // ---------------------------------------------------edit image delete--------------------------------

  const handleeditImageDelete = (id, index,array) => {
    // alert(array?.length === 1)
    if(array?.length === 1){
      ToastMessage("error", "Atleast one image is required");
    }
    else{
      swal({
        title: "Are you sure you want to delete?",
        text: "Once deleted, You won't be able to revert this!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
          handleeditImageDeleteconfirm(id)
        }
    });
    }
}


  const handleeditImageDeleteconfirm = async (id) => {
    try {
      const result = await deleteApiCallToken(`${ProductImageDeleteApi}/${id}`)
      if (result?.data?.status) {
        ToastMessage("success", result.data.message);
        editProduct()
      } else {
        ToastMessage("error", result.data.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  }


  // ---------------------------------------------------edit image delete--------------------------------


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
    // values.general = ""
    navigate("/dashboard/products")
  }

  const categoryadd = () => {
    window.open("/dashboard/category-`add", "_blank", "noreferrer");
  }

  const subcategoryadd = (subCategoryName) => {
    window.open(`/dashboard/category-add/${subCategoryName}`, "_blank", "noreferrer");
  }
  // --------------------------------------------- ck editor -----------------------------------------------------

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

  const refreshcategory = () => {
    handleCategoryList()
  }


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


  const discountcalculation = (value , discount , mrp) => {
   const discountamount = value * (discount / 100)
   const afterdiscountamount = value - discountamount
   const gsttaxamount = mrp - value
   const finaldiscountvalue = afterdiscountamount + gsttaxamount
    values.discount_amount = Number(finaldiscountvalue).toFixed(2)
  }

  useEffect(() => {
    discountcalculation(values.taxable_amount, values.discount_percent, values.mrp_amount)
  }, [values.discount_percent,  values.taxable_amount , values.mrp_amount])



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

  const handleTitle = () => {
    setTitle([...title, { title: "", value: "" }])
  }

  const handleSize = () => {
    setSizeArray([...sizeArray, { product_size: "FreeSize", color_code: "", color_name: "", colorImage: "" }])
  };

  const handleTitledelete = (index) => {
    const newtitlevalue = title.filter((item, ind) => {
      return ind !== index
    });
    setTitle([...newtitlevalue]);
  };

  const handleSizedelete = (index) => {
    const newsizevalue = sizeArray.filter((item, ind) => {
      return ind !== index
    });
    setSizeArray([...newsizevalue]);
  };

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
          <Grid item xs={12} sm={12} md={12} lg={12} sx={{ alignItems: 'center', display: 'flex', fontWeight: 'bold' }}>
            <ArrowBackIcon onClick={handleGoBacked} className='arrow_back' />
            <Typography variant="h4" component="h4" sx={{ fontWeight: 'bold', mx: 1 }}>
              {edit ? 'Edit Product' : 'Add Product'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} sx={{}}>
            <InputField label="Product Name" name="product_name" value={values.product_name} type="Text"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.product_name && touched.product_name ? (
              <p className="form-error">{errors.product_name}</p>
            ) : null}
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} sx={{ display: "flex" }}>
            <Grid item xs={11} sm={11} md={11} lg={11}>
              <Autocomplete
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
            <Grid item xs={1} sm={1} md={1} lg={1} sx={{ display: "flex", flexDirection: "column" }}>
              <ControlPointIcon sx={{ marginLeft: "5px", cursor: "pointer", color: "#c20014" }} onClick={categoryadd} />
              <CachedIcon sx={{ marginLeft: "5px", cursor: "pointer", color: "#c20014" }} onClick={refreshcategory} />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} sx={{ mt: 2, display: "flex" }}>
            <Grid item xs={11} sm={11} md={11} lg={11}>
              <Autocomplete
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
            <Grid item xs={1} sm={1} md={1} lg={1} sx={{ display: "flex", flexDirection: "column" }}>
              <ControlPointIcon sx={{ marginLeft: "5px", cursor: "pointer", color: "#c20014", }} onClick={() => subcategoryadd(subCategoryName)} />
              <CachedIcon sx={{ marginLeft: "5px", cursor: "pointer", color: "#c20014" }} onClick={refreshcategory} />
            </Grid>
          </Grid>

          <Grid item xs={12} md={6} mb={1} sx={{ mt: 2 }}>
            <Autocomplete
              disablePortal
              disabled={values.isCheck === 1}
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
            {errors.similar_category && touched.similar_category ? (
              <p className="form-error">{errors.similar_category}</p>
            ) : null}
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={4} sx={{ mt: 2 }}>
            <InputField label="MRP"  name="mrp_amount" value={values.mrp_amount} type="number"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.mrp_amount && touched.mrp_amount ? (
              <p className="form-error">{errors.mrp_amount}</p>
            ) : null}
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={4} sx={{ mt: 2 }}>
            <Autocomplete
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
            {errors.gst && touched.gst ? (
              <p className="form-error">{errors.gst}</p>
            ) : null}
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={4} sx={{ mt: 2 }}>
            <InputField label="Taxable amount"  name="taxable_amount" value={values.taxable_amount} type="text"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.taxable_amount && touched.taxable_amount ? (
              <p className="form-error">{errors.taxable_amount}</p>
            ) : null}
          </Grid>

          {id ?
            <Box className='upload_image_box' component="form">
              <Grid container spacing={4} sx={{ display: 'flex', p: 5 }}>
                <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", flexDirection: "column" }} position="relative" className='imageUploadClass'>
                  <lable className="product_image_lable">Add Image</lable>
                  <div className="dropzone_container_Product">
                    <div>
                    <FileUploader
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
                                <div key={index}>
                                  <img src={`${ImageUrl}/${item.original ? item.original : item}`} alt="banner" height={100} width={100} />
                                  <div className="image-item__btn-wrapper">
                                    <button className='dropzone_del_btn' type='button' onClick={() => handleeditImageDelete(item.imagesId , index ,imgUrl)}><DeleteIcon sx={{ color: "#dc1111" }} /></button>
                                  </div>
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
                                  <div className="image-item__btn-wrapper">
                                    <button className='dropzone_del_btn' onClick={() => handleImageeditDelete(item, index)}><DeleteIcon sx={{ color: "#dc1111" }} /></button>
                                  </div>
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
                  <lable className="product_image_lable">Add Secondary Image</lable>
                  <div className="dropzone_container_Product">
                    <div>
                      <FileUploader
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
                      <div className="image-item__btn-wrapper">
                        <button className='dropzone_del_btn' onClick={handlesecondaryImageDelete}><DeleteIcon sx={{ color: "#dc1111" }} /></button>
                      </div>
                    </div>
                      : ""}
                  </div>
                </Grid>


                <Grid item xs={12} sm={12} md={12}>
                  <ButtonComponent btn_name="UPDATE" type="button" loading={loading} onClick={submitimageuploadFormData} />
                </Grid>
              </Grid>
            </Box>
            :

            <Grid container spacing={4} sx={{ display: 'flex', p: 5 }}>
              <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", flexDirection: "column" }} position="relative" className='imageUploadClass'>
                <lable className="product_image_lable">Image</lable>
                <div className="dropzone_container_Product">
                  <div>
                    <FileUploader
                      multiple={true}
                      className="main_drop"
                      handleChange={(e) => handleUploadChange(e)}
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
                    {imgUrl.length ? <div className='Dropzone_Preview_container'>
                      {imgUrl.map((item, index) => {
                        return (
                          <>
                            <div>
                              <img src={item} alt="banner" height={100} width={100} />
                              <div className="image-item__btn-wrapper">
                                <button type='button' className='dropzone_del_btn' onClick={() => handleImageDelete(item, index, imgUrl)}><DeleteIcon sx={{ color: "#dc1111" }} /></button>
                              </div>
                            </div>
                          </>
                        )

                      })}


                    </div>

                      : " "}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", flexDirection: "column" }} position="relative" className='imageUploadClass'>
                <lable className="product_image_lable">Secondary Image</lable>
                <div className="dropzone_container_Product">
                  <div>
                    <FileUploader
                      multiple={true}
                      className="main_drop"
                      handleChange={(e) => handlesecondaryUploadChange(e)}
                      onBlur={handleBlur}
                      name="thumbnailImage"
                      fullWidth
                      types={fileTypes}
                    />
                    {errors.thumbnailImage && touched.thumbnailImage ? (
                      <p className="form-error">{errors.thumbnailImage}</p>
                    ) : null}
                  </div>
                  {secondaryimgUrl ? <div>

                    <img src={secondaryimgUrl} alt="banner" height={100} width={100} />
                    <div className="image-item__btn-wrapper">
                      <button type='button'  className='dropzone_del_btn' onClick={handlesecondaryImageDelete}><DeleteIcon sx={{ color: "#dc1111" }} /></button>
                    </div>
                  </div>
                    : ""}
                </div>
              </Grid>
            </Grid>

          }

          <Grid item xs={12} sm={12} md={6} lg={6} sx={{}}>
            <InputField label="SKU"  name="sku" value={values.sku} type="Text"
              // disabled={id}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.sku && touched.sku ? (
              <p className="form-error">{errors.sku}</p>
            ) : null}
          </Grid>
          
          <Grid item xs={12} sm={12} md={6} lg={6} sx={{}}>
            <InputField label="Maximum order quantity"  name="orderlimit" value={values.orderlimit} type="number"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.orderlimit && touched.orderlimit ? (
              <p className="form-error">{errors.orderlimit}</p>
            ) : null}
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} sx={{}}>
            <InputField label="Discount ( in % )"  name="discount_percent" value={values.discount_percent} type="number"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.discount_percent && touched.discount_percent ? (
              <p className="form-error">{errors.discount_percent}</p>
            ) : null}
          </Grid>
          
          <Grid item xs={12} sm={12} md={6} lg={6} sx={{}}>
            <InputField label="Mrp after discount"  name="discount_amount" value={values.discount_amount} type="number"
              disable="true"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.discount_amount && touched.discount_amount ? (
              <p className="form-error">{errors.discount_amount}</p>
            ) : null}
          </Grid>

          <Grid item xs={12} md={12} >
            <p>Description</p>
            <CkEditor onChange={(text, type) => ckChange(text, type, "description")}
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
                      <TextField name="title" label="key" variant="outlined" fullWidth
                        onChange={(e) => handleTitleChange(e, "title", index)}
                        value={item.title}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} md={5} lg={5} sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
                      <TextField
                        name='value'
                        label="value"
                        value={item.value}
                        fullWidth
                        onChange={(e) => handleTitleChange(e, "value", index)}
                      />
                    </Grid>
                    <Grid item xs={2} sm={2} md={1} lg={1} sx={{ display: "flex" }}>
                      {
                        index == 0 ? "" :
                          <DeleteRoundedIcon sx={{ fontSize: "22px", color: "#c20014", marginTop: "5px", cursor: "pointer" }} onClick={() => handleTitledelete(index)} />
                      }

                      {index === title.length - 1 &&

                        <AddIcon sx={{ fontSize: "32px", color: "#c20014", padding: "0px", cursor: "pointer" }} onClick={handleTitle} />
                      }  </Grid>
                  </Grid>
                )
              })}


            </Grid>


          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: "flex", justifyContent: "end" }}>
            {edit ? <ButtonComponent btn_name="UPDATE PRODUCT" loading={loading} type="submit" /> :
              <ButtonComponent btn_name="SUBMIT PRODUCT" loading={loading} type="submit" />
            }
          </Grid>
        </Grid>
      </Box>


      <Box className="color_size_container">
        <Grid container spacing={4} sx={{ display: 'flex', p: 3, boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;" }}>

          <Grid item xs={12} sm={12} md={12} lg={12} sx={{ alignItems: 'center', display: 'flex', fontWeight: 'bold' }}>
            <Typography variant="h5" component="h5" sx={{ fontWeight: 'bold', mx: 1 }}>
              {edit ? 'Color And Size' : 'Color And Size'}
            </Typography>

            <button type='button'  className='addcolorsize_btn' onClick={handleSize}><AddIcon sx={{ fontSize: "22px", color: "#000", padding: "0px", cursor: "pointer" }} />Add More</button>
          </Grid>




          <Grid item xs={12} md={12} sx={{ margin: 0, padding: 0 }} >
{sizeArray.map((item, index) => {
  return (
    <Grid key={index} container spacing={4} sx={{ marginBottom: "40px", boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px;" ,paddingRight:"15px"}}>
     
     <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: "flex" , justifyContent:"right", paddingRight:"5px"}}>
     {
                        index == 0 ? "" :
                        <ClearIcon sx={{ fontSize: "26px", color: "#c20014", marginTop: "5px", cursor: "pointer" }} onClick={() => item.colorId ? handlecolorsizeDelete(item.colorId) : handleSizedelete(index)} />
                      }
       
      </Grid>
     
      <Grid item xs={12} sm={12} md={12} lg={6} sx={{ marginBottom: "5px", display:"flex", justifyContent:"space-between" }}>
      <Grid item xs={9} sm={9} md={9} lg={9}>
        <InputField label="Color Code" index={index} name="color_code" value={item.color_code} type="color"
         onChange={handleSizeChange}
          onBlur={handleBlur}
          disabled={freecolor}
        />
        </Grid>
        <button  type='button' className={`freecolorbtn ${freecolor ? "btnactive" : ""} `} onClick={()=>{setFreecolor(!freecolor)}}>Free Color</button>
        {/* {errors.color_code && touched.color_code ? (
          <p className="form-error">{errors.color_code}</p>
        ) : null} */}
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={6} sx={{ marginBottom: "5px" }}>
        <InputField label="Color Name" index={index}  name="color_name" value={item.color_name} type="Text"
          onChange={handleSizeChange}
          onBlur={handleBlur}
          disabled={freecolor}
        />
        {errors.color_name && touched.color_name ? (
          <p className="form-error">{errors.color_name}</p>
        ) : null}
      </Grid>


      <Grid className='product_size_container' item xs={12} sm={12} md={12} lg={6} sx={{ }}>
      {/* <Grid item xs={9} sm={9} md={9} lg={9}> */}
        <TagsInput
          value={item.product_size.length ? (item.product_size).split(",") : []}
          name='product_size'
          required
          disabled={freesize}
          placeHolder="enter Size..."
          onChange={(e) => handleSizeChange(e, index, "product_size")}
        />
        {/* </Grid> */}
       {/* <button className={`freecolorbtn ${freesize ? "btnactive" : ""} `} onClick={()=>{setFreesize(!freesize)}}>Free Size</button> */}
      </Grid>


      <Grid item xs={12} sm={12} md={12} lg={6} sx={{}} position="relative" className='imageUploadClass'>
        <div className="dropzone_container_colorimg">
          <FileUploader
            multiple={true}
            className="main_drop"
            disabled={freecolor}
            handleChange={(e) => handleSizeChange(e, index, "colorImage")}
            onBlur={handleBlur}
            name="colorImage"
            fullWidth
            types={fileTypes}
          />
        </div>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: "flex", justifyContent: "end", marginBottom: "10px" }}>

        <ButtonComponent btn_name={edit ? "UPDATE" : "SUBMIT"} loading={currentBtnIndex === index ? loading : false} type="button" onClick={() => submitsizeupload(item.colorId, index)} />

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

export default AddProduct;

