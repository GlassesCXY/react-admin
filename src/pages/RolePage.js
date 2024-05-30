import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Button, Table, Modal, message, Switch, Tree } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import CustomHeader from '../components/Header';
import CustomSidebar from '../components/Sidebar';
import 'antd/dist/reset.css'; // 引入Ant Design的样式

const { Content, Footer } = Layout;
const { TreeNode } = Tree;

const RoleManagementPage = () => {
    const [roles, setRoles] = useState([]);
    const [menus, setMenus] = useState([]);
    const [currentRole, setCurrentRole] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [checkedKeys, setCheckedKeys] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('/api/roles');
                setRoles(response.data);
            } catch (error) {
                message.error('Failed to load roles');
            }
        };

        const fetchMenus = async () => {
            try {
                const response = await axios.get('/api/menus');
                setMenus(response.data);
            } catch (error) {
                message.error('Failed to load menus');
            }
        };

        fetchRoles();
        fetchMenus();
    }, []);

    const handleAddRole = () => {
        form.resetFields();
        setCurrentRole(null);
        setIsEditing(false);
        setIsModalVisible(true);
    };

    const handleEditRole = (role) => {
        form.setFieldsValue(role);
        setCurrentRole(role);
        setCheckedKeys(role.menus ? convertMenusToCheckedKeys(role.menus) : []);
        setIsEditing(true);
        setIsModalVisible(true);
    };

    const handleDeleteRole = async (role) => {
        try {
            const response = await axios.delete(`/api/roles/${role.id}`);
            setRoles(response.data);
            message.success('Role deleted successfully');
        } catch (error) {
            message.error('Failed to delete role');
        }
    };

    const handleSaveRole = async () => {
        try {
            const values = await form.validateFields();
            const meunTachi = convertCheckedKeysToMenus(checkedKeys.checked);
            // console.log(meunTachi);
            const newRole = { ...values, id: currentRole?.id, menus: meunTachi };
            if (isEditing) {
                const response = await axios.put(`/api/roles`, newRole);
                setRoles(response.data);
                message.success('Role updated successfully');
                window.location.reload();
            } else {
                const response = await axios.post('/api/roles', newRole);
                setRoles(response.data);
                message.success('Role added successfully');
            }
            setIsModalVisible(false);
        } catch (error) {
            message.error('Failed to save role');
        }
    };

    const convertCheckedKeysToMenus = (keys) => {
        console.log(keys.checked);
        const menuMap = new Map();
        keys.forEach(key => {
            const [id, subId] = key.split('-');
            if (subId) {
                if (!menuMap.has(Number(id))) {
                    menuMap.set(Number(id), { id: Number(id), sub: [] });
                }
                if(!menuMap.get(Number(id)).sub){
                    menuMap.set(Number(id), { id: Number(id), sub: [] });
                }
                menuMap.get(Number(id)).sub.push(Number(subId));
            } else {
                if (!menuMap.has(Number(id))) {
                    menuMap.set(Number(id), { id: Number(id) });
                }
            }
        });
        return Array.from(menuMap.values());
    };

    const convertMenusToCheckedKeys = (menus) => {
        const keys = [];
        menus.forEach(menu => {
            keys.push(menu.id.toString());
            if (menu.sub) {
                menu.sub.forEach(subId => keys.push(`${menu.id}-${subId}`));
            }
        });
        return keys;
    };


    const onCheck = (checkedKeysValue) => {
        setCheckedKeys(checkedKeysValue);
    };

    const renderTreeNodes = (data) =>
        data.map((item) => {
            if (item.subMenus) {
                return (
                    <TreeNode title={item.name} key={item.id.toString()}>
                        {item.subMenus.map(subItem => (
                            <TreeNode title={subItem.name} key={`${item.id}-${subItem.id}`} />
                        ))}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.id.toString()} title={item.name} />;
        });

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
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
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
                    <Button icon={<EditOutlined />} onClick={() => handleEditRole(record)}>Edit</Button>
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteRole(record)}>Delete</Button>
                </>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <CustomSidebar />
            <Layout className="site-layout">
                <CustomHeader />
                <Content style={{ margin: '0 16px' }}>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRole}>
                            Add Role
                        </Button>
                        <Table
                            columns={columns}
                            dataSource={roles}
                            rowKey="id"
                        />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
            </Layout>
            <Modal
                title={isEditing ? 'Edit Role' : 'Add Role'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleSaveRole}
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
                        name="description"
                        label="Description"
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
                    <Form.Item
                        label="Menus"
                    >
                        <Tree
                            checkable
                            checkStrictly
                            onCheck={onCheck}
                            checkedKeys={checkedKeys}
                        >
                            {renderTreeNodes(menus)}
                        </Tree>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default RoleManagementPage;
