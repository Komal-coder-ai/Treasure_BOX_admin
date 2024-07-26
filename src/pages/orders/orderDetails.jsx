import React, { useEffect, useRef, useState } from 'react'
import "./index.css"
import ToastMessage from '../../utils/ToastMessage'
import { ImageUrl, getApiCallToken, orderDetails, orderstatusUpdate, postApiCallToken, statuslist, updateTrackingIdApi } from '../../API/baseUrl'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Divider, Stack, TableBody, TableCell, TableRow } from '@mui/material'
import {  Grid } from '@mui/material';
import moment from 'moment/moment';
import { Skeleton } from 'antd'
import { TableSkeleton } from '../Products/tableSkeleton'
import DataTable from 'react-data-table-component'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MuiSelect from '../../Components/muiSelect'
import { Toast } from 'primereact/toast';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import swal from "sweetalert";
import InputField from '../../Components/Input'
import { useFormik } from 'formik'
import ButtonComponent from '../../Components/Button'
import { TrackingIdSchema } from '../../utils/Schema'

const initialValues = {
    orderTrackingId: ""
}

const OrderDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [details, setDetails] = useState([])
    const [data, setData] = useState([])
    const [statusData, setStatusData] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const { values, errors, touched, handleBlur, handleSubmit, handleChange, setFieldValue } =
        useFormik({
            initialValues,
            validationSchema: TrackingIdSchema,
            onSubmit: () => sendData(),
        });

    const sendData = async () => {
        try {
            setLoading(true)
            const result = await postApiCallToken(`${updateTrackingIdApi}/${id}`, {
                orderTrackingId: values.orderTrackingId,
            })
            if (result.data.status) {
                ToastMessage("success", result.data.message);
                setLoading(false)
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




    const getDetails = async () => {
        try {
            const result = await postApiCallToken(`${orderDetails}/${id}`)
            if (result?.data?.status) {
                setDetails(result?.data?.data)
                setData(result?.data?.data?.All_Orderd_Product)
                values.orderTrackingId = result.data?.data?.order_trackingId

            } else {
                ToastMessage("error", result.data.message);
            }
        } catch (error) {
        }
    }

    useEffect(() => {
        getDetails()
    }, [])

    const StatusDataApi = async () => {
        try {
            const result = await getApiCallToken(statuslist)
            setStatusData(result.data.data)
        } catch (error) {
            console.log("errors", error);
        }
    }


    useEffect(() => {
        StatusDataApi()
    }, [])




    const customStyles = {
        headCells: {
            style: {
                fontSize: '20px',
                fontWeight: 'bold',
            },
        },
        TableRow: {
            style: {
                maxHeight: "20px !important",
            },
        },
    };

    const columns = [
        {
            name: 'Product Id',
            width: "140px",
            selector: row => <p className='align' style={{ cursor: "pointer" }} onClick={() => handleview(row?.productId)}>{row?.productId}</p>,
            column_name: 'productId',
            reorder: true,
        },
        {
            name: 'Product Image',
            selector: row =>
                <Stack>
                    {row.files ? <a target='_blank' rel='noreferrer' href={`${ImageUrl}${row?.files}`}><img src={`${ImageUrl}${row?.files}`} width={40} alt='banner' /></a>
                        : "---"
                    }
                </Stack>,
            column_name: 'files',
            reorder: true,
        },

        {
            name: 'Product Name',
            width: "320px",
            selector: row => row.product_name ? row.product_name : "---",
            column_name: 'product_name',
            reorder: true,
        },
        {
            name: 'MRP',
            width: "140px",
            selector: row => <p className='align'><CurrencyRupeeIcon sx={{ fontSize: "16px" }} /> {row.discount_percent === 0 ? row.mrp_amount : row.discount_amount}</p>,
            column_name: 'mrp_amount',
            reorder: true,
        },
        {
            name: 'Quantity',
            width: "140px",
            selector: row => row.quantity ? row.quantity : "---",
            column_name: 'quantity',
            reorder: true,
        },
        {
            name: 'Size',
            width: "140px",
            selector: row => row.product_size === "FreeSize" ? "---" : row.product_size,
            column_name: 'product_size',
            reorder: true,
        },
        {
            name: 'Color',
            width: "140px",
            selector: row => row.color_name === "FreeColor" ? "---" : row.color_name,
            column_name: 'color_name',
            reorder: true,
        },

    ];


    const handleGoBack = () => {
        navigate(`/dashboard/order`)
    }


    const handleview = async (id) => {
        // navigate(`/view/${id}`)
        navigate(`/dashboard/products_view/${id}`)
    }


    const handleStatusAlert = (e) => {
        swal({
            title: "Are you sure you want to Change Status?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                handlestatus(e)
            }
        });
    }


    const handlestatus = async (e) => {
        const statusId = statusData.filter(status => status.orderStatus === e.target.value)
        const orderId = statusId[0].id
        try {
            const result = await postApiCallToken(`${orderstatusUpdate}/${details.order_id_fk}`, {
                order_status_id_fk: orderId,
                userId: details.userId,
            })
            if (result.data.status) {
                getDetails()
                ToastMessage("success", result.data.message)

            }
            else {
                ToastMessage("error", result.data.message)
            }
        } catch (error) {

        }
    }

    const submitFormData = (e, imageList) => {
        e.preventDefault();
        handleSubmit();
    }




    return (
        <div className='order_details_container'>
            <div className='pageheading_div'>
                <KeyboardBackspaceIcon sx={{ cursor: "pointer" }} onClick={handleGoBack} />
                <h3> Order Id :  {details.product_order_id}</h3>
            </div>
            <div className='order_detail_container_one'>

                <div className='order_detail_container_fluid'>

                    <Card className='product_detail_card' >
                        <DataTable
                            customStyles={customStyles}
                            className="datatableclass productTable"
                            fixedHeader
                            fixedHeaderScrollHeight="58vh"
                            title=""
                            columns={columns}
                            data={data}
                            progressComponent={
                                <>
                                    <TableBody>
                                        {TableSkeleton.map((row, index) =>
                                            <TableRow hover tabIndex={-1} role="checkbox" key={index}>
                                                <TableCell align="left" className="userpopupclass">
                                                    <Skeleton animation="pulse" width={100} height={30} className="skeletonclass" />
                                                </TableCell>
                                                <TableCell align="left"><Skeleton animation="pulse" width={100} height={30} className="skeletonclass" /></TableCell>
                                                <TableCell align="left"><Skeleton animation="pulse" width={150} height={30} className="skeletonclass" /></TableCell>
                                                <TableCell align="left"><Skeleton animation="pulse" width={80} height={30} className="skeletonclass" /></TableCell>
                                                <TableCell align="left"><Skeleton animation="pulse" width={80} height={30} className="skeletonclass" /></TableCell>
                                                <TableCell align="left"><Skeleton animation="pulse" width={80} height={30} className="skeletonclass" /></TableCell>
                                                <TableCell align="left"><Skeleton animation="pulse" width={80} height={30} className="skeletonclass" /></TableCell>
                                                <TableCell align="left"><Skeleton animation="pulse" width={50} height={30} className="skeletonclass" /></TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </>
                            }
                            sortServer
                            responsive
                        />
                    </Card>
                </div>

                <div className='order_detail_container_one_fluid'>

                    <form onSubmit={submitFormData} className='submitTrackingId'>
                        <Grid container spacing={4} sx={{ display: 'flex', p: 2 }}>
                            <Grid item xs={12} sm={12} md={8} lg={8} sx={{}}>
                                <InputField label="Tracking Id" name="orderTrackingId" value={values.orderTrackingId} type="Text"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    size="small"
                                />
                                {errors.orderTrackingId && touched.orderTrackingId ? (
                                    <p className="form-error">{errors.orderTrackingId}</p>
                                ) : null}
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                            <ButtonComponent btn_name="SUBMIT" loading={loading} type="submit" />
                        </Grid>
                        </Grid>
                    </form>

                    <div className='product_detail_order'>
                        <h3>Customer Details</h3>
                        <Divider />
                        <div className='address_details_inside'>
                            <h4>Customer Name :</h4>
                            <p>{details.name ? details.name : "-"} </p>
                        </div>
                        <div className='address_details_inside'>
                            <h4>Mobile Number :</h4>
                            <p>{details.mobile ? details.mobile : "-"}</p>
                        </div>
                        <div className='address_details_inside'>
                            <h4>Email :</h4>
                            <p>{details.email ? details.email : "-"}</p>
                        </div>
                        <div className='address_details_inside'>
                            <h4>Payment Mode :</h4>
                            <p>{details.payment_mode ? details.payment_mode : "-"}</p>
                        </div>
                        <div className='address_details_inside'>
                            <h4>Payment Id :</h4>
                            <p>{details.payment_id ? details.payment_id : "-"}</p>
                        </div>
                    </div>

                    <div className='product_detail_order'>
                        <h3>Order Summary</h3>
                        <Divider />
                        <div className='address_details_inside'>
                            <h4>Order Date :</h4>
                            <p>{moment(details.Date).format('MMMM Do YYYY')}</p>
                        </div>
                        <div className='address_details_inside'>
                            <h4>Delivery Charges  :</h4>
                            {details.delivery_charge === "Free" ? <p>{details.delivery_charge}</p> : <p className='align'><CurrencyRupeeIcon sx={{ fontSize: "16px" }} />{details.delivery_charge ? details.delivery_charge : "0.00"} /-</p>
                            }
                        </div>
                        <div className='address_details_inside'>
                            <h4>Total Price  :</h4>
                            <p className='align'><CurrencyRupeeIcon sx={{ fontSize: "16px" }} />{details.total_order_amount ? Number(details.total_order_amount).toFixed(2) : "-"} /-</p>
                        </div>
                        <div className='address_details_inside'>
                            <h4>Order Status : </h4>
                            <Toast ref={toast} />
                            <div className='order_status_selector'> <MuiSelect statusCode={statusData} handleChange={(e) => handleStatusAlert(e)} data={details?.orderStatus} ind={details.order_id_fk} />,
                            </div>

                        </div>
                    </div>




                </div>



                <div className='order_detail_container_one_fluid'>

                    <div className='product_detail_order'>
                        <h3>Customer Details</h3>
                        <Divider />
                        <div className='address_details_inside'>
                            <h4>Customer Name :</h4>
                            <p>{details.name ? details.name : "-"} </p>
                        </div>
                        <div className='address_details_inside'>
                            <h4>Mobile Number :</h4>
                            <p>{details.mobile ? details.mobile : "-"}</p>
                        </div>
                        <div className='address_details_inside'>
                            <h4>Email :</h4>
                            <p>{details.email ? details.email : "-"}</p>
                        </div>
                        <div className='address_details_inside'>
                            <h4>Payment Mode :</h4>
                            <p>{details.payment_mode ? details.payment_mode : "-"}</p>
                        </div>
                        <div className='address_details_inside'>
                            <h4>Payment Id :</h4>
                            <p>{details.payment_id ? details.payment_id : "-"}</p>
                        </div>
                    </div>

                    <div className='product_detail_order'>
                        <h3>Order Summary</h3>
                        <Divider />
                        <div className='address_details_inside'>
                            <h4>Order Date :</h4>
                            <p>{moment(details.Date).format('MMMM Do YYYY')}</p>
                        </div>
                        <div className='address_details_inside'>
                            <h4>Delivery Charges  :</h4>
                            {details.delivery_charge === "Free" ? <p>{details.delivery_charge}</p> : <p className='align'><CurrencyRupeeIcon sx={{ fontSize: "16px" }} />{details.delivery_charge ? details.delivery_charge : "0.00"} /-</p>
                            }
                        </div>
                        <div className='address_details_inside'>
                            <h4>Total Price  :</h4>
                            <p className='align'><CurrencyRupeeIcon sx={{ fontSize: "16px" }} />{details.total_order_amount ? Number(details.total_order_amount).toFixed(2) : "-"} /-</p>
                        </div>
                        <div className='address_details_inside'>
                            <h4>Order Status : </h4>
                            <Toast ref={toast} />
                            <div className='order_status_selector'> <MuiSelect statusCode={statusData} handleChange={(e) => handleStatusAlert(e)} data={details?.orderStatus} ind={details.order_id_fk} />,
                            </div>

                        </div>
                    </div>

                    <div className='product_detail_order'>
                        <h3>Delivery Address</h3>
                        <Divider />
                        <div className='address_details_inside'>
                            <h4>Address  :</h4>
                            <p>{details.address ? details.address : "-"}</p>
                        </div>
                        {/* <div className='address_details_inside'>
                            <h4>Landmark  :</h4>
                            <p>{details.landmark ? details.landmark : "-"}</p>
                        </div> */}
                        <div className='address_details_inside'>
                            <h4>City  :</h4>
                            <p>{details.city ? details.city : "-"}</p>
                        </div>
                        <div className='address_details_inside'>
                            <h4>State  :</h4>
                            <p>{details.state ? details.state : "-"}</p>
                        </div>
                        <div className='address_details_inside'>
                            <h4>Pincode  :</h4>
                            <p>{details.pincode ? details.pincode : "-"}</p>
                        </div>
                        <div className='address_details_inside'>
                            <h4>Address Type  :</h4>
                            <p>{details.addressType ? details.addressType : "-"}</p>
                        </div>
                    </div>


                </div>


            </div>
        </div>
    )
}

export default OrderDetails;



