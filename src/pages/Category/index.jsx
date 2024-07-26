import { Autocomplete, Checkbox, Container, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@mui/material'
import './index.css'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { categorySchema } from '../../utils/Schema'
import InputField from '../../Components/Input'
import { ImageUrl, addCategory, categoryList, categoryUpdate, getApiCall, getApiCallToken, getCategory, postApiCallToken } from '../../API/baseUrl'
import ToastMessage from '../../utils/ToastMessage'
import ButtonComponent from '../../Components/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from "react-router-dom"
import { FileUploader } from 'react-drag-drop-files'
import DeleteIcon from '@mui/icons-material/Delete';

const Category = () => {
    const { subCategoryName } = useParams();
    const [checked, setChecked] = useState(0)
    const [categoryName, setCategoryName] = useState([])
    const [searchText, setSearchtext] = useState("");
    const [loading, setLoading] = useState(false)
    const { id } = useParams();
    const [edit, setEdit] = useState(false)
    const [data, setData] = useState();
    const [imgUrl , setImgUrl] = useState("")
  const [image, setImage] = useState();
 
    const navigate = useNavigate();

    const categoryApi = async () => {
        const response = await getApiCallToken(categoryList)
        setCategoryName(response.data.data);
    }

    useEffect(() => {
        categoryApi()
    }, [])


    const callBack = (data) => {
        setSearchtext(data);
    };
    const handleCheck = (e) => {
        if (checked === 0) {
            setChecked(1)
            values.isCheck = 1
        }
        else {
            setChecked(0)
            values.isCheck = 0
        }
        

    }

    
  const handleImageDelete = () => {
    setImgUrl("")
    setImage("")
    setFieldValue("");
  }

  const fileTypes = ["JPG", "PNG", "GIF"];

  const  handlefileChange = (file ) => {
    setImgUrl(URL.createObjectURL(file[0]))
    setImage(file[0])
    setFieldValue("files" , file[0]);
  };

  

    const initialValues = {
        parentId: "",
        isCheck: subCategoryName? 0 : 1,
        category_name: "",
        files:"",
    }

    const { values, errors, touched, handleBlur, handleSubmit, handleChange, setFieldValue, resetForm } =
        useFormik({
            initialValues,
            validationSchema: categorySchema,
            onSubmit: () => handleAddCategory(),

        });

    const submitCategory = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("files", image)
        formData.append("parentId", values.parentId)
        formData.append("isCheck", values.isCheck)
        formData.append("category_name", values.category_name)
        setData(formData)
        // setFieldValue("files", formData)
        handleSubmit()
    }
    const handleAddCategory = async () => {
        try {
            setLoading(true)
            let result
            if (id) {
                result = await postApiCallToken(`${categoryUpdate}/${id}`, data
                )
            } else {
                result = await postApiCallToken(addCategory,data
                )
            }
            if (result.data.status) {
                setLoading(false)
                navigate("/dashboard/category")
                ToastMessage("success", result.data.message);
                // handleCategoryList()
                resetForm()
            } else {
                ToastMessage("error", result.data.message);

            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const checkArrName = (arr, id) => {
        const data = arr?.filter((item) => id == item.id);
        
        return data; 
    };

    const handleAutocomplete = (data, val, type) => {
        if (type === "purpose") {
            if (val.purpose === "Other") {
                setFieldValue("purpose_name", val.purpose);
            } else {
                setFieldValue("purpose_name", "");
            }
            setFieldValue("purpose", val.id);
        } else {
            setFieldValue(type, val.id)
        }
    }
    const handleGoBacked = () => {
        navigate("/dashboard/category")
    }

    
    // --------------------------------------------edit Category----------------------------------------
    const editCategory = async () => {
        try {
            const result = await getApiCallToken(`${getCategory}/${id}`)
            if (result?.data?.status) {
                setEdit(true)
                const { isCheck, Category_name, parentId , file} = result?.data?.list[0]
                values.parentId = parentId
                values.isCheck = isCheck
                values.category_name = Category_name
                setImgUrl(`${ImageUrl}/${file}`)
                setImage(file)
                setFieldValue("files" , file);
            } else {
                ToastMessage("error", result.data.message);
            }
        } catch (error) {
            setEdit(false)
        }
    }

    useEffect(() => {
        if (id) {
            editCategory()
        }
    }, [])

    //   ----------------------------------------------------edit category------------------------------
    return (
        <>
            <Container component={"form"} maxWidth="false" className="containerdivuser" onSubmit={submitCategory}>
                <Grid container spacing={4} sx={{ display: 'flex', py: 3 }}>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{ alignItems: 'center', display: 'flex', fontWeight: 'bold' }}>
                        <ArrowBackIcon onClick={handleGoBacked} className='arrow_back' />
                        <Typography variant="h4" component="h4" sx={{ fontWeight: 'bold', mx: 1 }}>
                            {edit ? 'Edit Category' : 'Add Category'}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid spacing={2} mt={2} mb={3}>
                    {values.isCheck ? "" :
                    <Grid item xs={12} md={6} mb={1}>
                        <Autocomplete
                            disablePortal
                            disabled={values.isCheck === 1}
                            disableClearable
                            key={checkArrName(categoryName, values?.parentId)[0]?.category_name}
                            options={categoryName}
                            getOptionLabel={(option) => values.isCheck === 1 ? "" : option.category_name}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            defaultValue={checkArrName(categoryName, values?.parentId)[0]}
                            onChange={(data, val) => handleAutocomplete(data, val, "parentId")}
                            renderInput={(params) => (
                                <TextField
                                    onBlur={handleBlur}
                                    name="parentId"
                                    label="Category List"
                                    {...params}
                                />
                            )}
                        />
                        {errors.parentId && touched.parentId ? (
                            <p className="form-error">{errors.parentId}</p>
                        ) : null}
                    </Grid>
    }


                    <Grid item xs={12} md={6} mb={3} width={210} mt={5}>

                        <FormGroup className='formControl'>
                            <FormControlLabel control={<Checkbox />} label={values.isCheck ? "Unselect to add SubCategory" : "Select to add category"}
                                onChange={handleCheck}
                                name="isCheck"
                                checked={values.isCheck}
                            />
                        </FormGroup>
                    </Grid>

                    <Grid item xs={12} md={6} mb={3}>
                    {values.isCheck ? 
                        <InputField 
                        label="Add Category" 
                        placeholder="Add Category"
                        name="category_name" 
                        value={values.category_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        /> :
                        <InputField 
                        label="Add Sub Category" 
                        placeholder="Add Sub Category"
                        name="category_name" 
                        value={values.category_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        /> 
                    } 
                        {errors.category_name && touched.category_name ? (
                            <p className="form-error">{errors.category_name}</p>
                        ) : null}
                    </Grid>

        <div className="dropzone_container_category">
          <div>
          <FileUploader
            multiple={true}
            className=""
            handleChange={(e)=>handlefileChange(e)}
            onBlur={handleBlur}
            name="files"
            types={fileTypes}
          />
          {errors.files && touched.files ? (
            <p className="form-error">{errors.files}</p>
          ) : null}
          </div>
        {imgUrl ? <div>
          
          <img src={imgUrl} alt="banner" height={100} width={100}/>
        <div className="image-item__btn-wrapper">
        {/* <button className='dropzone_del_btn' onClick={handleImageDelete}><DeleteIcon sx={{ color: "#dc1111" }} /></button> */}
      </div>
        </div> 
        : ""}

        </div>


                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: "flex", justifyContent: "end", marginTop:5}}>
                        {edit ? <ButtonComponent btn_name="UPDATE" loading={loading} type="submit" /> :
                            <ButtonComponent btn_name="SUBMIT" loading={loading} type="submit" />
                        }

                    </Grid>
                </Grid>
            </Container>
        </>
    )
}
export default Category;