import React, { useEffect } from 'react'
import Box from '@mui/material/Box';
import { CssBaseline, Grid, Paper } from '@mui/material';
import { Outlet, useNavigate } from "react-router-dom";

const LoginLayout = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth === "true") {
      navigate("/dashboard/app");
    } else if (auth === "false") {
      navigate("/");
    }
  }, []);


  return (
      <Box sx={{minHeight:"100vh"}}
      >
        <Grid container  sx={{minHeight:"100vh"}}>
          <CssBaseline />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
            sx={{display:'flex', alignItems:'center',justifyContent:'center'}}
          >
           <Outlet />
          </Grid>
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: "url(https://assets.entrepreneur.com/content/3x2/2000/essential-elements-building-ecommerce-website.jpg)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </Grid>
      </Box>
  )
}

export default LoginLayout;