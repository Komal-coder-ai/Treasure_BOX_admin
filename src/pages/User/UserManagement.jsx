
import { Button, Skeleton, Stack, Switch, TableBody, TableCell, TableRow, Typography} from '@mui/material';
import DataTable from 'react-data-table-component';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { BannerList, ImageUrl, bannerActiveInactive, bannerDelete, getUserApi, postApiCallToken, } from '../../API/baseUrl';
import { useEffect } from 'react';
import { useState } from 'react';
import { TableSkeleton } from '../Products/tableSkeleton';
import { useNavigate } from 'react-router-dom';


function UserManagement({ searchText }) {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
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
    


    const fetchBannerList = async () => {
        setPending(true)
        try {
            const result = await postApiCallToken(getUserApi, {
                limit: limit,
                offset: offset,
                search: searchText,
                column_name: sortByColumnName,
                sort_by: sortBy   ,
            })
            if (result.data.status) {
                setData(result.data.users)
                setTotalRows(result.data.userCount)
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


    const columns = [
        {
            name: 'Id',
            selector: row => <p className='align' style={{cursor:"pointer",textDecoration:"underline"}} onClick={()=>handleDetails(row.user_id)}>{row.user_id}</p>,
            sortable: true,
            column_name: 'user_id',
            reorder: true,
        },
        {
            name: 'Mobile Number',
            selector: row => row.user_mobile ? row.user_mobile : "---",
            sortable: true,
            column_name: 'user_mobile',
            reorder: true,
        },
        {
            name: 'First Name',
            selector: row => row.user_first_name ? row.user_first_name : "---",
            sortable: true,
            column_name: 'user_first_name',
            reorder: true,
        },
        {
            name: 'Last Name',
            selector: row => row.user_last_name ? row.user_last_name : "---",
            sortable: true,
            column_name: 'user_last_name',
            reorder: true,
        },
        {
            name: 'Email',
            selector: row => row.user_email ? row.user_email :"---",
            sortable: true,
            column_name: 'user_email',
            reorder: true,
        },
        {
            name: 'Gender',
            selector: row => row.user_gender ? row.user_gender : "---" ,
            sortable: true,
            column_name: 'user_gender',
            reorder: true,
        },
        {
            name: 'Wishlist Count',
            selector: row => row.wishlistCount,
            // sortable: true,
            column_name: 'wishlistCount',
            reorder: true,
        },
        {
            name: 'Cart Count',
            selector: row => row.cartCount,
            // sortable: true,
            column_name: 'cartCount',
            reorder: true,
        },
    ];


        const handleDetails = async (id) => {
        navigate(`/dashboard/userdetails/${id}`)
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
      <Typography variant="h4" gutterBottom mt={1} sx={{ fontWeight: "600" , p:3}}>
Users</Typography>
    
        <DataTable
            customStyles={customStyles}
            columns={columns}
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

export default UserManagement;
