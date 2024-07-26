import * as Yup from 'yup';

export const LoginFormSchema = Yup.object().shape({
    email: Yup.string().email().required('Please Enter your email'),
    password: Yup.string().required('Please Enter your password'),
});

export const SignupFormSchema = Yup.object().shape({
    email: Yup.string().email().required('Please Enter your email'),
    password: Yup.string().required('Please Enter your password'),
    name: Yup.string().matches(/[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ]+/, 'Name must be alphabetical character').required('Please Enter your name'),
});

export const deliveryChargesSchema = Yup.object().shape({
    fixDeliveryCharges: Yup.string().matches(/^([1-9][0-9]{,2}(,[0-9]{3})*|[0-9]+)(\.[0-9]{1,9})?$/, 'Charges must be a Positive number').max(10, 'Charges can only contain 10 digit').required('Please enter field'),
    minimumDeliveryCharges: Yup.string().matches(/^([1-9][0-9]{,2}(,[0-9]{3})*|[0-9]+)(\.[0-9]{1,9})?$/, 'Charges must be a Positive number').max(10, 'Charges can only contain 10 digit').required('Please enter field'),
});

export const titleSchemaFirst = Yup.object().shape({

    firstImage: Yup.string().required('Please upload image'),

    firstTitleName: Yup.string().required('Please enter title'),

    firstTitleDescription: Yup.string(),

    firstTitleUrl: Yup.string()
        .matches(
            /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
            'Enter correct url!'
        ),
});
export const titleSchemaSecond = Yup.object().shape({

    firstImage: Yup.string().required('Please upload image'),

    firstTitleName: Yup.string().required('Please enter title'),

    firstTitleDescription: Yup.string(),

    firstTitleUrl: Yup.string()
        .matches(
            /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
            'Enter correct url!'
        ),
});

export const ProductSchema = Yup.object().shape({
    product_name: Yup.string().matches(/[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ]+/, 'Name must be alphabetical character').required('Please enter product name'),

    taxable_amount: Yup.string().matches(/^([1-9][0-9]{,2}(,[0-9]{3})*|[0-9]+)(\.[0-9]{1,9})?$/, 'Price must be a number')
        .typeError('Price must be a number').when('without_tax_amount', (without_tax_amount) => {
            if (without_tax_amount) {
                return Yup.number()
                    .min(without_tax_amount, 'Taxable Amount must be greater than MRP')
                    .typeError('Price must be a number')
            }
        }),
    files: Yup.string().required('Please enter Image'),
    thumbnailImage: Yup.string(),
    mrp_amount: Yup.string().matches(/^([1-9][0-9]{,2}(,[0-9]{3})*|[0-9]+)(\.[0-9]{1,9})?$/, 'Price must be a number').max(10, 'MRP can only contain 10 digit').required('Please enter MRP'),
    category_Id: Yup.string().required('Please enter category'),
    subCategory_Id: Yup.string().required('Please enter subcategory'),
    description: Yup.mixed().required('Please enter description'),
    similar_category: Yup.string().required('Please enter similar category'),
    gst: Yup.string(),
    orderlimit: Yup.string().matches(/^([1-9][0-9]{,2}(,[0-9]{3})*|[0-9]+)(\.[0-9]{1,9})?$/, 'Maximum Order Quantity must be a Positive Number'),
    sku: Yup.string().required("Please enter sku"),
    discount_percent: Yup.number().min(0, 'Discount must be a positive number').typeError('Discount must be a positive number'),
})


