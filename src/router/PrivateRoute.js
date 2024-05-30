import {useRoutes} from "react-router-dom";
import Login from "../pages/Login";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import MenuManagementPage from "../pages/MenuManagementPage";
import {filterUnlockedMenus} from "../utils/menuUtil";
import CustomPage from "../pages/CustomPage";
import RoleManagementPage from "../pages/RolePage";

let menus = JSON.parse(localStorage.getItem("menus"));
menus = filterUnlockedMenus(menus);
const generateRoutes = (menuList) => {
    const routes = [];

    const traverseMenus = (menus) => {
        menus.forEach(menu => {
            routes.push({
                path: menu.key,
                Component: CustomPage,
            });

            if (menu.subMenus && menu.subMenus.length > 0) {
                traverseMenus(menu.subMenus);
            }
        });
    };

    traverseMenus(menuList);
    return routes;
};
const custPage = generateRoutes(menus);

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
        },
        {
            path:"/admin/role",
            element:<RoleManagementPage/>
        },
        ...custPage,


    ]);
}

export default PrivateRoute;