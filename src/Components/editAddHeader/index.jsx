
/* eslint-disable react/prop-types */
import { LoadingButton } from '@mui/lab'
import { Grid, Stack } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../../utils/BackButton/Index'
import './index.css'

const EditAddHeader = ({ checkView, headText, showBtn, className, noDisplayBack }) => {
    const navigate = useNavigate()
    const handleBackButton = () => {
        navigate(-1)
    }

    return (
        <Stack className='edit_detail_btn'>


            <Grid className={`backAddEditFaq ${className}`}>
                {
                    !noDisplayBack ?
                        <BackButton handleBackButton={handleBackButton} />
                        : ""
                }
                <h1>{headText}</h1>
            </Grid>

            {showBtn ?
                <LoadingButton type="submit" variant="contained" onClick={checkView}>
                    Edit Details
                </LoadingButton> : ""}
        </Stack>
    )
}

export default EditAddHeader