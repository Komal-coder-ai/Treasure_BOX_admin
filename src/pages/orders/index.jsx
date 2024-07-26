import { Box, Card, Container, Stack, } from '@mui/material'
import React, { useState } from 'react'
import { OrderHeading } from '../../Components/Heading';
import SearchToolbar from '../../Components/Search/Search';
import OrderTable from './ordertable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

import dayjs from 'dayjs';
import { ImageUrl, baseUrl, downloadexcel, postApiCall } from '../../API/baseUrl';

const Order = () => {

    const [searchText, setSearchtext] = useState("");
    const [startvalue, setStartvalue] = React.useState(dayjs('yyyy-mm-dd'));
    const [endvalue, setEndvalue] = React.useState(dayjs('yyyy-mm-dd'));


    const callBack = (data) => {
        setSearchtext(data);
    };


    const handleExcel = async () => {
        try {
            // Your API endpoint for generating Excel file
            const apiEndpoint = downloadexcel;

            // Sample parameters to be sent in the POST request
            const params = {
                limit: "",
                offset: "",
                search: "",
                column_name: "",
                sort_by: "",
                startDate: startvalue ? startvalue :"" ,
                endDate: endvalue ? endvalue :"" ,
            };

            // Make a POST request to the API endpoint
            const response = await baseUrl.post(apiEndpoint, params, {
                responseType: 'arraybuffer', // Set responseType to arraybuffer to receive binary data
            });

            // Convert the binary data to an Excel file
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            // Create a temporary link element
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);

            // Set the filename for the downloaded Excel file
            link.download = 'example.xlsx';

            // Trigger the click event to start the download
            link.click();

        } catch (error) {
            console.error('Error downloading Excel file:', error);
        }
    }


    return (
        <Box>
            <Container maxWidth="false" className="containerdivuser">
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                >
                    <SearchToolbar
                        showdatefilter="true"
                        headingName={OrderHeading}
                        callBack={callBack}
                        value={searchText}
                        margin="0px"
                        setSearchtext={setSearchtext}
                        {...{ startvalue, endvalue, setStartvalue, setEndvalue }}
                    />
                </Stack>
                <div className='excel-btn-container'>
                    <button className='view_btn_orderdetail' style={{ cursor: "pointer" }} onClick={handleExcel}>Download Excel</button>
                </div>

                <Card>
                    <OrderTable  {...{ searchText, startvalue, endvalue, setStartvalue, setEndvalue }} />
                </Card>
            </Container>
        </Box>
    )
}

export default Order;