import {Typography} from '@mui/material';
import DataTable from 'react-data-table-component';
import { useEffect, useState } from 'react';
import {getrecentorder, postApiCallToken } from '../../API/baseUrl';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';


function Orders() {

    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(1); 
    const [sortBy, setSortBy] = useState("asc");
    const [sortByColumnName, setSortByColumnName] = useState("Date");


    const columns = [
      {
          name: 'Date',
          selector: row => row.Date ? row.Date : "---",
          sortable: false,
          column_name: 'Date',
          reorder: true,
          width:"180px"
      },
      {
          name: 'Order Id',
          selector: row => row.product_order_id ? row.product_order_id : "---",
          sortable: false,
          column_name: 'product_order_id',
          reorder: true,
          width:"180px"
      },
      {
          name: 'Payment Mode',
          selector: row => row.payment_mode ? row.payment_mode : "---",
          sortable: false,
          column_name: 'payment_mode',
          reorder: true,
          width:"180px"
      },
      {
          name: 'Total Order Amount ',
          selector: row => row.total_order_amount? <p className='align'><CurrencyRupeeIcon sx={{fontSize:"16px"}}/> {row?.total_order_amount}/-</p> : "---",
          sortable: false,
          column_name: 'total_order_amount',
          reorder: true,
          width:"240px"
      },
      {
          name: 'Full Address',
          selector: row =>  <p>{row?.name},{row?.locality},{row?.landmark},{row?.city},{row?.state},{row?.mobile},{row?.addressType}</p>,
          sortable: false,
          column_name: 'full_address',
          reorder: true,
        //   width:"300px"
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
      try {
        //   const result = await postApiCall(getrecentorder,{
          const result = await postApiCallToken(getrecentorder,{
            limit: limit,
            offset: offset,
            search: "",
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
      }
  }

  useEffect(() => {
      fetchBannerList();
  }, []);

    return (
      <>
      <Typography variant="h5" gutterBottom mt={1} sx={{ fontWeight: "500" }}>Recent Orders
      </Typography>
    
        <DataTable
            customStyles={customStyles}
            columns={columns}
            data={data}
            fixedHeader
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            fixedHeaderScrollHeight="58vh"
            sortServer
            responsive
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            onSort={handleSort}
        />
        </>
    );
};

export default Orders;
