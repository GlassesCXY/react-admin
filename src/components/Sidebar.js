import React, {useEffect, useState} from 'react';
import {Form, Layout, Menu, message} from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {filterMenus, mergeFilterArrays} from "../utils/menuUtil";

const { Sider } = Layout;
const { SubMenu } = Menu;



const CustomSidebar = ({  onCollapse }) => {
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);
    const [menus, setMenus] = useState([]);
    const [currentMenu, setCurrentMenu] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
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

    const renderMenu = (menus) =>{
        return menus.map((item)=>{
            if(item.subMenus){
                return <SubMenu key={item.key} title={item.name}>
                    {renderMenu(item.subMenus)}
                </SubMenu>
            }
            return <Menu.Item key={item.key}>{item.name}</Menu.Item>
            }
        )
    }
    const realRenderMenu = () =>{
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const roles = JSON.parse(localStorage.getItem("roles"));
        let filter = [];
        currentUser.role.forEach(roleId=>{
            roles.forEach(role=>{
                if(roleId === role.id){
                    filter = mergeFilterArrays(filter , role.menus);
                }
            })
        })
        const trueMenu = filterMenus(menus, filter);
        console.log(filter);
        console.log(trueMenu);
        return renderMenu(trueMenu);
    }
    const handleMenuClick = (e) => {
        navigate(e.key)
    };

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <div className="logo" style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)' }} />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={handleMenuClick}>
                {
                    realRenderMenu()
                }
            </Menu>
        </Sider>
    );
};

export default CustomSidebar;
