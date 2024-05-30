import React, {useState} from "react";
import { useLocation } from 'react-router-dom';
import {Layout} from "antd";
import CustomSidebar from "../components/Sidebar";
import CustomHeader from "../components/Header";
import {Content, Footer} from "antd/es/layout/layout";
const CustomPage = () => {
    const [collapsed, setCollapsed] = useState(false);

    const onCollapse = (collapsed) => {
        setCollapsed(collapsed);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <CustomSidebar collapsed={collapsed} onCollapse={onCollapse} />
            <Layout className="site-layout">
                <CustomHeader />
                <Content style={{ margin: '0 16px' }}>
                    <h3 className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                        {useLocation().pathname}
                    </h3>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
            </Layout>
        </Layout>
    );
};

export default CustomPage;