export const ProductSchemaedit = Yup.object().shape({
    product_name: Yup.string().matches(/[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ]+/, 'Name must be alphabetical character').required('Please enter product name'),
    orderlimit: Yup.string().matches(/^([1-9][0-9]{,2}(,[0-9]{3})*|[0-9]+)(\.[0-9]{1,9})?$/, 'Maximum Order Quantity must be a Positive Number'),
   
    taxable_amount: Yup.string().matches(/^([1-9][0-9]{,2}(,[0-9]{3})*|[0-9]+)(\.[0-9]{1,9})?$/, 'Price must be a number')
        .typeError('Price must be a number').when('without_tax_amount', (without_tax_amount) => {
            if (without_tax_amount) {
                return Yup.number()
                    .min(without_tax_amount, 'Taxable Amount must be greater than MRP')
                    .typeError('Price must be a number')
            }
        }),
    files: Yup.string(),
    thumbnailImage: Yup.string(),
    mrp_amount: Yup.string().matches(/^([1-9][0-9]{,2}(,[0-9]{3})*|[0-9]+)(\.[0-9]{1,9})?$/, 'Price must be a number').max(10, 'MRP can only contain 10 digit').required('Please enter MRP'),
    category_Id: Yup.string().required('Please enter category'),
    subCategory_Id: Yup.string().required('Please enter subcategory'),
    description: Yup.mixed().required('Please enter description'),
    similar_category: Yup.string().required('Please enter similar category'),
    gst: Yup.string(),
    sku: Yup.string().required('Please enter Sku'),
    discount_percent: Yup.number().min(0, 'Discount must be a positive number')
})

export const BannerSchema = Yup.object().shape({
    files: Yup.string().required('Please enter file'),
})

export const TrackingIdSchema = Yup.object().shape({
    orderTrackingId: Yup.string().required('Please enter Tracking ID'),
})


export const HomrTitleSchema = Yup.object().shape({
    file1: Yup.string().required('Please enter file'),
    file2: Yup.string()
      .matches(/^\s*535\s*[*x]\s*257\s*$/, 'Invalid dimensions. Use the format: 535*257')
      .required('Dimensions are required'),
    file3: Yup.string().required('Please enter file'),
    file4: Yup.string().required('Please enter file'),
})
export const HomeTitleeditSchema = Yup.object().shape({
    files: Yup.string().required('Dimensions are required'),
  })

export const categorySchema = Yup.object().shape({
    category_name: Yup.string().matches(/^(\w| )*[0-9A-Za-z](\w| )*$/, 'This field must have an alphabet').required('Please fill required field'),
    isCheck: Yup.boolean('Select this checkbox please'),
    parentId: Yup.mixed()
        .when('isCheck', {
            is: (isCheck) => !isCheck,
            then: (schema) => schema.required("Please fill this field when checkbox is unchecked"),
            otherwise: (schema) => schema.notRequired(),
        }),
    files: Yup.string().required('Please enter file'),
})

export const SpecialProductsSchema = Yup.object().shape({
    title_name: Yup.string().matches(/^(\w| )*[0-9A-Za-z](\w| )*$/, 'This field must have an alphabet').required('Please enter Title'),
    Products: Yup.mixed().required('Please fill products').typeError('Please fill products')
})


export const privacySchema = Yup.object().shape({
    privacyContent: Yup.string().required('Please enter Title'),
})

export const discountSchema = Yup.object().shape({
    discount_percent: Yup.number().min(0, 'Discount must be a positive number').typeError('Discount must be a positive number').required("This field is required"),
    minimum_order_amount: Yup.number().min(0, 'Discount must be a positive number').typeError('Discount must be a positive number'),
    coupon_code: Yup.string().matches(/^[^\s][a-zA-Z0-9][a-zA-Z0-9-_]*$/, 'space is not allowed in beginning')
})

export const discountfieldschema = Yup.object().shape({
    discount_percent: Yup.number().min(0, 'Discount must be a positive number').typeError('Discount must be a positive number').required("This field is required"),
    minimum_order_amount: Yup.number().min(0, 'Discount must be a positive number').required("Please fill this field when coupon code is Empty").typeError('Discount must be a positive number'),
    coupon_code: Yup.string().matches(/^[^\s][a-zA-Z0-9][a-zA-Z0-9-_]*$/, 'space is not allowed in beginning')
})
