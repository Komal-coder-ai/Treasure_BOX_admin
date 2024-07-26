
import axios from 'axios';

export const baseUrl = axios.create({
    // baseURL: 'https://gallant-cohen.50-17-89-82.plesk.page/',
    baseURL: 'https://treasure.technotoil.com/',
    // baseURL: 'https://8772-2401-4900-1c08-43dc-5954-8dee-dce8-34a4.ngrok-free.app/',
    // baseURL: 'https://8772-2401-4900-1c08-43dc-5954-8dee-dce8-34a4.ngrok-free.app/',
});

export const ImageUrl = 'https://treasure.technotoil.com/'




export const postApiCallToken = async (url, data) => {
    const refreshToken = localStorage.getItem("refreshToken")
    
    const accessToken = localStorage.getItem('accessToken')
    
    const customHeaders = {
      token: accessToken,
      refreshtoken:refreshToken
    //   refresh_Token:refreshToken
    };
    let response
    try {
      response = await baseUrl.post(url, data, {
        headers: customHeaders,
      })
      
    } catch (error) {
      if (error.response.data.message === "Invalid authorization token") {
        localStorage.clear()
      }
      if (error.response.data.message === "Authorization token has expired") {
        localStorage.clear()
      }
      // if (error.response.data.message === "Authorization token has expired") {
      //   // const result = await baseUrl.post("admin/generate-new-access-token-from-refresh-token", {
      //   const result = await baseUrl.post("admin-accessToken-fromRefresh-token", {
      //     refreshToken
      //   })
      //   localStorage.setItem("accessToken", result.data.accessToken)
      //   const customHeaders = {
      //     token: result.data.accessToken,
      //     refreshToken
      //   };
      //   response = await baseUrl.post(url, data, {
      //     headers: customHeaders,
      //   })
      // }
    }
  
  
    return response
  }








  export const getApiCallToken = async (url) => {
    const refreshToken = localStorage.getItem("refreshToken")
    const accessToken = localStorage.getItem('accessToken')
    
    const customHeaders = {
      token: accessToken,
      refreshtoken:refreshToken
    //   refresh_Token:refreshToken
    };
    let response
    try {
      response = await baseUrl.get(url, {
        headers: customHeaders,
      })
      
    } catch (error) {
      if (error.response.data.message === "Invalid authorization token") {
        localStorage.clear()
      }
      if (error.response.data.message === "Authorization token has expired") {
        localStorage.clear()
      }


      // if (error.response.data.message === "Authorization token has expired") {
      //   // const result = await baseUrl.get("admin/generate-new-access-token-from-refresh-token", {
      //   const result = await baseUrl.get("admin-accessToken-fromRefresh-token", {
      //     refreshToken
      //   })
      //   localStorage.setItem("accessToken", result.data.accessToken)
      //   const customHeaders = {
      //     token: result.data.accessToken,
      //     refreshToken
      //   };
      //   response = await baseUrl.get(url, {
      //     headers: customHeaders,
      //   })
      // }
      
    }
  
  
    return response
  }





  
  export const deleteApiCallToken = async (url, data) => {
    const refreshToken = localStorage.getItem("refreshToken")
    
    const accessToken = localStorage.getItem('accessToken')
    
    const customHeaders = {
      token: accessToken,
      refreshtoken:refreshToken
    //   refresh_Token:refreshToken
    };
    let response
    try {
      response = await baseUrl.delete(url, data, {
        headers: customHeaders,
      })
      
    } catch (error) {
      if (error.response.data.message === "Invalid authorization token") {
        localStorage.clear()
      }
      if (error.response.data.message === "Authorization token has expired") {
        localStorage.clear()
      }

      // if (error.response.data.message === "Authorization token has expired") {
      //   // const result = await baseUrl.post("admin/generate-new-access-token-from-refresh-token", {
      //   const result = await baseUrl.delete("admin-accessToken-fromRefresh-token", {
      //     refreshToken
      //   })
      //   localStorage.setItem("accessToken", result.data.accessToken)
      //   const customHeaders = {
      //     token: result.data.accessToken,
      //     refreshToken
      //   };
      //   response = await baseUrl.delete(url, data, {
      //     headers: customHeaders,
      //   })
      // }
    }
  
  
    return response
  }



















