import { Button, Skeleton, Stack, Switch, TableBody, TableCell, TableRow} from '@mui/material';
import DataTable from 'react-data-table-component';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { BannerList, ImageUrl, bannerActiveInactive, bannerDelete, postApiCallToken } from '../../API/baseUrl';
import { useEffect } from 'react';
import { useState } from 'react';
import ToastMessage from '../../utils/ToastMessage';
import "./index.css";
import { TableSkeleton } from '../Products/tableSkeleton';
import swal from "sweetalert";
import moment from 'moment';


function BannerTable({ searchText }) {
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
            name: 'Created at',
            selector: row => row.created_at,
            format: (row) => moment(row.created_at).format('MMMM Do YYYY'),
            sortable: true,
            column_name: 'created_at',
            reorder: true,
        },
        {
            name: 'Image',
            selector: row =>
                <Stack>
                {row?.banner_image ?   <a target='_blank' rel='noreferrer' href={`${ImageUrl}${row?.banner_image}`}><img src={`${ImageUrl}${row?.banner_image}`} width={40} alt='banner' /></a> : "---"}
                  
                </Stack>
            ,
            sortable: true,
            column_name: 'banner_image',
            reorder: true,
        },
        {
            name: 'Status',
            width: '180px',
            cell: row =>

                <Stack
                > <Switch
                        onClick={() => handleStatus(row.id)}
                        inputProps={{ 'aria-label': 'controlled' }}
                        defaultChecked={row.is_active}
                        // color="var(--theme--bg)"
                    />
                </Stack>

        },
        {
            name: 'Delete',
            width: '180px',
            cell: row => <>
                <Button variant="contained" className='popup_btn_banner' onClick={() => handleBannerDeleteAlert(row.id)}>
                    <DeleteForeverIcon sx={{ color: "#e81717" }} />
                </Button>
            </>
        },
    ];

    const handleBannerDeleteAlert = (id) => {
        swal({
            title: "Are you sure you want to delete?",
            text: "Once deleted, You won't be able to revert this!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                handleBannerDelete(id)
            }
        });
    }

    const handleBannerDelete = async (id) => {
        
        try {
            // const result = await postApiCallTokenTokenTokenTokenToken(`${bannerDelete}/${id}`)
            const result = await postApiCallToken(`${bannerDelete}/${id}`)
            if (result.data.status) {
                ToastMessage("success", result.data.message)
                fetchBannerList();
            }
            else {
                ToastMessage("error", result.data.message)
            }
        } catch (error) {

        }

    }


    const handleStatus = async (id) => {
        
        try {
            const result = await postApiCallToken(`${bannerActiveInactive}/${id}`)
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
            const result = await postApiCallToken(BannerList, {
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

export default BannerTable;
