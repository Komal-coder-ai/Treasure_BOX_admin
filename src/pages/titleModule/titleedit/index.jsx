



import { useEffect, useState } from 'react';
import './index.css'
import { useFormik } from 'formik'
import { FileUploader } from "react-drag-drop-files";
import { Box, TextField, Typography, Grid, Autocomplete } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from "react-router-dom"
import DeleteIcon from '@mui/icons-material/Delete';
import { ImageUrl, categoryList, getApiCallToken, gethometitlebyIdApi, homepagetitleupdateApi, postApiCallToken, subCategoryList } from '../../../API/baseUrl';
import ToastMessage from '../../../utils/ToastMessage';
import ButtonComponent from '../../../Components/Button';
import { HomeTitleeditSchema } from '../../../utils/Schema';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const initialValues = {
    files: "",
    category_id: "",
    sub_categoryId: "",
}

const TitleEdit = () => {

    const { id } = useParams();
    const fileTypesBasic = ["JPEG", "PNG", "jpeg", "png", "jpg"];
    const navigate = useNavigate();
    const [subCategoryName, setSubCategoryName] = useState([]);
    const [categoryName, setCategoryName] = useState([]);
    const [titleViewData, setTitleViewData] = useState({})
    const [basicProfilePic1, setBasicProfilePic1] = useState('');
    const [imageval, setImageval] = useState('');
    const [loading, setLoading] = useState(false)
    const [apivalue, setApivalue] = useState("")
    const [errormsg, setErrormsg] = useState("")


    const { values, errors, touched, handleBlur, handleSubmit, handleChange, setFieldValue } =
        useFormik({
            initialValues,
            validationSchema: HomeTitleeditSchema,
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
        values.sub_categoryId = val.id
        setFieldValue("sub_categoryId", val.id);
    };

    const handleCategoryAutocomplete = (data, val, type, value) => {
        values.category_id = val.id
        setFieldValue("category_id", val.id);
        setFieldValue("sub_categoryId", "");
        values.sub_categoryId = "";
        handleSubCategoryList(val.id);
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
    const getTitleValue = async () => {
        try {
            const result = await getApiCallToken(`${gethometitlebyIdApi}/${id}`)
            if (result?.data?.status) {
                const { files, category_id, sub_categoryId } = result?.data?.Images || {}
                setBasicProfilePic1(`${ImageUrl}${files}`)
                setImageval(files)
                setFieldValue("category_id", category_id)
                setFieldValue("files", files)
                setFieldValue("sub_categoryId", sub_categoryId)
                values.sub_categoryId = sub_categoryId
                handleSubCategoryList(category_id)
            } else {
                ToastMessage("error", result.data.message);
            }
        } catch (error) {
            console.log("error", error);
        } finally {
        }
    }

    useEffect(() => {
        if (id) {
            getTitleValue()
        }
    }, [])
    // ------------------------------------------get title value--------------------------------------------

    const handleUploadChange1 = (file, name) => {
        const objectUrl = URL.createObjectURL(file)
        // const dimensions = useImageSize(file)
        setBasicProfilePic1(objectUrl)
        setImageval(file)
    };

    const imgChange = (e, type) => {
        const objectUrl = URL.createObjectURL(e.target.files[0])
        let file, img;
        let _URL = window.URL || window.webkitURL
        if ((file = e.target.files[0])) {
            img = new Image();
            img.onload = function () {
                if (this.width) {
                    setFieldValue("files", e.target.files[0])
                    setBasicProfilePic1(objectUrl)
                    setImageval(e.target.files[0])
                    setErrormsg("")
                }
                else {
                    setErrormsg("Invalid dimensions , File dimensions must be 720 × 377")
                    setFieldValue("files", "")
                    setBasicProfilePic1("")
                    setImageval("")
                }

            };

            img.onerror = function () {
                alert("not a valid file: " + file.type);
            };
            img.src = _URL.createObjectURL(file)
        }
    }
    const imgChange2 = (e, type) => {
        const objectUrl = URL.createObjectURL(e.target.files[0])
        let file, img;
        let _URL = window.URL || window.webkitURL
        if ((file = e.target.files[0])) {
            img = new Image();
            img.onload = function () {
                if (this.width * this.height === 371 * 360) {
                    setFieldValue("files", e.target.files[0])
                    setBasicProfilePic1(objectUrl)
                    setImageval(e.target.files[0])
                    setErrormsg("")
                }
                else {
                    setErrormsg("Invalid dimensions , File dimensions must be 371*360")
                    setFieldValue("files", "")
                    setBasicProfilePic1("")
                    setImageval("")
                }

            };

            img.onerror = function () {
                alert("not a valid file: " + file.type);
            };
            img.src = _URL.createObjectURL(file)
        }
    }



    const handleeditImageDelete1 = () => {
        setBasicProfilePic1("")
        setImageval("")
    }

    const submitFormData = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('files', imageval);
        formData.delete("category_id")
        formData.append("category_id", values.category_id)
        formData.delete("sub_categoryId")
        formData.append("sub_categoryId", values.sub_categoryId)
        setApivalue(formData)
        handleSubmit()
        console.log("errors", errors)
    }


    const sendData = async () => {
        setLoading(true)
        try {
            const result = await postApiCallToken(`${homepagetitleupdateApi}/${id}`, apivalue)
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
            setLoading(false)
        }
    }


    const handleGoBacked = () => {
        navigate('/dashboard/titleTable')
    }

    return (
        <>
            <Box component="form"
                encType='multipart/form-data'
                sx={{ padding: "10px" }} onSubmit={submitFormData}>
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ alignItems: 'center', display: 'flex', fontWeight: 'bold' }}>
                    <ArrowBackIcon onClick={handleGoBacked} className='arrow_back' />
                    <Typography variant="h4" component="h4" sx={{ fontWeight: 'bold', mx: 1 }}>
                        Edit Title</Typography>
                </Grid>

                <Grid container spacing={1} className='titlefeild_container' sx={{ display: "flex" }}>
                    <Grid item xs={12} md={12} lg={12}>
                        {/* {id == 1 || id == 3 ? */}
                            <lable>Title Image (Upload file of size 720 × 377)</lable>
                        {/* //      :
                        //     <lable>Title Image (Upload file of size 371*360)</lable>
                        // } */}

                        <div className="titlefileuploader">
                            
                            <TextField
                                className='file_input'
                                // onChange={(e) => { id == 1 || id == 3 ? imgChange(e, "files") : imgChange2(e, "files") }}
                                onChange={(e) => imgChange(e, "files")}
                                onBlur={handleBlur}
                                type="file"
                                name="files"
                                id="files"
                                placeholder="You can change your file"
                                inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
                                sx={{ width: "100%" ,display:"none"}}
                            />
                            {/* <input type="file" id="files" class="hidden"/> */}
                            <label className='file_input_lable_title' for="files"> <AttachFileIcon/> {basicProfilePic1 ? "Change Image" : "Select Image"}</label>

                            {errormsg ? <Typography className="form-error" >
                                {errormsg}
                            </Typography> : ""}


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


                    <Grid item xs={12} md={6} lg={6} sx={{ marginTop: "15px" }}>
                        <Autocomplete
                            disablePortal
                            disableClearable
                            key={checkArrId(categoryName, values?.category_id)[0]?.category_name}
                            options={categoryName}
                            getOptionLabel={(option) => option.category_name}
                            isOptionEqualToValue={(option, value) => value.id === option.id}
                            defaultValue={checkArrId(categoryName, values.category_id)[0]}
                            onChange={(data, val) => handleCategoryAutocomplete(data, val, "category_id",)}
                            renderInput={(params) => (
                                <TextField
                                    onBlur={handleBlur}
                                    name="category_id"
                                    label="Category"
                                    {...params}

                                />
                            )}
                        />
                    </Grid>


                    <Grid item xs={12} md={6} lg={6} sx={{ marginTop: "15px" }}>
                        <Autocomplete
                            disablePortal
                            disableClearable
                            // key={subCategoryName}
                            key={checkArrId(subCategoryName, values?.sub_categoryId)[0]?.subCategory_name}
                            options={subCategoryName}
                            getOptionLabel={(option) => option.subCategory_name}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            defaultValue={checkArrId(subCategoryName, values?.sub_categoryId)[0]}
                            onChange={(data, val) => handleAutocomplete(data, val, "sub_categoryId")}
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
                        <ButtonComponent btn_name="Update" type="Submit" loading={loading} />


                    </Grid>
                </Grid>

            </Box>
        </>
    )
}

export default TitleEdit