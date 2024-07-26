import { Box, Container, Stack } from '@mui/material'
import React from 'react'
import SearchToolbar from '../../../Components/Search/Search'
import { Card } from 'antd'
import Table from './Table'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { SpecialProductsHeading } from '../../../Components/Heading'

const SpecialProductList = () => {
    const navigate = useNavigate();
    const [searchText, setSearchtext] = useState("");
  
    const handleOpen = () => {
      navigate("/dashboard/Special_add")
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
              headingName={SpecialProductsHeading}
              btnname={"Add Title"}
              handleOpen={handleOpen}
            />
      </Stack>
      <Card className='Table_container' >
      <Table {...{searchText}}/>
      </Card>
    </Container>
    </Box>
  )
}

export default SpecialProductList;