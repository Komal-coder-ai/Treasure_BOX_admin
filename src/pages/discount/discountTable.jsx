import { Skeleton, Stack, Switch, TableBody, TableCell, TableRow} from '@mui/material';
import DataTable from 'react-data-table-component';
import {  DiscountListApi,  activeInaqctiveDiscountApi,  bannerActiveInactive, postApiCallToken } from '../../API/baseUrl';
import { useEffect } from 'react';
import { useState } from 'react';
import ToastMessage from '../../utils/ToastMessage';
import "./index.css";
import { TableSkeleton } from '../Products/tableSkeleton';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useNavigate} from "react-router-dom";
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';


function DiscountTable({ searchText }) {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [pending, setPending] = useState(true);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(1); 
    const [sortBy, setSortBy] = useState('');
    const [sortByColumnName, setSortByColumnName] = useState('created_at');



    const columns = [
        {
            name: 'Id',
            selector: row => row?.id,
            sortable: true,
            column_name: 'id',
            reorder: true,
        },
        {
            name: 'Order Amount',
            selector: row => <p className='align'><CurrencyRupeeIcon sx={{fontSize:"16px"}}/> {row.minimum_order_amount}</p>,
            sortable: true,
            column_name: 'minimum_order_amount',
            reorder: true,
          },
        {
            name: 'Discount (In %)',
            selector: row => row.discount_percent ? row.discount_percent :"---",
             sortable: true,
            column_name: 'discount_percent',
            reorder: true,
        },
        {
            name: 'Coupon code',
            selector: row => row.coupon_code ? row.coupon_code :"---",
            sortable: true,
            column_name: 'coupon_code',
            reorder: true,
          },
          {
            name: 'Status',
            cell: row =>

                <Stack
                > <Switch
                        onClick={() => handleStatus(row.id)}
                        inputProps={{ 'aria-label': 'controlled' }}
                        defaultChecked={row.is_active}
                    />
                </Stack>

        },
        {
            name: 'Edit',
            width: "140px",
            cell: row =>
              <>
                {
                  <Stack sx={{ cursor: 'pointer', marginRight: '10px' }}
                    onClick={() => handleDiscountEdit(row.id)}
                  >
                    <BorderColorTwoToneIcon />
                  </Stack>
                }
              </>
          },
    ];


    const handleDiscountEdit = async (id) => {
        navigate(`/dashboard/addDiscount/${id}`)
      }

    const handleStatus = async (id) => {
        
        try {
            const result = await postApiCallToken(`${activeInaqctiveDiscountApi}/${id}`)
            if (result.data.status) {
                ToastMessage("success", result.data.message)
            } else {
                ToastMessage("error", result.data.message)
            }
        } catch (error) {

        }

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


    const fetchBannerList = async () => {
        setPending(true)
        try {
            const result = await postApiCallToken(DiscountListApi, {
                limit: limit,
                offset: offset,
                search: searchText,
                column_name: sortByColumnName,
                sort_by: sortBy ==="asc" ? "DESC" : "ASC"  ,
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
        fetchBannerList();
    }, [sortByColumnName, searchText, sortBy, limit, offset]);

    return (
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
    );
};

export default DiscountTable;