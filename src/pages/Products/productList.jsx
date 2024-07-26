

import React, { useEffect, useState } from 'react';
import "./index.css"
import EditOffIcon from '@mui/icons-material/EditOff';
import { useNavigate } from 'react-router-dom';
import { Products } from '../../Components/Heading';
import SearchToolbar from '../../Components/Search/Search';
import { ImageUrl, ProductListApi, allcategoryListApi, categoryList, featuredProductApi, getApiCall, getApiCallToken, postApiCallToken, productActiveInactive, similarCategoryList } from '../../API/baseUrl';
import { Card, Container, FormGroup, Stack, Box, Checkbox, FormControlLabel, Skeleton, TableBody, TableCell, TableRow, Switch } from '@mui/material';
import RemoveTag from '../../Components/htmlParser';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import ToastMessage from '../../utils/ToastMessage';
import { TableSkeleton } from './tableSkeleton';
import DataTable from 'react-data-table-component';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const ProductList = () => {
  const navigate = useNavigate();
  const [searchText, setSearchtext] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(1);
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [sortBy, setSortBy] = useState("asc");
  const [sortByColumnName, setSortByColumnName] = useState('');
  const [pending, setPending] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [subcategoryData, setSubcategoryData] = useState([]);

  const checkAvailability = data => (data || "-")

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


  const checkid = (arr, id) => {
    const returnVal = arr.filter(item => item.id === id)
    return returnVal[0]
  }

  const columns = [
    {
      name: 'Id',
      width: "100px",
      selector: row => row?.id,
      sortable: true,
      column_name: 'id',
      reorder: true,
    },
    {
      name: 'Featured Product',
      width: "180px",
      cell: row =>

        <Stack
        > <FormGroup >
            <FormControlLabel control={<Checkbox defaultChecked={row.is_featured} />}
              name="isCheck"
              onClick={() => handleFeaturedProduct(row.id)}
            />
          </FormGroup>
        </Stack>

    },
    {
      name: 'Name',
      width: "180px",
      selector: row => row?.productName,
      sortable: true,
      column_name: 'productName',
      reorder: true,
    },
    {
      name: 'Sku No.',
      width: "180px",
      selector: row => row.sku ? row.sku : "---",
      sortable: true,
      column_name: 'sku',
      reorder: true,
    },
    {
      name: 'Category',
      width: "180px",
      selector: row => checkid(categoryData, row?.categoryId)?.category_name ? checkid(categoryData, row?.categoryId)?.category_name :"---",
                          
      sortable: true,
      column_name: 'categoryId',
      reorder: true,
    },
    {
      name: 'Sub Category',
      width: "180px",
      selector: row => checkid(subcategoryData, row.subCategoryId)?.category_name ? checkid(subcategoryData, row.subCategoryId)?.category_name : "---",
      sortable: true,
      column_name: 'subCategoryId',
      reorder: true,
    },
    {
      name: 'MRP',
      width: "180px",
      selector: row => <p className='align'><CurrencyRupeeIcon sx={{fontSize:"16px"}}/> {row.mrp_amount}</p>,
      sortable: true,
      column_name: 'mrp_amount',
      reorder: true,
    },
    {
      name: 'Maximum Order Quantity',
      // width: "180px",
      selector: row => row.orderlimit ? row.orderlimit : "---",
      sortable: true,
      column_name: 'orderlimit',
      reorder: true,
    },
    {
      name: 'Taxable Amount',
      width: "180px",
      selector: row => <p className='align'><CurrencyRupeeIcon sx={{fontSize:"16px"}}/> {row.taxable_amount}</p>,
      sortable: true,
      column_name: 'taxable_amount',
      reorder: true,
    },
    {
      name: 'Description ',
      width: "180px",
      height: "60px",
      selector: row =>row.description? <RemoveTag className="description_oftable" ParserText={row.description} />: "---",
      sortable: true,
      column_name: 'description',
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
    {
      name: 'Status',
      width: "140px",
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
      width: "140px",
      cell: row =>
        <>
          {
            <Stack sx={{ cursor: 'pointer', marginRight: '10px' }}
              onClick={() => handleProductEdit(row.id)}
            >
              <BorderColorTwoToneIcon />
            </Stack>
          }
        </>
    },
  ];

  const handleStatus = async (id) => {
    try {
      const result = await postApiCallToken(`${productActiveInactive}/${id}`)
      if (result.data.status) {
        ToastMessage("success", result.data.message)
      } else {
        ToastMessage("error", result.data.message)
      }
    } catch (error) {

    }

  }

  const handleFeaturedProduct = async (id) => {
    try {
      const result = await postApiCallToken(`${featuredProductApi}/${id}`)
      if (result.data.status) {
        ToastMessage("success", result.data.message)
      } else {
        ToastMessage("error", result.data.message)
      }
    } catch (error) {

    }

  }



  const handleProductEdit = async (id) => {
    navigate(`/dashboard/products_add/${id}`)
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


  const handleSort = (column, sortDirection) => {
    setSortBy(sortDirection);
    setSortByColumnName(column.column_name || '');
  };


  const fetchProductList = async () => {
    setPending(true)
    try {
      const result = await postApiCallToken(ProductListApi, {
        limit: limit,
        offset: searchText ? 1 : offset,
        search: searchText,
        column_name: sortByColumnName,
        sort_by: sortBy === "asc" ? "DESC" : "ASC",
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
    fetchProductList();
  }, [sortByColumnName, searchText, sortBy, limit, offset]);

  const handleOpen = () => {
    navigate("/dashboard/products-add")
  };


  const callBack = (data) => {
    setSearchtext(data);
  };

  return (
    <Box sx={{overflow:"hidden"}}>
    <Container maxWidth="false" className="containerdivuser">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
             <SearchToolbar
              callBack={callBack}
              value={searchText}
              margin="0px"
              setSearchtext={setSearchtext}
              headingName={Products}
              btnname={"Add Products"}
              handleOpen={handleOpen}
            />
      </Stack>
      <Card className='Table_container' >
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
        </Card>
      </Container>
    </Box>
  )
}
export default ProductList;