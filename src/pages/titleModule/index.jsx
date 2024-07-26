



import { useEffect, useState } from 'react';
import { ImageUrl, categoryList, getApiCallToken, gethometitlebyIdApi, homepagetitleApi, homepagetitleupdateApi, postApiCallToken, subCategoryList, viewTitleApi } from '../../API/baseUrl';
import './index.css'
import { useFormik } from 'formik'
import { FileUploader } from "react-drag-drop-files";
import { useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography, Grid, Autocomplete } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from "react-router-dom"
import ButtonComponent from '../../Components/Button';
import ToastMessage from '../../utils/ToastMessage';
import DeleteIcon from '@mui/icons-material/Delete';
import { HomrTitleSchema } from '../../utils/Schema';

const initialValues = {
    file1: "",
    file2: '',
    file3: '',
    file4: '',
}

const TitleModule = () => {
    const fileTypesBasic = ["JPEG", "PNG", "jpeg", "png", "jpg"];
    const navigate = useNavigate();
    const [subCategoryName, setSubCategoryName] = useState([]);
    const [categoryName, setCategoryName] = useState([]);
    const [titleViewData, setTitleViewData] = useState({})
    const [basicProfilePic1, setBasicProfilePic1] = useState('');
    const [basicProfilePic2, setBasicProfilePic2] = useState('');
    const [basicProfilePic3, setBasicProfilePic3] = useState('');
    const [basicProfilePic4, setBasicProfilePic4] = useState('');
    const [profilePic, setProfilePic] = useState('')
    const [loading, setLoading] = useState(false)
    const [apivalue, setApivalue] = useState("")


    const { values, errors, touched, handleBlur, handleSubmit, handleChange, setFieldValue } =
        useFormik({
            initialValues,
            validationSchema: "",
            onSubmit: () => sendData(),
        });


    // ----------------------------autocomplete-----------------------------------------------

    const handleCategoryList = async () => {
        const result = await getApiCallToken(categoryList);
        setCategoryName(result?.data?.data);
    };

    useEffect(() => {
        handleCategoryList();
    }, []);

    const handleAutocomplete = (data, val, type, value) => {
        if (type === "category_id") {
            handleSubCategoryList(val.id);
            values.sub_categoryId = "";
            // setSubcategoryEmpty(!subcategoryEmpty)
        }
        setFieldValue(type, val.id);
    };

    const handleSubCategoryList = async (id) => {
        const result = await getApiCallToken(`${subCategoryList}/${id}`);
        setSubCategoryName(result?.data?.list);
    };

    const checkArrId = (arr, id) => {
        const data = arr?.filter((item) => item.id == id);
        return data;
    };

    // ----------------------------autocomplete-----------------------------------------------
    // ------------------------------------------get title value--------------------------------------------
    // const getTitleValue = async () => {
    //     try {
    //         const result = await getApiCallToken(`${gethometitlebyIdApi}/${id}`)
    //         if (result?.data?.status) {
    //             const { file1, file2, file3, file4 } = result?.data?.Images || {}
    //             setBasicProfilePic1(`${ImageUrl}${file1}`)
    //             setBasicProfilePic2(`${ImageUrl}${file2}`)
    //             setBasicProfilePic3(`${ImageUrl}${file3}`)
    //             setBasicProfilePic4(`${ImageUrl}${file4}`)
    //             setFieldValue("file1", file1)
    //             setFieldValue("file2", file2)
    //             setFieldValue("file3", file3)
    //             setFieldValue("file4", file4)
    //         } else {
    //             ToastMessage("error", result.data.message);
    //         }
    //     } catch (error) {
    //         console.log("error", error);
    //     } finally {
    //     }
    // }

    // useEffect(() => {
    //     if (id) {
    //         getTitleValue()
    //     }
    // }, [])
    // ------------------------------------------get title value--------------------------------------------

    const handleUploadChange1 = (file, name) => {
        const objectUrl = URL.createObjectURL(file)
        setBasicProfilePic1(objectUrl)
        setFieldValue(name, file);
    };
    const handleUploadChange2 = (file, name) => {
        const objectUrl = URL.createObjectURL(file)
        setBasicProfilePic2(objectUrl)
        setFieldValue(name, file);
    };
    const handleUploadChange3 = (file, name) => {
        const objectUrl = URL.createObjectURL(file)
        setBasicProfilePic3(objectUrl)
        setFieldValue(name, file);
    };
    const handleUploadChange4 = (file, name) => {
        const objectUrl = URL.createObjectURL(file)
        setBasicProfilePic4(objectUrl)
        setFieldValue(name, file);
    };

    const handleeditImageDelete1 = () => {
        setFieldValue('file1', "");
        setBasicProfilePic1("")
    }

    const handleeditImageDelete2 = () => {
        setFieldValue('file2', "");
        setBasicProfilePic2("")
    }

    const handleeditImageDelete3 = () => {
        setFieldValue('file3', "");
        setBasicProfilePic3("")
    }

    const handleeditImageDelete4 = () => {
        setFieldValue('file4', "");
        setBasicProfilePic4("")
    }

    const submitFormData = async (e) => {
        e.preventDefault();
        const formData2 = new FormData();
        formData2.append('file1', values.file1);
        formData2.append('file2', values.file2);
        formData2.append('file3', values.file3);
        formData2.append('file4', values.file4);
        setApivalue(formData2)
        handleSubmit()
        console.log("errors", errors)
    }


    const sendData = async () => {
        setLoading(true)
        let result
        try {
                result = await postApiCallToken(homepagetitleApi, apivalue)
            if (result.data.status) {
                ToastMessage("success", result.data.message);
                setLoading(false)
                navigate('/dashboard/titleTable')
            }
            else {
                ToastMessage("error", result.data.message);

            }
        } catch (error) {
            console.log("error", error);
        }
        finally {
            setLoading(true)
        }
    }


    const handleGoBacked = () => {
        navigate('/dashboard/titleTable')
    }

    return (
        <>
            <Box component="form" sx={{ padding: "10px" }} onSubmit={submitFormData}>
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ alignItems: 'center', display: 'flex', fontWeight: 'bold' }}>
                    <ArrowBackIcon onClick={handleGoBacked} className='arrow_back' />
                    <Typography variant="h4" component="h4" sx={{ fontWeight: 'bold', mx: 1 }}>
                         Add Title</Typography>
                </Grid>


                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ alignItems: 'center', display: 'flex', fontWeight: 'bold' }}>
                    <Typography variant="h6" component="h6" sx={{ fontWeight: 'bold', mx: 3, mt: 3 }}>Upper Title</Typography>
                </Grid>

                <div className='titleMainCompClass'>

                    <Grid container spacing={1} className='titlefeild_container' sx={{ display: "flex" }}>
                        <Grid item xs={12} md={12} lg={4}>
                            <lable>Image 1 (Upload file of size 535*257)</lable>
                            <div className="titlefileuploader">
                                <FileUploader
                                    sx={{ width: '100%' }}
                                    placeholder="Upload your image"
                                    className=""
                                    handleChange={(e) => handleUploadChange1(e, "file1")}
                                    onBlur={handleBlur}
                                    name="file1"
                                    multiple={false}
                                    types={fileTypesBasic}
                                // onTypeError={(err) => handleErrorFile(err)}
                                />
                                {errors.file1 && touched.file1 ? (
                                    <p className="form-error">{errors.file1}</p>
                                ) : null}
                            </div>
                            {
                                basicProfilePic1 || titleViewData?.files
                                    ?
                                    <Typography className="titleImageClass" >
                                        {
                                            (basicProfilePic1 && basicProfilePic1 !== `https://treasurebox.technotoil.com/`) ?

                                                <img src={`${basicProfilePic1}`} alt='Profile' />
                                                :
                                                <img src={`${ImageUrl}/${titleViewData?.files}`} alt='' />

                                        }
                                        <div className="image-item__btn-wrapper">
                                            <button className='dropzone_del_btn' type='button' onClick={handleeditImageDelete1}><DeleteIcon sx={{ color: "#dc1111" }} /></button>
                                        </div>
                                    </Typography>
                                    :
                                    ''
                            }

                        </Grid>


                        <Grid item xs={12} md={6} lg={4} sx={{marginTop:"15px"}}>
                            <Autocomplete
                                disablePortal
                                disableClearable
                                key={
                                    checkArrId(categoryName, values?.category_id)[0]
                                        ?.category_name
                                }
                                options={categoryName}
                                getOptionLabel={(option) => option.category_name}
                                isOptionEqualToValue={(option, value) => value.id === option.id}
                                defaultValue={checkArrId(categoryName, values.category_id)[0]}
                                onChange={(data, val) =>
                                    handleAutocomplete(data, val, "category_id")
                                }
                                renderInput={(params) => (
                                    <TextField
                                    size='small'
                                        onBlur={handleBlur}
                                        name="category_id"
                                        label="Category"
                                        {...params}
                                    />
                                )}
                            />
                        </Grid>


                        <Grid item xs={12} md={6} lg={4} sx={{marginTop:"15px"}}>
                            <Autocomplete
                                disablePortal
                                disableClearable
                                key={subCategoryName}
                                options={subCategoryName}
                                getOptionLabel={(option) => option.subCategory_name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                defaultValue={
                                    checkArrId(subCategoryName, values?.sub_categoryId)[0]
                                }
                                onChange={(data, val) =>
                                    handleAutocomplete(data, val, "sub_categoryId")
                                }
                                renderInput={(params) => (
                                    <TextField
                                        onBlur={handleBlur}
                                        name="sub_categoryId"
                                        label="Sub Category"
                                        {...params}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: "flex", justifyContent: "end", p: 5 }}>
                    
                         <ButtonComponent btn_name="Submit" type="Submit" loading={loading} />


                </Grid>




                        <Grid item xs={12} md={12} lg={4}>
                            <lable>Image 2 (Upload file of size 375*373)</lable>
                            <div className="titlefileuploader">
                                <FileUploader
                                    sx={{ width: '100%' }}
                                    className=""
                                    handleChange={(e) => handleUploadChange2(e, "file2")}
                                    onBlur={handleBlur}
                                    name="file2"
                                    types={fileTypesBasic}
                                // onTypeError={(err) => handleErrorFile(err)}
                                />
                                {errors.file2 && touched.file2 ? (
                                    <p className="form-error">{errors.file2}</p>
                                ) : null}
                            </div>
                            {
                                basicProfilePic2 || titleViewData?.files
                                    ?
                                    <Typography className="titleImageClass" >
                                        {
                                            (basicProfilePic2 && basicProfilePic2 !== `https://treasurebox.technotoil.com/`) ?

                                                <img src={`${basicProfilePic2}`} alt='Profile' />
                                                :
                                                <img src={`${ImageUrl}/${titleViewData?.files}`} alt='' />

                                        }
                                        <div className="image-item__btn-wrapper">
                                            <button className='dropzone_del_btn' type='button' onClick={handleeditImageDelete2}><DeleteIcon sx={{ color: "#dc1111" }} /></button>
                                        </div>
                                    </Typography>
                                    :
                                    ''
                            }

                        </Grid>
                     

                     
                        <Grid item xs={12} md={6} lg={4} sx={{marginTop:"15px"}}>
                            <Autocomplete
                                disablePortal
                                disableClearable
                                key={
                                    checkArrId(categoryName, values?.category_id)[0]
                                        ?.category_name
                                }
                                options={categoryName}
                                getOptionLabel={(option) => option.category_name}
                                isOptionEqualToValue={(option, value) => value.id === option.id}
                                defaultValue={checkArrId(categoryName, values.category_id)[0]}
                                onChange={(data, val) =>
                                    handleAutocomplete(data, val, "category_id")
                                }
                                renderInput={(params) => (
                                    <TextField
                                    size='small'
                                        onBlur={handleBlur}
                                        name="category_id"
                                        label="Category"
                                        {...params}
                                    />
                                )}
                            />
                        </Grid>


                        <Grid item xs={12} md={6} lg={4} sx={{marginTop:"15px"}}>
                            <Autocomplete
                                disablePortal
                                disableClearable
                                key={subCategoryName}
                                options={subCategoryName}
                                getOptionLabel={(option) => option.subCategory_name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                defaultValue={
                                    checkArrId(subCategoryName, values?.sub_categoryId)[0]
                                }
                                onChange={(data, val) =>
                                    handleAutocomplete(data, val, "sub_categoryId")
                                }
                                renderInput={(params) => (
                                    <TextField
                                        onBlur={handleBlur}
                                        name="sub_categoryId"
                                        label="Sub Category"
                                        {...params}
                                    />
                                )}
                            />
                        </Grid>

                    </Grid>
                </div>


                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: "flex", justifyContent: "end", p: 5 }}>
                   
                         <ButtonComponent btn_name="Submit" type="Submit" loading={loading} />
                 </Grid>



                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ alignItems: 'center', display: 'flex', fontWeight: 'bold' }}>
                    <Typography variant="h6" component="h6" sx={{ fontWeight: 'bold', mx: 3, mt: 3 }}>Lower Title</Typography>
                </Grid>

                <div className='titleMainCompClass'>

                    <Grid container spacing={1} className='titlefeild_container' sx={{ display: "flex" }}>
                        <Grid item xs={12} md={12} lg={4}>
                            <lable>Image 3 (Upload file of size 375*373)</lable>
                            <div className="titlefileuploader">
                                <FileUploader
                                    sx={{ width: '100%' }}
                                    className=""
                                    handleChange={(e) => handleUploadChange3(e, "file3")}
                                    onBlur={handleBlur}
                                    name="file3"
                                    types={fileTypesBasic}
                                // onTypeError={(err) => handleErrorFile(err)}
                                />
                                {errors.file3 && touched.file3 ? (
                                    <p className="form-error">{errors.file3}</p>
                                ) : null}
                            </div>
                            {
                                basicProfilePic3 || titleViewData?.files
                                    ?
                                    <Typography className="titleImageClass" >
                                        {
                                            (basicProfilePic3 && basicProfilePic3 !== `https://treasurebox.technotoil.com/`) ?

                                                <img src={`${basicProfilePic3}`} alt='Profile' />
                                                :
                                                <img src={`${ImageUrl}/${titleViewData?.files}`} alt='' />

                                        }
                                        <div className="image-item__btn-wrapper">
                                            <button className='dropzone_del_btn' type='button' onClick={handleeditImageDelete3}><DeleteIcon sx={{ color: "#dc1111" }} /></button>
                                        </div>
                                    </Typography>
                                    :
                                    ''
                            }

                        </Grid>

                        
                        <Grid item xs={12} md={6} lg={4} sx={{marginTop:"15px"}}>
                            <Autocomplete
                                disablePortal
                                disableClearable
                                key={
                                    checkArrId(categoryName, values?.category_id)[0]
                                        ?.category_name
                                }
                                options={categoryName}
                                getOptionLabel={(option) => option.category_name}
                                isOptionEqualToValue={(option, value) => value.id === option.id}
                                defaultValue={checkArrId(categoryName, values.category_id)[0]}
                                onChange={(data, val) =>
                                    handleAutocomplete(data, val, "category_id")
                                }
                                renderInput={(params) => (
                                    <TextField
                                    size='small'
                                        onBlur={handleBlur}
                                        name="category_id"
                                        label="Category"
                                        {...params}
                                    />
                                )}
                            />
                        </Grid>


                        <Grid item xs={12} md={6} lg={4} sx={{marginTop:"15px"}}>
                            <Autocomplete
                                disablePortal
                                disableClearable
                                key={subCategoryName}
                                options={subCategoryName}
                                getOptionLabel={(option) => option.subCategory_name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                defaultValue={
                                    checkArrId(subCategoryName, values?.sub_categoryId)[0]
                                }
                                onChange={(data, val) =>
                                    handleAutocomplete(data, val, "sub_categoryId")
                                }
                                renderInput={(params) => (
                                    <TextField
                                        onBlur={handleBlur}
                                        name="sub_categoryId"
                                        label="Sub Category"
                                        {...params}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: "flex", justifyContent: "end", p: 5 }}>
                  <ButtonComponent btn_name="Submit" type="Submit" loading={loading} />


                </Grid>



                        <Grid item xs={12} md={12} lg={4}>
                            <lable>Image 4 (Upload file of size 535*257)</lable>
                            <div className="titlefileuploader">
                                <div>
                                    <FileUploader
                                        sx={{ width: '100%' }}
                                        className=""
                                        handleChange={(e) => handleUploadChange4(e, "file4")}
                                        onBlur={handleBlur}
                                        name="file4"
                                        types={fileTypesBasic}
                                    // onTypeError={(err) => handleErrorFile(err)}
                                    />
                                    {errors.file4 && touched.file4 ? (
                                        <p className="form-error">{errors.file4}</p>
                                    ) : null}
                                </div>
                            </div>
                            <div>
                                {
                                    basicProfilePic4 || titleViewData?.files
                                        ?
                                        <Typography className="titleImageClass" >
                                            {
                                                (basicProfilePic4 && basicProfilePic4 !== `https://treasurebox.technotoil.com/`) ?

                                                    <img src={`${basicProfilePic4}`} alt='Profile' />
                                                    :
                                                    <img src={`${ImageUrl}/${titleViewData?.files}`} alt='' />

                                            }
                                            <div className="image-item__btn-wrapper">
                                                <button className='dropzone_del_btn' type='button' onClick={handleeditImageDelete4}><DeleteIcon sx={{ color: "#dc1111" }} /></button>
                                            </div>
                                        </Typography>
                                        :
                                        ''
                                }
                            </div>
                        </Grid>

                        
                        <Grid item xs={12} md={6} lg={4} sx={{marginTop:"15px"}}>
                            <Autocomplete
                                disablePortal
                                disableClearable
                                key={
                                    checkArrId(categoryName, values?.category_id)[0]
                                        ?.category_name
                                }
                                options={categoryName}
                                getOptionLabel={(option) => option.category_name}
                                isOptionEqualToValue={(option, value) => value.id === option.id}
                                defaultValue={checkArrId(categoryName, values.category_id)[0]}
                                onChange={(data, val) =>
                                    handleAutocomplete(data, val, "category_id")
                                }
                                renderInput={(params) => (
                                    <TextField
                                    size='small'
                                        onBlur={handleBlur}
                                        name="category_id"
                                        label="Category"
                                        {...params}
                                    />
                                )}
                            />
                        </Grid>


                        <Grid item xs={12} md={6} lg={4} sx={{marginTop:"15px"}}>
                            <Autocomplete
                                disablePortal
                                disableClearable
                                key={subCategoryName}
                                options={subCategoryName}
                                getOptionLabel={(option) => option.subCategory_name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                defaultValue={
                                    checkArrId(subCategoryName, values?.sub_categoryId)[0]
                                }
                                onChange={(data, val) =>
                                    handleAutocomplete(data, val, "sub_categoryId")
                                }
                                renderInput={(params) => (
                                    <TextField
                                        onBlur={handleBlur}
                                        name="sub_categoryId"
                                        label="Sub Category"
                                        {...params}
                                    />
                                )}
                            />
                        </Grid>






                    </Grid>

                </div>

                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: "flex", justifyContent: "end", p: 5 }}>
                  <ButtonComponent btn_name="Submit" type="Submit" loading={loading} />

                </Grid>

            </Box>
        </>
    )
}
export default TitleModule