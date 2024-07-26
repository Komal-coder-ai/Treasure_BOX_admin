import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import CategoryIcon from "@mui/icons-material/Category";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import PhotoSizeSelectActualRoundedIcon from "@mui/icons-material/PhotoSizeSelectActualRounded";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import PersonIcon from "@mui/icons-material/Person";
import GavelIcon from "@mui/icons-material/Gavel";
import InfoIcon from "@mui/icons-material/Info";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import RedeemIcon from "@mui/icons-material/Redeem";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import TitleIcon from "@mui/icons-material/Title";
import HelpIcon from "@mui/icons-material/Help";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export const mandotarySetup = [
  {
    id: 1,
    name: "Dashboard",
    path: "/dashboard/app",
    icon: <SpaceDashboardIcon sx={{ color: "#000" }} />,
    data: [],
    icon1: "",
    icon2: "",
  },
  {
    id: 2,
    name: "Category",
    path: "/dashboard/category",
    icon: <CategoryIcon sx={{ color: "#000" }} />,
    data: [],
    icon1: "",
    icon2: "",
  },
  {
    id: 3,
    name: "Products",
    path: "/dashboard/products",
    icon: <ProductionQuantityLimitsIcon sx={{ color: "#000" }} />,
    data: [],
    icon1: <ChevronRightIcon />,
    icon2: <KeyboardArrowDownIcon />,
  },

  {
    id: 4,
    name: "Banner",
    path: "/dashboard/banner",
    icon: <PhotoSizeSelectActualRoundedIcon sx={{ color: "#000" }} />,
    data: [],
    icon1: "",
    icon2: "",
  },
  {
    id: 5,
    name: "Special Products",
    path: "/dashboard/Special",
    icon: <AcUnitOutlinedIcon sx={{ color: "#000" }} />,
    data: [],
    icon1: "",
    icon2: "",
  },
  {
    id: 6,
    name: "User Management",
    path: "/dashboard/User",
    icon: <PersonIcon sx={{ color: "#000" }} />,
    data: [],
    icon1: "",
    icon2: "",
  },
  {
    id: 7,
    name: "Delivery Charges",
    path: "/dashboard/deliveryCharges",
    icon: <LocalShippingIcon sx={{ color: "#000" }} />,

    data: [],
    icon1: "",
    icon2: "",
  },
  {
    id: 77,
    name: "Discount",
    path: "/dashboard/discount",
    icon: <LocalOfferIcon sx={{ color: "#000" }} />,

    data: [],
    icon1: "",
    icon2: "",
  },
  {
    id: 8,
    name: "Title",
    path: "/dashboard/titletable",
    icon: <TitleIcon sx={{ color: "#000" }} />,

    data: [],
    icon1: "",
    icon2: "",
  },
  {
    id: 9,
    name: "About Us",
    path: "/dashboard/about",
    icon: <InfoIcon sx={{ color: "#000" }} />,
    data: [],
    icon1: "",
    icon2: "",
  },
  {
    id: 10,
    name: "Terms and Conditions",
    path: "/dashboard/term",
    icon: <GavelIcon sx={{ color: "#000" }} />,
    data: [],
    icon1: "",
    icon2: "",
  },
  {
    id: 11,
    name: "Privacy Policy",
    path: "/dashboard/privacy",
    icon: <EnhancedEncryptionIcon sx={{ color: "#000" }} />,
    data: [],
    icon1: "",
    icon2: "",
  },
  {
    id: 12,
    name: "Orders",
    path: "/dashboard/order",
    icon: <RedeemIcon sx={{ color: "#000" }} />,
    data: [],
    icon1: "",
    icon2: "",
  },
  {
      id: 13,
      name: "User Query",
      path: "/dashboard/query",
      icon: <HelpIcon sx={{color:"#000"}}/>,
      data: [],
      icon1: "",
      icon2: "",
  },
  {
    id: 14,
    name: "Logout",
    path: "",
    icon: <ExitToAppIcon sx={{ color: "red" }} />,
    data: [],
    icon1: "",
    icon2: "",
  },
];
