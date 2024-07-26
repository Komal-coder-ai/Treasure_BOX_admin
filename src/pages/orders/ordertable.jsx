import { Autocomplete, Button, Skeleton, Stack, Switch, TableBody, TableCell, TableRow, TextField } from '@mui/material';
import DataTable from 'react-data-table-component';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { BannerList, ImageUrl, bannerActiveInactive, bannerDelete, getApiCall, getApiCallToken, orderList, orderstatusUpdate, postApiCallToken, statuslist } from '../../API/baseUrl';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import ToastMessage from '../../utils/ToastMessage';
import "./index.css";
import { TableSkeleton } from '../Products/tableSkeleton';
import swal from "sweetalert";
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import MuiSelect from '../../Components/muiSelect';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';


function OrderTable({ searchText, startvalue, endvalue }) {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [pending, setPending] = useState(true);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(1);
    const [sortBy, setSortBy] = useState('asc');
    const [sortByColumnName, setSortByColumnName] = useState('Date');
    const [statusData, setStatusData] = useState([]);
    const toast = useRef(null);

    const handleInvoice = (invoice) => {
        window.open(`${ImageUrl}/${invoice}`,'_blank')    
      }


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



    const columns = [
        {
            name: 'Date',
            selector: row => row.Date,
            format: (row) => moment(row.Date).format('MMMM Do YYYY'),
            sortable: true,
            column_name: 'Date',
            width: "160px",
            reorder: true,
        },
        {
            name: 'Order Id',
            // selector: row => row.product_order_id,
            selector: row =>  <p className='align' style={{cursor:"pointer",textDecoration:"underline"}} onClick={()=>handleDetails(row.order_id_fk)}>{row.product_order_id}</p> ,
            sortable: true,
            column_name: 'product_order_id',
            width: "200px",
            reorder: true,
        },
        {
            name: 'Order Tracking Id',
            // selector: row => row.product_order_id,
            selector: row =>  <p className='align' style={{}} >{row.order_trackingId ? row.order_trackingId : "---" }</p> ,
            sortable: true,
            column_name: 'order_trackingId',
            reorder: true,
        },
        {
            name: 'Total Amount',
            selector: row => <p className='align'><CurrencyRupeeIcon sx={{fontSize:"16px"}}/> {row.total_order_amount}</p>,
            sortable: true,
            column_name: 'total_order_amount',
            width: "200px",
            reorder: true,
        },
        {
            name: 'Name',
            selector: row => row?.name,
            sortable: true,
            column_name: 'name',
            width: "200px",
            reorder: true,
        },
        {
            name: 'Mobile Number',
            selector: row => row?.mobile,
            sortable: true,
            column_name: 'mobile',
            width: "200px",
            reorder: true,
        },
        {
            name: 'Full address',
            selector: row => <p>{row?.address},{row?.city},{row?.state},{row?.addressType}</p>,
            sortable: true,
            column_name: 'full_address',
            width: "340px",
            reorder: true,
        },
        {
            name: 'Payment Mode',
            selector: row => row.payment_mode,
            sortable: true,
            column_name: 'payment_mode',
            width: "200px",
            reorder: true,
        },
        {
            name: 'Payment Id',
            selector: row =>  <p className='align' style={{}} >{row.payment_id ? row.payment_id : "---" }</p> ,
            sortable: true,
            column_name: 'payment_id',
            reorder: true,
        },
        {
            name: 'Status',
            width: '170px',
            className: 'status_row',
            selector: (row) => <MuiSelect statusCode={statusData} handleChange={(e) => handleStatusAlert(e, row.order_id_fk , row.userId)} data={row?.orderStatus} ind={row.order_id_fk} />,
            column_name: 'userStatus',
            sortable: true,
        },
        // {
        //     name: 'Details',
        //     width: '180px',
        //     cell: row =>
        //         <Stack>
        //             <button className='view_btn_orderdetail' style={{ cursor: "pointer" }} onClick={() => handleDetails(row.order_id_fk)}>View Details</button>
        //         </Stack>

        // },
        {
            name: 'Invoice',
            width: '180px',
            cell: row =>
                <Stack>
                    <button className='view_btn_orderdetail' style={{ cursor: "pointer" }} onClick={() => handleInvoice(row.invoice_url)}>Download Invoice</button>
                </Stack>

        },
    ];


    const handleStatusAlert = (e, id,userId) => {
        swal({
            title: "Are you sure you want to Change Status?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                handlestatus(e, id,userId)
            }
        });
    }


    const handlestatus = async (e, id,userId) => {
        const statusId = statusData.filter(status => status.orderStatus === e.target.value)
        const orderId = statusId[0].id
        try {
            const result = await postApiCallToken(`${orderstatusUpdate}/${id}`, {
                order_status_id_fk: orderId,
                userId: userId,
            })
            if (result.data.status) {
                ToastMessage("success", result.data.message)
                fetchorderList();
            }
            else {
                ToastMessage("error", result.data.message)
            }
        } catch (error) {

        }
    }



    const handleDetails = async (id) => {
        navigate(`/dashboard/orderdetails/${id}`)
    }

    const customStyles = {
        headCells: {
            style: {
                fontSize: '20px',
                fontWeight: 'bold',
            },
        },
    };

    const handlePerRowsChange = async (newLimit, offset) => {
        setOffset(offset);
        setLimit(newLimit);
    };


    const handlePageChange = (offset) => {
        setOffset(offset);
    };

    const handleSort = async (column, sortDirection) => {
        setSortBy(sortDirection);
        setSortByColumnName(column.column_name || '');
    };


    //   -------------------------------api Call--------------------------------------------------


    const fetchorderList = async () => {
        setPending(true)
        try {
            const result = await postApiCallToken(orderList, {
                limit: limit,
                offset: offset,
                search: searchText,
                column_name: sortByColumnName,
                sort_by: sortBy === "asc" ? "DESC" : "ASC",
                startDate: startvalue,
                endDate: endvalue,
            })

            if (result.data.status) {
                setData(result.data.data)
                setTotalRows(result.data.count)
            }
        } catch (error) {
            console.log("error", error);
        } finally {
            setPending(false)
        }
    }

    useEffect(() => {
        fetchorderList();
    }, [sortByColumnName, searchText, sortBy, limit, offset, startvalue, endvalue]);








    return (

        <><Toast ref={toast} />
            <DataTable
                customStyles={customStyles}
                columns={columns}
                data={data}
                fixedHeader
                progressPending={pending}
                progressComponent={
                    <>
                        <TableBody>
                            {TableSkeleton.map((row, index) =>
                                <TableRow hover tabIndex={-1} role="checkbox" key={index}>
                                    <TableCell align="left" className="userpopupclass">
                                        <Skeleton animation="pulse" width={100} height={30} className="skeletonclass" />
                                    </TableCell>
                                    <TableCell align="left"><Skeleton animation="pulse" width={100} height={30} className="skeletonclass" /></TableCell>
                                    <TableCell align="left"><Skeleton animation="pulse" width={170} height={30} className="skeletonclass" /></TableCell>
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
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                fixedHeaderScrollHeight="58vh"
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                sortServer
                responsive
                onSort={handleSort}
            />
        </>
    );
};

export default OrderTable;
