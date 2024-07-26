
import { Button, Skeleton, Stack, Switch, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import DataTable from 'react-data-table-component';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { BannerList, ImageUrl, bannerActiveInactive, bannerDelete, getApiCallToken, getUserApi, getusercartlist, getuserwishlist, postApiCallToken, } from '../../API/baseUrl';
import { useEffect } from 'react';
import { useState } from 'react';
import { TableSkeleton } from '../Products/tableSkeleton';
import { useNavigate, useParams } from "react-router-dom"
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Grid } from '@mui/material';


function Userdetails({ searchText }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [wishlistdata, setWishlistdata] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [pending, setPending] = useState(true);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(1);
    const [sortBy, setSortBy] = useState('');
    const [sortByColumnName, setSortByColumnName] = useState('');

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



    const fetchusercartList = async () => {
        setPending(true)
        try {
            const result = await getApiCallToken(`${getusercartlist}${id}`)
            if (result.data.status) {
                setData(result.data.data)
            }
        } catch (error) {
            console.log("error", error);
        } finally {
            setPending(false)
        }
    }

    const fetchuserwishList = async () => {

        setPending(true)
        try {
            const result = await getApiCallToken(`${getuserwishlist}${id}`)
            if (result.data.status) {
                setWishlistdata(result.data.data)
            }
        } catch (error) {
            console.log("error", error);
        } finally {
            setPending(false)
        }
    }

    useEffect(() => {
        fetchusercartList();
        fetchuserwishList();
    }, []);


    const cartlistcolumns = [
        {
            name: 'Product Id',
            width: "180px",
            selector: row => <p className='align' style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => handleDetails(row.productId)}>{row.productId}</p>,
            column_name: 'productId',
            reorder: true,
        },
        {
            name: 'Product Name',
            width: "180px",
            selector: row => row.product_name ? row.product_name : "---",
            column_name: 'product_name',
            reorder: true,
        },
        {
            name: 'Sku',
            selector: row => row.sku ? row.sku : "---",
            column_name: 'user_first_name',
            reorder: true,
        },
        {
            name: 'MRP',
            width: "180px",
            selector: row => <p className='align'><CurrencyRupeeIcon sx={{ fontSize: "16px" }} /> {row.mrp_amount}</p>,
            column_name: 'mrp_amount',
            reorder: true,
        },
        {
            name: 'Status',
            selector: row => row.is_active === 1 ? "In Stock" : "Out of Stock",
            column_name: 'is_active',
            reorder: true,
        },
        {
            name: 'Size',
            selector: row => row.product_size ? row.product_size : "---",
            column_name: 'product_size',
            reorder: true,
        },
        {
            name: 'Color',
            selector: row => row.color_name ? row.color_name : "---",
            column_name: 'color_name',
            reorder: true,
        },
        {
            name: 'Image',
            width: "180px",
            selector: row => <Stack>
                {row?.file ? <a target='_blank' rel='noreferrer' href={`${ImageUrl}${row?.file}`}><img src={`${ImageUrl}${row?.file}`} width={40} height={40} alt='product' /></a> : "---"}
            </Stack>
            ,
            column_name: 'file',
            reorder: true,
        },
    ];


    const handleDetails = async (id) => {
        navigate(`/dashboard/products_view/${id}`)
    }

    
    const handleGoBacked = async () => {
        navigate('/dashboard/User')
    }
   

    const customStyles = {
        headCells: {
            style: {
                fontSize: '20px',
                fontWeight: 'bold',
            },
        },
    };
    return (
        <>
            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ alignItems: 'center', display: 'flex', fontWeight: 'bold' }}>
                <ArrowBackIcon onClick={handleGoBacked} className='arrow_back' />
                <Typography variant="h5" gutterBottom mt={1} sx={{ fontWeight: "600"}}>
                User's Cart List</Typography>

            </Grid>
       
            <DataTable
                customStyles={customStyles}
                columns={cartlistcolumns}
                data={data}
                fixedHeader
                // progressPending={pending}
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
                // pagination
                // paginationServer
                // paginationTotalRows={totalRows}
                fixedHeaderScrollHeight="58vh"
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                sortServer
                responsive
                onSort={handleSort}
            />

            <Divider />
            <Typography variant="h5" gutterBottom mt={1} sx={{ fontWeight: "600", pt: 3, pl: 2 }}>
                User's WishList</Typography>

            <DataTable
                customStyles={customStyles}
                columns={cartlistcolumns}
                data={wishlistdata}
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
                // pagination
                // paginationServer
                // paginationTotalRows={totalRows}
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

export default Userdetails;
