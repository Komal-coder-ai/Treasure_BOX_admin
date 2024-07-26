import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import LoginLayout from './Layouts/LoginLayout';
import Signin from './pages/Signin';
import DashboardLayout from './Layouts/DashboardLayout';
import Home from './pages/Home/home';
import ProductList from './pages/Products/productList';
import AddProduct from './pages/Products/AddProduct';
import { ToastContainer } from 'react-toastify';
import Category from './pages/Category';
import Banner from './pages/Banner';
import AddBanner from './pages/Banner/AddBanner';
import CategoryList from './pages/Category/CategoryList';
import SpecialProducts from './pages/SpecialProducts';
import SpecialProductList from './pages/SpecialProducts/specialproductList';
import UserManagement from './pages/User/UserManagement';
import Terms from './pages/term';
import About from './pages/aboutUs';
import Privacy from './pages/privacy';
import Order from './pages/orders';
import OrderDetails from './pages/orders/orderDetails';
import DeliveryCharges from './pages/deliveryCharges';
import TitleModule from './pages/titleModule';
import TitleTable from './pages/titleModule/titleTable';
import Query from './pages/query';
import TitleEdit from './pages/titleModule/titleedit';
import ViewProduct from './pages/Products/viewproduct';
import Discount from './pages/discount';
import DiscountTableComponent from './pages/discount/table';
import Userdetails from './pages/User/userdetails';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginLayout />,
    children: [
      { element: <Navigate to="/signin" />, index: true },
      { path: "signin", element: <Signin /> },
    ]
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { element: <Navigate to="dashboard/" />, index: true },
      { path: "app", element: <Home /> },
      { path: "products", element: <ProductList /> },
      { path: "products-add", element: <AddProduct /> },
      { path: "products_add/:id", element: <AddProduct /> },
      { path: "products_view/:id", element: <ViewProduct/> },
      { path: "banner-add/:id", element: <AddBanner /> },
      { path: "category", element: <CategoryList /> },
      { path: "banner", element: <Banner /> },
      { path: "category-add", element: <Category /> },
      { path: "category-add/:id", element: <Category /> },
      { path: "banner-add", element: <AddBanner /> },
      { path: "Special", element: <SpecialProductList /> },
      { path: "Special_add", element: <SpecialProducts /> },
      { path: "Special_add/:id", element: <SpecialProducts /> },
      { path: "userdetails/:id", element: <Userdetails /> },
      { path: "User", element: <UserManagement /> },
      { path: "query", element: <Query /> },
      { path: "deliveryCharges", element: <DeliveryCharges /> },
      { path: "addDiscount", element: <Discount/> },
      { path: "addDiscount/:id", element: <Discount/> },
      { path: "discount", element: <DiscountTableComponent/> },
      { path: "titlemodule", element: <TitleModule /> },
      { path: "titlemodule/:id", element: <TitleEdit /> },
      { path: "view/:id", element: <ViewProduct /> },
      { path: "titletable", element: <TitleTable /> },
      { path: "term", element: <Terms /> },
      { path: "about", element: <About /> },
      { path: "privacy", element: <Privacy /> },
      { path: "order", element: <Order/> },
      { path: "orderdetails/:id", element: <OrderDetails />},
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <App/>
    </RouterProvider>
    <ToastContainer />
  </React.StrictMode>
);

reportWebVitals();
