import React, { useState } from 'react';
import { Layout } from 'antd';
import CustomHeader from "../components/Header";
import CustomSidebar from '../components/Sidebar';
import 'antd/dist/reset.css'; // 引入Ant Design的样式

const { Content, Footer } = Layout;

const HomePage = () => {
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
                        react-admin.
                    </h3>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
            </Layout>
        </Layout>
    );
};

export default HomePage;
