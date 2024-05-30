import React from 'react';
import {Form, Input, Button, Typography, message} from 'antd';
import 'antd/dist/reset.css';
import axios from "axios";
import {useNavigate} from "react-router-dom"; // 引入Ant Design的样式
// import crypto from 'crypto'; // 用于加密密码

const { Title } = Typography;

const RegisterPage = () => {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        // 加密密码
        // const encryptedPassword = crypto.createHash('sha256').update(values.password).digest('hex');
        // console.log('Received values of form: ', { ...values, password: encryptedPassword });
        try {
            const payload = {...values, role:[2]}
            const response = await axios.post('/api/register', payload);
            message.success(response.data.message);
            navigate('/login')
        } catch (error) {
            message.error("error");
        }
    };

    const validatePassword = (_, value) => {
        if (!value) {
            return Promise.reject('Please input your password!');
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(value)) {
            return Promise.reject('Password must be 8-16 characters and include uppercase, lowercase letters, and numbers.');
        }
        return Promise.resolve();
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <Title level={2} style={styles.title}>Register</Title>
                <Form
                    name="register"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    style={styles.form}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input placeholder="Username" style={styles.input} />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your Email!' },
                            { type: 'email', message: 'The input is not valid Email!' }
                        ]}
                    >
                        <Input placeholder="Email" style={styles.input} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your Password!' },
                            { validator: validatePassword }
                        ]}
                    >
                        <Input.Password placeholder="Password" style={styles.input} />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your Password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('The two passwords that you entered do not match!');
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm Password" style={styles.input} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={styles.button}>
                            Register
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <Button type="default" href="/login" style={styles.button}>
                            Back to Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#dde5f1',
    },
    formContainer: {
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
    },
    title: {
        textAlign: 'center',
        marginBottom: '24px',
    },
    form: {
        width: '100%',
    },
    input: {
        height: '40px',
        borderRadius: '4px',
    },
    button: {
        width: '100%',
        height: '40px',
        borderRadius: '4px',
        marginTop: '10px',
    },
};

export default RegisterPage;
