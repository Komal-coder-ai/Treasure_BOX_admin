
import { useState, useEffect } from 'react';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import './index.css'
import { Card, Stack, TableRow, TableBody, TableCell, Container, Typography, Skeleton } from '@mui/material';
import DataTable from 'react-data-table-component';
import { LoadingButton } from '@mui/lab';
// import { BaseUrl, BILLING_LIST, checkData, ImageUrl, postApiCall } from '../../API/BaseUrl';

// import MuiSelectPending from '../../components/MuiSelectPending/Index';
// import { checkAvailability, checkCapital } from '../../utils/Helper/checkAvailability';

// import SectionHeader from '../../components/sectionHeader';
// import { skeletondata } from '../../utils/Skeletondata';
import { ImageUrl, allcategoryListApi, getApiCallToken, gethometitleApi, listTitleApi, postApiCallToken, similarCategoryList } from '../../../API/baseUrl';
import SectionHeader from '../../../Components/sectionHeader';
import { dateFormatter } from '../../../Components/dateFormatter';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { TableSkeleton } from '../../Products/tableSkeleton';


export default function TitleTable() {
  const [page, setPage] = useState(0);
  const [selected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [pending, setPending] = useState(true);
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('');
  const [sortByColumnName, setSortByColumnName] = useState('');
  const [searchText, setSearchtext] = useState("")
  const [categoryData, setCategoryData] = useState([]);
  const [subcategoryData, setSubcategoryData] = useState([]);

  const categoryApi = async () => {
    try {
      const result = await postApiCallToken(allcategoryListApi, {
        limit: "",
        offset: "",
        search: "",
        column_name: "",
        sort_by: sortBy === "asc" ? "DESC" : "ASC",
      })

      if (result.data.status) {
        setCategoryData(result.data.data);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
    }
  }

  useEffect(() => {
    categoryApi()
  }, [])

  const subcategoryApi = async () => {
    const response = await getApiCallToken(similarCategoryList)
    setSubcategoryData(response.data.data);
  }

  useEffect(() => {
    subcategoryApi()
  }, [])


  const checkAvailability = data => (data || "-")


  const navigate = useNavigate()

  const checkid = (arr, id) => {
    const returnVal = arr.filter(item => item.id === id)
    return returnVal[0]
  }


  const columns = [
    {
      name: 'Id',
      width: '100px',
      selector: row => <Link to={`/dashboard/titlemodule/${row.id}`} state={row.id}>{checkAvailability(row.id)}</Link>,
      sortable: false,
      column_name: 'id'
    },
    {
      name: 'Image',
      width: "180px",
      selector: row => <Stack>
        {row?.files ?  <a target='_blank' rel='noreferrer' href={`${ImageUrl}${row?.files}`}><img src={`${ImageUrl}${row?.files}`} width={100} height={100} alt='product' /></a> : "---"}
      </Stack>
      ,
      column_name: 'files',
      reorder: true,
    },
    {
      name: 'Category',
      width: "180px",
      selector: row => checkid(categoryData, row?.category_id)?.category_name ? checkid(categoryData, row?.category_id)?.category_name :"---",
                          
      sortable: false,
      column_name: 'categoryId',
      reorder: true,
    },
    {
      name: 'Sub Category',
      width: "180px",
      selector: row => checkid(subcategoryData, row.sub_categoryId)?.category_name ? checkid(subcategoryData, row.sub_categoryId)?.category_name : "---",
      sortable: false,
      column_name: 'subCategoryId',
      reorder: true,
    },
    {
      name: 'Edit',
      width: "140px",
      cell: row =>
        <>
          {
            <Stack sx={{ cursor: 'pointer', marginRight: '10px' }}
              onClick={() => handleTitleEdit(row.id)}
            >
              <BorderColorTwoToneIcon />
            </Stack>
          }
        </>
    },


  ];

  
  const handleTitleEdit = async (id) => {
    navigate(`/dashboard/titlemodule/${id}`)
  }


  const apiCall = async () => {
    setPending(true)
    try {
      const result = await getApiCallToken(gethometitleApi)
      setData(result.data.allData)
    } catch (error) {
      console.log("error")
    } finally {
      setPending(false)
    }
  }

  const handlePageChange = page => {
    setPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPage(page);
    setPerPage(newPerPage);
  };

  useEffect(() => {
    apiCall(); // fetch page 1 of users		
  }, []);

  const handleSort = async (column, sortDirection) => {
    setSortBy(sortDirection);
    setSortByColumnName(column.column_name);
  };
  const callBack = (data) => {
    setSearchtext(data)
    setPage(1)
  }
  //   checkData("Billing")

  return (
    <>
      <div className='userpagemaindiv'>

        <Container maxWidth="false" className='containerdivuser'>
          {/* <h3>Title</h3> */}
          <SectionHeader {...{ callBack, setSearchtext }} isSearch value={searchText} headingText="Title"
            onClick={() => { navigate('/dashboard/titleModule') }}
            // isButton Buttontext={data.length? "" : 'Add Title'} />
            isButton Buttontext="" />
          <Card>
            <DataTable
              className='datatableclass billing_table'
              fixedHeader
              fixedHeaderScrollHeight='58vh'
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
          </Card>
        </Container>

      </div>

    </>
  );
}

