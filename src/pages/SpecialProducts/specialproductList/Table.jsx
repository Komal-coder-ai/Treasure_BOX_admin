import { Box, Skeleton, Stack, Switch, TableBody, TableCell, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { TableSkeleton } from '../../Products/tableSkeleton';
import DataTable from 'react-data-table-component';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import { useNavigate } from 'react-router-dom';
import {  getApiCallToken, getTitleList, postApiCallToken, specialProductActiveInactive } from '../../../API/baseUrl';
import ToastMessage from '../../../utils/ToastMessage';

const Table = ({ searchText }) => {
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(1);
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [sortBy, setSortBy] = useState('');
    const [sortByColumnName, setSortByColumnName] = useState('');
    const [pending, setPending] = useState(true);
    const navigate = useNavigate();
    const columns = [
      {
        name: 'Id',
        selector: row => row?.id,
        sortable: true,
        column_name: 'id',
        reorder: true,
      },
      {
        name: 'Name',
        selector: row => row?.title_name,
        sortable: true,
        column_name: 'title_name',
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
        name: 'Edit',
        cell: row =>        
                <Stack sx={{ cursor: 'pointer', marginRight: '10px' }}
                  onClick={() => handleTitleEdit(row.id)}
                >
                  <BorderColorTwoToneIcon />
                </Stack>
      },
    ];
  
    const handleStatus = async (id) => {
      try {
          const result = await getApiCallToken(`${specialProductActiveInactive}/${id}`)
          if (result.data.status) {
              ToastMessage("success", result.data.message)
          } else {
              ToastMessage("error", result.data.message)
          }
      } catch (error) {

      }

  }

  
    const handleTitleEdit = async (id) => {
      navigate(`/dashboard/Special_add/${id}`)
    }
  
   
    // //   ----------------------------------------------api-------------------------------------
  
  
  
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
  
  
    const fetchSpecialProduct = async () => {
      setPending(true)
      try {
        const result = await postApiCallToken(getTitleList,{
        limit: limit,
        offset: searchText ? 1 : offset,
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
      fetchSpecialProduct();
    }, [sortByColumnName, searchText, sortBy, limit, offset]);
    return (
  
      <Box sx={{ width: '100%' }}>
        <DataTable
          customStyles={customStyles}
          className="datatableclass productTable"
          fixedHeader
          fixedHeaderScrollHeight="58vh"
          title=""
          columns={columns}
          data={data}
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
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          sortServer
          responsive
          onSort={handleSort}
        />
      </Box>                                            
    );                 
  };               
export default Table