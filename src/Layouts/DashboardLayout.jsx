import React, { useEffect } from "react";
import {
  Box, Collapse, CssBaseline, styled, Toolbar, List, Divider,
  IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import KeyboardBackspaceSharpIcon from "@mui/icons-material/KeyboardBackspaceSharp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { mandotarySetup} from "../utils/data";
import swal from "sweetalert";
import logo from "../assets/logo.png"
import "./index.css"
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PWAInstallerPrompt from 'react-pwa-installer-prompt';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(10)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));


export default function DashboardLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = React.useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      <Outlet />;
    } else {
      navigate("/");
    }
  }, []);




  const handleSubmenu = (text, id, arr, index, obj) => {
  
       if (text === "Logout") {
        swal({
          title: "Are you sure you want to logout?",
          text: "Once logged out, you will need to login!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          
          if (willDelete) {
            localStorage.removeItem("auth");
            navigate("/");
          }
        });
      }
      else {
        navigate(`${obj.path}`);
      }
    
    arr[index].open = !arr[index].open
  };

  const handleSubmenuNavigate = (text, path) => {
    navigate(path)
  };
  
  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleImageClick = () => {
    navigate("/dashboard/app")
  }

  
  const setActive = (path) => {
    const searchedpath = window.location.pathname.search(path)
    return searchedpath
}

  return (
    <Box sx={{ display: "flex" , overflow:"auto"}}>
      <CssBaseline />
      <div>
        <AppBar
          elevation={1}
          position="fixed"

          open={open}
          sx={{ backgroundColor: "#fff", }}
          className="appbar_container"
        >
          <Toolbar className={open ? "forwa" : "backwa"}>
            <IconButton
              className="focus_button"
              color="black"
              edge="start"
              sx={{
                ...(open && { display: "none" }),
              }}
            >
              {/* ---------heading------ */}
            </IconButton>
            <IconButton

              onClick={handleDrawerOpen}
              className={`drawerArrow focus_button ${open ? "open_drawer" : "close_drawer"}`}
            >
              {open ? <KeyboardBackspaceSharpIcon /> : <ArrowForwardIcon />}
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />
            <Box >
              
            </Box>
            
          </Toolbar>
        </AppBar>
      </div>
      <Drawer variant="permanent" open={open} className="drawer_sidebar">
        <DrawerHeader position="relative" className="drawer_header"sx={{p:2}} >
          <img src={logo} alt="logo" className="drawer_header_logo" onClick={handleImageClick}/>
        </DrawerHeader>
        <Divider />
        <List className="sidebar_ul">
          {mandotarySetup.map((text, index) => (
            <React.Fragment key={index}>
              <ListItem
                key={text.id}
                sx={{ display: "block" }}
                className={setActive(text.path) === 0 ? "active_class sidebar_list" : "sidebar_list"}
                
              >
                <ListItemButton
                  sx={{
                    minHeight: 40, fontWeight: 900, minWidth: 77,
                    justifyContent: open ? "initial" : "center", py: "3px",
                  }}
                  onClick={() => handleSubmenu(text.name, text.id, mandotarySetup, index, text)}
                >
                  <ListItemIcon
                    sx={{ minWidth: 0, mr: open ? 1 : "auto", justifyContent: "center" }}
                    
                  >
                    {text.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={text?.name}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                  {text.data.length ? (text.open ? text.icon2 : text.icon1) : ""}
                </ListItemButton>
              </ListItem>
              {text.data.map((item, ind) => {
                return (
                  <Collapse
                    in={text.open}
                    timeout="auto"
                    unmountOnExit
                    key={ind}
                    className="collpase_nav_bar"
                  >
                    <List
                      component="div"
                      disablePadding
                      className={
                        pathname === item.subpath ? "active_class_sub sidebar_list" : "sidebar_list"
                      }
                    >
                      <ListItemButton
                        sx={{ pl: 3 }}
                        className="collapse_nav_icon"
                        onClick={() => handleSubmenuNavigate(item?.subMenu, item.subpath)}
                      >
                        <ListItemIcon>{item.subIcon}</ListItemIcon>
                        <ListItemText
                          className={pathname === text.subpath ? "active_class sidebar_list" : "sidebar_list"}
                          primary={item?.subMenu}
                        />
                      </ListItemButton>
                    </List>
                  </Collapse>
                );
              })}
            </React.Fragment>
          ))}
        </List>
        <Divider />
        <List>
        {open ? 
        <PWAInstallerPrompt
        render={({ onClick }) => (
          <div className='prompt_container'>
              <button className='prompt_btn' type="dashed" onClick={onClick}>
              <FileDownloadIcon/>Install
              </button>
         </div>
        )}
      /> : 
        
      <PWAInstallerPrompt
        render={({ onClick }) => (
          <div className='prompt_container'>
              <button className='prompt_btn' type="dashed" onClick={onClick}>
              <FileDownloadIcon/>
              </button>
         </div>
        )}
      />
    }
         
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, height: "100%", background: "#ffffff" , overflow:"auto" }} >
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
