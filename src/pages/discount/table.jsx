import { Box, Card, Container, Stack, } from '@mui/material'
import React, { useState } from 'react'
import { DiscountHeading } from '../../Components/Heading';
import SearchToolbar from '../../Components/Search/Search';
import { useNavigate } from 'react-router-dom';
import DiscountTable from './discountTable';

const DiscountTableComponent = () => {
    const navigate = useNavigate();

    const [searchText, setSearchtext] = useState("");


    const callBack = (data) => {
        setSearchtext(data);
    };



    const handleOpen = () => {
        navigate("/dashboard/addDiscount")
    };

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
                        margin="0px"
                        headingName={DiscountHeading}
                        btnname={"Add Discount"}
                        handleOpen={handleOpen}
                    />
                </Stack>

                <Card>
                    <DiscountTable  {...{searchText}} />
                </Card>
            </Container>
        </Box>
    )
}

export default DiscountTableComponent;