import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Button, Table, Modal, message, Checkbox, Switch } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import CustomHeader from '../components/Header';
import CustomSidebar from '../components/Sidebar';
import 'antd/dist/reset.css'; // 引入Ant Design的样式

const { Content, Footer } = Layout;

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isAssigningRoles, setIsAssigningRoles] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users');
                setUsers(response.data);
            } catch (error) {
                message.error('Failed to load users');
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await axios.get('/api/roles');
                setRoles(response.data);
            } catch (error) {
                message.error('Failed to load roles');
            }
        };

        fetchUsers();
        fetchRoles();
    }, []);

    const handleAddUser = () => {
        form.resetFields();
        setCurrentUser(null);
        setIsEditing(false);
        setIsAssigningRoles(false);
        setIsModalVisible(true);
    };

    const handleEditUser = (user) => {
        form.setFieldsValue(user);
        setCurrentUser(user);
        setIsEditing(true);
        setIsAssigningRoles(false);
        setIsModalVisible(true);
    };

    const handleDeleteUser = async (user) => {
        try {
            const response = await axios.delete(`/api/users/${user.id}`);
            setUsers(response.data);
            message.success('User deleted successfully');
        } catch (error) {
            message.error('Failed to delete user');
        }
    };

    const handleSaveUser = async () => {
        try {
            const values = await form.validateFields();
            const newUser = { ...values, id: currentUser?.id, role: currentUser ? currentUser.role: [] };
            if (isEditing) {
                const response = await axios.put('/api/users', newUser);
                setUsers(response.data);
                message.success('User updated successfully');
            } else {
                const response = await axios.post('/api/users', newUser);
                setUsers(response.data);
                message.success('User added successfully');
            }
            setIsModalVisible(false);
        } catch (error) {
            message.error('Failed to save user');
        }
    };

    const handleAssignRoles = (user) => {
        setCurrentUser(user);
        form.setFieldsValue({ roles: user.role });
        setIsAssigningRoles(true);
        setIsModalVisible(true);
    };

    const handleSaveAssignedRoles = async () => {
        try {
            const values = await form.validateFields();
            const updatedUser = { ...currentUser, role: values.roles };
            const response = await axios.put('/api/users', updatedUser);
            setUsers(response.data);
            message.success('User roles updated successfully');
            setIsModalVisible(false);
        } catch (error) {
            message.error('Failed to save user roles');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Enable',
            dataIndex: 'enable',
            key: 'enable',
            render: (enable) => (enable ? 'True' : 'False'),
        },
        {
            title: 'Roles',
            dataIndex: 'role',
            key: 'role',
            render: (role) => role.join(', '),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button icon={<EditOutlined />} onClick={() => handleEditUser(record)}>Edit</Button>
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteUser(record)}>Delete</Button>
                    <Button icon={<SettingOutlined />} onClick={() => handleAssignRoles(record)}>Assign Roles</Button>
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
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
                            Add User
                        </Button>
                        <Table
                            columns={columns}
                            dataSource={users}
                            rowKey="id"
                        />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
            </Layout>
            <Modal
                title={isAssigningRoles ? 'Assign Roles' : (isEditing ? 'Edit User' : 'Add User')}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={isAssigningRoles ? handleSaveAssignedRoles : handleSaveUser}
            >
                {isAssigningRoles ? (
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="roles"
                            label="Roles"
                            rules={[{ required: true, message: 'Please select roles!' }]}
                        >
                            <Checkbox.Group>
                                {roles.map(role => (
                                    <Checkbox key={role.id} value={role.id}>
                                        {role.name}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </Form.Item>
                    </Form>
                ) : (
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[{ required: true, message: 'Please input the username!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Please input the email!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, message: 'Please input the password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="enable"
                            label="Enable"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </Layout>
    );
};

export default UserManagementPage;
