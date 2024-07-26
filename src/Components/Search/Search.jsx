import React from 'react';
import { Button, Grid, } from '@mui/material';
import "./search.css"
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

export default function SearchToolbar({showdatefilter,startvalue ,endvalue , setStartvalue ,setEndvalue, icon, value, callBack, setSearchtext, margin, headingName, btnname, handleOpen, }) {


  const clearsearch = () => {
    setSearchtext('')
  }

  return (
    <Grid container spacing={2} mt={1} alignItems={"center"} >
      <Grid item xs={12} md={4}>
        {headingName}
      </Grid>

      <Grid item xs={12} md={8} className="search_addbtn" sx={{ display: "flex", justifyContent: "flex-end" }}>

        {setSearchtext ?
          <div className='search_container_date'>
            {showdatefilter ? <div className='datefilter_container'>
              <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ display: "flex" }}>
                <DatePicker
                  className='datepicker_field'
                  size="small"
                  label="From"
                  value={startvalue}
                  format="YYYY-MM-DD"
                  onChange={(newValue) => setStartvalue(dayjs(newValue).format("YYYY-MM-DD"))}
                />
                <DatePicker
                  className='datepicker_field'
                  size="small"
                  label="To"
                  value={endvalue}
                  format="YYYY-MM-DD"
                  onChange={(newValue) =>setEndvalue(dayjs(newValue).format("YYYY-MM-DD"))}
                />
              </LocalizationProvider>
            </div> :""}
            
            <form class="form">
              <button>
                <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
                  <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" stroke-width="1.333" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </button>
              <input class="input" placeholder="Search..."
                required="" type="text" onChange={(e) => callBack(e.target.value)}
                value={value}
              />
              <button class="reset" type="reset" onClick={clearsearch}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </form>
          </div>
          : ""}
        {btnname ? <Button className='addbtn' onClick={handleOpen} ><b>{btnname}{icon}</b></Button> : ""}
      </Grid>
    </Grid>


  );
}

