import {useRoutes} from "react-router-dom";
import Login from "../pages/Login";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import MenuManagementPage from "../pages/MenuManagementPage";

const PrivateRoute = () =>{
    return useRoutes([
        {
            path: "/",
            element: <Login />,
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path:"/register",
            element: <RegisterPage/>
        },
        {
            path:"/home",
            element: <HomePage/>,
            children: [

            ]
        },
        
        {
            path:"/admin/menu",
            element:<MenuManagementPage/>,
        }


    ]);
}

export default PrivateRoute;