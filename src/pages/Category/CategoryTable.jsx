import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageUrl, allcategoryListApi, categoryActiveInactive, categoryList, getApiCall, getApiCallToken, postApiCall, postApiCallToken } from '../../API/baseUrl';
import DataTable , { Alignment } from 'react-data-table-component';
import { Skeleton, Stack, Switch, TableBody, TableCell, TableRow } from '@mui/material';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import { TableSkeleton } from '../Products/tableSkeleton';
import moment from 'moment/moment';
import ToastMessage from '../../utils/ToastMessage';

const CategoryTable = ({ searchText }) => {

  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [pending, setPending] = useState(true);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(1);
  const [sortBy, setSortBy] = useState("asc");
  const [sortByColumnName, setSortByColumnName] = useState('created_at');

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
      name: 'Created at',
      selector: row => row.created_at ,
      format: (row) => moment(row.created_at).format('MMMM Do YYYY'),
      sortable: true,
      column_name: 'created_at',
      reorder: true,
    },
    {
      name: 'Name',
      selector: row =>  row.category_name ,
      sortable: true,
      column_name: 'id',
      reorder: true,
    },
    {
      name: 'Type',
      selector: row => row.isParent ? "Category" : "Sub Category", 
      sortable: true,
      column_name: 'created_at',
      reorder: true,
    },
    {
      name: 'Image',
      selector: row =>
          <Stack>
            {row?.files ? <a target='_blank' rel='noreferrer' href={`${ImageUrl}${row?.files}`}><img src={`${ImageUrl}${row?.files}`} width={40} height={45} alt='file' /></a> : "---"}
          </Stack> ,
      sortable: true,
      column_name: 'files',
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
                  defaultChecked={row.isActive}
              />
          </Stack>

   },
    {
      name: 'Edit',
      cell: row =>
        <>
          <Stack sx={{ cursor: 'pointer' }}
            onClick={() => handleCategoryEdit(row.id)}
          >
            <BorderColorTwoToneIcon />
          </Stack>

        </>
    },

  ];

  const handleStatus = async (id) => {
    
    try {
        const result = await getApiCallToken(`${categoryActiveInactive}/${id}`)
        if (result.data.status) {
            ToastMessage("success", result.data.message)
        } else {
            ToastMessage("error", result.data.message)
        }
    } catch (error) {

    }

}


  const handleCategoryEdit = async (id) => {
    navigate(`/dashboard/category-add/${id}`)
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


  const fetchBannerList = async () => {
    setPending(true)
    try {
      // const result = await postApiCall(allcategoryListApi,{
      const result = await postApiCallToken(allcategoryListApi,{
        limit: limit,
        offset: searchText ? 1 : offset,
        search: searchText,
        column_name: sortByColumnName,
        sort_by: sortBy === "asc" ? "DESC" : "ASC"  ,
      })

      if (result.data.status) {
        setPending(false)
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
      dataAlign='center'
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
      fixedHeaderScrollHeight="58vh"
      sortServer
      responsive
      onSort={handleSort}
    />
  )
}

export default CategoryTable;