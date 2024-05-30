import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import { useLocation } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const breadcrumbNameMap = {
    '/home': 'Home',
    '/home/option1': 'Option 1',
    '/home/option2': 'Option 2',
    '/home/user': 'User',
    '/home/user/tom': 'Tom',
    '/home/user/bill': 'Bill',
    '/home/user/alex': 'Alex',
    '/home/team': 'Team',
    '/home/team/team1': 'Team 1',
    '/home/team/team2': 'Team 2',
    '/home/files': 'Files'
};

const CustomHeader = () => {
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return (
            <Breadcrumb.Item key={url}>
                {breadcrumbNameMap[url]}
            </Breadcrumb.Item>
        );
    });

    const breadcrumbItems = [
        <Breadcrumb.Item key="home">
            Home
        </Breadcrumb.Item>
    ].concat(extraBreadcrumbItems);

    return (
        <AntHeader className="site-layout-background" style={{ padding: 0, background: '#fff' }}>
            <Breadcrumb style={{ margin: '16px' }}>
                {breadcrumbItems}
            </Breadcrumb>
        </AntHeader>
    );
};

export default CustomHeader;
