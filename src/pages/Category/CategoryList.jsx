import { Box, Card, Container, Stack } from '@mui/material'
import React from 'react'
import SearchToolbar from '../../Components/Search/Search'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CategoryHeading } from '../../Components/Heading';
import CategoryTable from './CategoryTable';

const CategoryList = () => {

    const navigate = useNavigate();
    const [searchText, setSearchtext] = useState("");

    const handleOpen = () => {
        navigate("/dashboard/category-add")
    };

    

    const callBack = (data) => {
        setSearchtext(data);
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
                        callBack={callBack}
                        value={searchText}
                        margin="0px"
                        setSearchtext={setSearchtext}
                        headingName={CategoryHeading}
                        btnname={"Add Category"}
                        handleOpen={handleOpen}
                    />
                </Stack>

                <Card>
                    <CategoryTable {...{searchText}} />
                </Card>
            </Container>
        </Box>
    )
}

export default CategoryList;