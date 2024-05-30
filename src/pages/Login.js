import React from "react";
import {Form, Input, Button, Checkbox, Typography, message} from "antd";
import  "antd/dist/reset.css";
import axios from "axios";
import {useNavigate} from "react-router-dom";
const { Title } = Typography;

export default function Login() {
    const navigate = useNavigate();
    const onFinish = async (values) => {

        try {
            const response = await axios.post('/api/login', values);
            message.success(response.data.message);
            navigate('/home'); // 登录成功后跳转到 /home
        } catch (error) {
            message.error(error.response.data.message);
        }

    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <Title level={2} style={styles.title}>react-admin</Title>
                <Form
                    name="login"
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
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password placeholder="Password" style={styles.input} />
                    </Form.Item>

                    <Form.Item style={styles.checkboxContainer}>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox style={styles.checkbox}>Remember me</Checkbox>
                        </Form.Item>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={styles.button}>
                            Login
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="default" href="/register" style={styles.registerButton}>
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );

}

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
    checkboxContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    checkbox: {
        lineHeight: '32px',
    },
    button: {
        width: '100%',
        height: '40px',
        borderRadius: '4px',
    },
    registerButton: {
        width: '100%',
        height: '40px',
        borderRadius: '4px',
        marginTop: '5px',
    },
};
