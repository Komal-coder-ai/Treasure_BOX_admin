
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */

import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Typography, OutlinedInput, InputAdornment } from '@mui/material';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import Button from '@mui/material/Button';
import swal from 'sweetalert';
// eslint-disable-next-line import/no-unresolved
import { useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useLocation } from 'react-router-dom';

import Stack from '@mui/material/Stack';

// import closeimage from "../../Images/closeimage.png"
// import searchicon from "../../Images/searchicon.png"
// import Iconify from '../iconify/Iconify';
import "./index.css"
import { BaseUrl, ImageUrl } from '../../API/baseUrl';


const StyledRoot = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': {
        width: 320,
        boxShadow: theme.customShadows.z8,
    },
    '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
    },
}));

// ----------------------------------------------------------------------

export default function SectionHeader({
    numSelected,
    value,
    callBack,
    setSearchtext,
    Buttontext,
    onClick,
    headingText,
    isButton, isSearch , isUpload , fetchUsers
}) {


    const [movies, setMovies] = useState([]);
    const location = useLocation()
   



    const clearsearch = () => {
        setSearchtext('');
    };
    return (
        <StyledRoot
            className="searchandnewuserclass"
            sx={{
                ...(numSelected > 0 && {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter',
                }),
            }}
        >
            <>
                <Stack className="section_header">
                    <Stack className="section_header_left">
                        <Typography gutterBottom className="userheadtext">
                            {headingText}
                        </Typography>
                    </Stack>
                    <Stack className="section_header_right">
                        {/* <div className="searchandclose">
                            {
                                isSearch ?


                                    <StyledSearch
                                        className="searchdiv"
                                        value={value || ""}
                                        onChange={(e) => callBack(e.target.value.trim())}
                                        placeholder="Search ..."
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Stack onClick={clearsearch}>
                                                    <img src={(value.length || "") ? closeimage : searchicon} alt="" />
                                                </Stack>
                                            </InputAdornment>
                                        }
                                    />
                                    : ""
                            }
                        </div> */}
                      
                        {
                            Buttontext ? <Button
                                className="newuserbutton"
                                // variant="contained"
                                // startIcon={<Iconify icon="eva:plus-fill" />}
                                style={{backgroundColor:'rgb(243 204 208)' , color:"black" , fontWeight:'600'}}
                                onClick={onClick} 
                            >
                                {Buttontext}
                            </Button> : ""
                        }

                    </Stack>
                </Stack>
            </>
        </StyledRoot>
    );
}
