import { Box, Card, Container, Stack, } from '@mui/material'
import React, { useState } from 'react'
import { BannerHeading } from '../../Components/Heading';
import SearchToolbar from '../../Components/Search/Search';
import { useNavigate } from 'react-router-dom';
import BannerTable from './BannerTable';

const Banner = () => {
    const navigate = useNavigate();

    const [searchText, setSearchtext] = useState("");


    const callBack = (data) => {
        setSearchtext(data);
    };



    const handleOpen = () => {
        navigate("/dashboard/banner-add")
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
                        headingName={BannerHeading}
                        btnname={"Add Banner"}
                        handleOpen={handleOpen}
                    />
                </Stack>

                <Card>
                    <BannerTable  {...{searchText}} />
                </Card>
            </Container>
        </Box>
    )
}

export default Banner;