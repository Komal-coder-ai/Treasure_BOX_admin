import React, { useEffect, useState } from "react";
import ButtonComponent from "../../Components/Button";
import { Autocomplete, Box, Grid, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useFormik } from "formik";
import { BannerSchema } from "../../utils/Schema";
import ToastMessage from "../../utils/ToastMessage";
import {
  addBannerApi,
  categoryList,
  getApiCallToken,
  postApiCall,
  postApiCallToken,
  subCategoryList,
} from "../../API/baseUrl";
import "./index.css";
import { FileUploader } from "react-drag-drop-files";
import DeleteIcon from "@mui/icons-material/Delete";

const AddBanner = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subCategoryName, setSubCategoryName] = useState([]);
  const [categoryName, setCategoryName] = useState([]);
  const [data, setData] = useState();
  const [imgUrl, setImgUrl] = useState("");
  const [image, setImage] = useState();

  const handleChange = (file) => {
    setImgUrl(URL.createObjectURL(file[0]));
    setImage(file[0]);
    setFieldValue("files", file[0]);
  };

  const handleGoBacked = () => {
    navigate("/dashboard/banner");
  };

  const handleImageDelete = () => {
    setImgUrl("");
    setImage("");
    setFieldValue("");
  };
  const initialValues = {
    files: "",
    category_id:"",
    sub_categoryId:"",
  };

  const { errors, touched, handleBlur, handleSubmit, setFieldValue, values } =
    useFormik({
      initialValues,
      validationSchema: BannerSchema,
      onSubmit: () => sendData(),
    });
  console.log("values", values);

  const formSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", image);
    formData.delete("category_id")
    formData.append("category_id", values.category_id)
    formData.delete("sub_categoryId")
    formData.append("sub_categoryId", values.sub_categoryId)
    setData(formData);
    handleSubmit();
  };

  const sendData = async () => {
    try {
      setLoading(true);
      const result = await postApiCallToken(addBannerApi, data);
      if (result.data.status) {
        setLoading(false);
        navigate("/dashboard/banner");
        ToastMessage("success", result.data.message);
      } else {
        ToastMessage("error", result.data.message);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryList = async () => {
    const result = await getApiCallToken(categoryList);
    setCategoryName(result?.data?.data);
  };

  useEffect(() => {
    handleCategoryList();
  }, []);

  const handleAutocomplete = (data, val, type, value) => {
    if (type === "category_id") {
      values.sub_categoryId = "";
      setSubCategoryName([])
      handleSubCategoryList(val.id);
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

  const fileTypes = ["JPG", "PNG", "GIF"];

  return (
    <Box
      component="form"
      method="multipart/form-data"
      encType="multipart/form-data"
      onSubmit={formSubmit}
    >
      <Grid
        container
        spacing={4}
        sx={{ display: "flex", p: 3, flexDirection: "column" }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          sx={{ alignItems: "center", display: "flex", fontWeight: "bold" }}
        >
          <ArrowBackIcon onClick={handleGoBacked} className="arrow_back" />
          <Typography
            variant="h4"
            component="h4"
            sx={{ fontWeight: "bold", mx: 1 }}
          >
            Add Banner
          </Typography>
        </Grid>
        <div className="dropzone_container_Banner">
          <div>
            <FileUploader
              multiple={true}
              className="main_drop"
              handleChange={(e) => handleChange(e)}
              onBlur={handleBlur}
              name="files"
              types={fileTypes}
              // type="file"
              // inputProps={{ accept: "image/png, image/jpeg ,image/svg"}}
            />
            {errors.files && touched.files ? (
              <p className="form-error">{errors.files}</p>
            ) : null}
          </div>
          {imgUrl ? (
            <div>
              <img src={imgUrl} alt="banner" height={100} width={100} />
              <div className="image-item__btn-wrapper">
                {/* <button className='dropzone_del_btn' onClick={handleImageDelete}><DeleteIcon sx={{ color: "#dc1111" }} /></button> */}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>

        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Grid item xs={12} sm={12} md={6} lg={6} sx={{ display: "flex" }}>
            <Grid item xs={11} sm={11} md={11} lg={11}>
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
                    onBlur={handleBlur}
                    name="category_id"
                    label="Category"
                    {...params}
                  />
                )}
              />
              {errors.category_id && touched.category_id ? (
                <p className="form-error">{errors.category_id}</p>
              ) : null}
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} sx={{ display: "flex" }}>
            <Grid item xs={11} sm={11} md={11} lg={11}>
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
              {errors.sub_categoryId && touched.sub_categoryId ? (
                <p className="form-error">{errors.sub_categoryId}</p>
              ) : null}
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          sx={{ display: "flex", justifyContent: "end" }}
        >
          <ButtonComponent btn_name="Submit" loading={loading} type="submit" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddBanner;