export const postApiCall = (apiPath, value) => {
    const response = baseUrl.post(apiPath, value);
    return response
}

export const deleteApiCall = (apiPath, value) => {
    const response = baseUrl.delete(apiPath, value);
    return response
}

export const signinApi = "admin/admin-signIn";

export const updatedeliverycharge = "delivery-charge/update-delivery-charges";



export const getUserApi = "user/get-user";

export const deletecolorsizeApi = "product/delete-colorSizeOf-product";

export const ProductImageDeleteApi = "product/delete-productImage";

export const ProductImageUpdateApi = "product/updateProduct-image";

export const DeleteselectedApi = "title/deleteById";

export const ckEditorApi = "https://gallant-cohen.50-17-89-82.plesk.page/product/ckeditor-image";

export const addProductApi = "product/add-product";

export const ProductListApi = "product/product-list";

export const updateProductApi = "product/product/edit/";

export const addDiscountApi = "product/Add-discount-onMinimum-order";

export const updateDiscountApi = "product/update-discount";

export const DiscountListApi = "product/get-disocunt-list";

export const getDiscountApi = "product/get-discount";

export const activeInaqctiveDiscountApi = "product/activate-deactivate-discount";

export const addBannerApi = "product/add-banner-image";

export const bannerActiveInactive = "product/activate-deactivate";

export const specialProductActiveInactive = "title/activate-deactivate-protitle";

export const categoryActiveInactive = "category/activate-deactivate-Category";

export const productActiveInactive = "product/activate-deactivate-product";

export const bannerDelete = "product/banner-delete";

export const categoryUpdate = "category/update-category";

export const BannerList = "product/banner-image-list";

export const allcategoryListApi = "category/all-category-list";

export const featuredProductApi = "product/select-delete";

export const updateTitleApi = "title/title-update";

export const addTitleApi = "title/add-title";

export const getTitleList = "title/title-list";


export const homepagetitleApi = "title/upload-title-files";

export const homepagetitleupdateApi = "title/update-title-files";

export const TitleSearchApi = "product/product-search-list";

export const UserQueryApi = "user/get-visitors-list";

export const TitleSearcheditApi = "product/product-edit_searchList";

export const TermcreateApi = "term-condition/create/";

export const orderList = "product/get-order-list";

export const orderDetails = "product/get/product/order/detail";

export const orderstatusUpdate = "product/update/order/status";

export const sizecolorAdd = "product/add-product-sizeColor";

export const sizecolorUpdate = "product/update-size-color";

export const getApiCall = (apiPath, value) => {
    const response = baseUrl.get(apiPath, value);
    return response
}
export const getProductApi = "product/listById"

export const gethometitleApi = "title/get-allTitle-images"

export const gethometitlebyIdApi = "title/get-titleImage-byId"

export const getdeliveryvalue = "delivery-charge/get-delivery-charges"

export const getgstdataApi = "product/gst-list"

export const datacountApi = "product/data-count"

export const categorycountApi = "category/category-count"

export const addCategory = "category/create"

export const categoryList = "category/category-list"

export const subCategoryList = "category/subcategory-byId"

export const similarCategoryList = "category/all-subcategory-list"

export const getCategory = "category/category-byId"

export const getTitle = "title/titlebyId"

export const getTermsandCondition = "term-condition/getData/"

export const getrecentorder = "product/get-recent-order"

export const getusercartlist = "product/usercart-ProductDetails/"

export const getuserwishlist = "product/userWishlist-ProductDetails/"

export const getordercount = "product/order-count"

export const statuslist = "product/get/order/status/list"

export const deliveryChargesApi = "delivery-charge/add-delivery-charges"

export const addTitleOneApi = "title/add-title-image"
export const listTitleApi = "title/get-all-title"
export const viewTitleApi = "title/get-title-image-byId"
export const titleApiUpdate = "title/update-title-image"

export const downloadexcel = "product/export-order-list"


export const updateTrackingIdApi = "product/update-trackingId"



