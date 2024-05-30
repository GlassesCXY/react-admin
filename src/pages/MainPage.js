import React from "react";
import { Breadcrumb, Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import CustomSidebar from "../components/Sidebar";
import CustomHeader from "../components/Header";
const { Content, Footer, Sider } = Layout;

const MainPage = () => {
    return (
        <Layout>
            <CustomSidebar/>
            <Layout>
                <CustomHeader/>
                <Content>
                    <Outlet/>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainPage;
