import { Button, Skeleton, Stack, Switch, TableBody, TableCell, TableRow, Typography} from '@mui/material';
import DataTable from 'react-data-table-component';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { BannerList, ImageUrl, UserQueryApi, bannerActiveInactive, bannerDelete, getUserApi, postApiCallToken, } from '../../API/baseUrl';
import { useEffect } from 'react';
import { useState } from 'react';
import { TableSkeleton } from '../Products/tableSkeleton';
import { UserHeading } from '../../Components/Heading';
import SearchToolbar from '../../Components/Search/Search';


function Query({ searchText }) {

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
            const result = await postApiCallToken(UserQueryApi, {
                limit: limit,
                offset: offset,
                search: searchText,
                column_name: sortByColumnName,
                sort_by: sortBy,
            })
            if (result.data.status) {
                setData(result.data.queries)
                setTotalRows(result.data.currentCount)
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
            selector: row => row?.id,
            sortable: true,
            column_name: 'id',
            width:"150px",
            reorder: true,
        },
        {
            name: 'Email',
            selector: row => row.email ? row.email : "---",
            sortable: true,
            column_name: 'email',
            width:"280px",
            reorder: true,
        },
        {
            name: 'Mobile Number',
            selector: row => row.mobile ? row.mobile : "---",
            sortable: true,
            column_name: 'mobile',
            width:"280px",
            reorder: true,
        },
        {
            name: 'Query',
            selector: row => row.message ? row.message : "---",
            sortable: true,
            column_name: 'message',
            reorder: true,
        },
    ];

   
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
User Query</Typography>
    
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

export default Query;
