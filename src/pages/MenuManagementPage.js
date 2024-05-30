import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Button, Table, Modal, message, Switch } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import CustomHeader from '../components/Header';
import CustomSidebar from '../components/Sidebar';
import 'antd/dist/reset.css'; // 引入Ant Design的样式

const { Content, Footer } = Layout;

const MenuManagementPage = () => {
    const [menus, setMenus] = useState([]);
    const [currentMenu, setCurrentMenu] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [isSub, setIsSub] = useState(false)
    const[parentId, setParentId] = useState(0);
    useEffect(() => {
        // 请求菜单数据
        const fetchMenus = async () => {
            try {
                const response = await axios.get('/api/menus');
                setMenus(response.data);
            } catch (error) {
                message.error('Failed to load menus');
            }
        };
        fetchMenus();
    }, []);

    const handleAddMenu = () => {
        form.resetFields();
        setCurrentMenu(null);
        setIsEditing(false);
        setIsSub(false);
        setIsModalVisible(true);
    };

    const handleEditMenu = (menu) => {
        form.setFieldsValue(menu);
        setCurrentMenu(menu);
        setIsEditing(true);
        setIsSub(false);
        setIsModalVisible(true);
    };

    const handleDeleteMenu = async (menu) => {
        try {
            const response = await axios.delete(`/api/menus/${menu.id}`);
            setMenus(response.data);
            message.success('Menu deleted successfully');
            // window.location.reload();
        } catch (error) {
            message.error('Failed to delete menu');
        }
    };

    const handleDeleteSubMenu = async (subMenuId, parentKey) => {
        try {
            const response = await axios.delete('/api/submenus', {
                data: { id: subMenuId, parentKey: parentKey }
            });
            setMenus(response.data);
            message.success('Submenu deleted successfully');
        } catch (error) {
            message.error('Failed to delete submenu');
        }
        window.location.reload();
    };

    const handleSaveMenu = async () => {
        try {
            const values = await form.validateFields();
            if (isEditing) {
                if(!isSub){
                    const newMenu = {id:currentMenu.id, ...values}
                    const response = await axios.put(`/api/menus`, newMenu);
                    setMenus(response.data);
                    message.success('Menu updated successfully');
                }else {
                    const newMenu = {id:currentMenu.id, parent: parentId , ...values}
                    const response = await axios.put(`/api/menus`, newMenu);
                    setMenus(response.data);
                    message.success('Menu updated successfully');
                }
            } else {
                if(isSub){
                    const newSubmenu = {parent: currentMenu.id, ...values}
                    const response = await axios.post('/api/menus', newSubmenu);
                    setMenus(response.data);
                    message.success('SubMenu added successfully');
                }else{
                    const response = await axios.post('/api/menus', values);
                    setMenus(response.data);
                    message.success('Menu added successfully');
                }
            }
            setIsModalVisible(false);
            window.location.reload();
        } catch (error) {
            message.error('Failed to save menu');
        }
    };

    const handleAddSubMenu = (menuId) => {
        form.resetFields();
        setCurrentMenu({ id: menuId });
        setIsEditing(false);
        setIsSub(true);
        setIsModalVisible(true);
    };

    const handleEditSubMenu=(menuId,pId) =>{
        form.resetFields();
        setCurrentMenu({ id: menuId });
        setParentId(pId)
        setIsEditing(true);
        setIsSub(true);
        setIsModalVisible(true);
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Path',
            dataIndex: 'key',
            key: 'path',
        },
        {
            title: 'Enable',
            dataIndex: 'enable',
            key: 'enable',
            render: (text, record) => (record.enable ? 'True' : 'False'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button icon={<EditOutlined />} onClick={() => handleEditMenu(record)}>Edit</Button>
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteMenu(record)}>Delete</Button>
                    {!record.parentKey && (
                        <Button icon={<PlusOutlined />} onClick={() => handleAddSubMenu(record.id)}>Add Submenu</Button>
                    )}
                </>
            ),
        },
    ];

    const expandedRowRender = (record) => {
        const subColumns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Path',
                dataIndex: 'key',
                key: 'path',
            },
            {
                title: 'Enable',
                dataIndex: 'enable',
                key: 'enable',
                render: (text, subRecord) => (subRecord.enable ? 'True' : 'False'),
            },
            {
                title: 'Actions',
                key: 'actions',
                render: (text, subRecord) => (
                    <>
                        <Button icon={<EditOutlined />} onClick={() => handleEditSubMenu(subRecord.id, record.id)}>Edit</Button>
                        <Button icon={<DeleteOutlined />} onClick={() => handleDeleteSubMenu(subRecord.id, record.key)}>Delete</Button>
                    </>
                ),
            },
        ];

        return (
            <Table
                columns={subColumns}
                dataSource={record.subMenus}
                pagination={false}
                rowKey="id"
            />
        );
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <CustomSidebar />
            <Layout className="site-layout">
                <CustomHeader />
                <Content style={{ margin: '0 16px' }}>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMenu}>
                            Add Menu
                        </Button>
                        <Table
                            columns={columns}
                            dataSource={menus}
                            rowKey="id"
                            expandable={{ expandedRowRender }}
                        />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
            </Layout>
            <Modal
                title={isEditing ? 'Edit Menu' : 'Add Menu'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleSaveMenu}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="key"
                        label="Path"
                        rules={[{ required: true, message: 'Please input the path!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="enable"
                        label="Enable"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default MenuManagementPage;
