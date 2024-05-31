// src/mock.js
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// 创建Mock实例
const mock = new MockAdapter(axios);

// 初始化LocalStorage中的用户数据
const initializeUsers = () => {
    // localStorage.clear();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.length === 0) {
        users.push({id:1, username: 'admin', email: 'admin@example.com', password: 'admin',enable: true , role:[1,2] });
        localStorage.setItem('users', JSON.stringify(users));
    }
    return users;
};

// 获取用户数据
const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];

// 设置用户数据
const setUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

// 初始化用户数据
initializeUsers();

// 初始化LocalStorage中的菜单数据
const initializeMenus = () => {
    // localStorage.clear();
    const menus = JSON.parse(localStorage.getItem('menus')) || [];
    if (menus.length === 0) {
        const defaultMenus = [
            {id:1 , key: '/home', name: '首页' ,enable: true , locked: true} ,
            {id:2 , key: '/admin', name: '权限', enable:true , locked: true ,  subMenus: [{id:3, key: '/admin/menu', name: '菜单管理' , enable: true, locked: true},
                    {id:4, key: '/admin/user', name: '用户管理' , enable: true, locked: true},
                    {id:5, key: '/admin/role', name: '权限管理' , enable: true, locked: true}] }
        ];
        localStorage.setItem('menus', JSON.stringify(defaultMenus));
    }
    return menus;
};

// 获取菜单数据
const getMenus = () => JSON.parse(localStorage.getItem('menus')) || [];

// 设置菜单数据
const setMenus = (menus) => localStorage.setItem('menus', JSON.stringify(menus));

// 初始化菜单数据
initializeMenus()

// 注册接口
mock.onPost('/api/register').reply(config => {
    const { username, email, password, role } = JSON.parse(config.data);
    let users = getUsers();

    // 检查用户名或邮箱是否已存在
    const userExists = users.some(user => user.username === username || user.email === email);

    if (userExists) {
        return [400, { message: 'Username or email already exists' }];
    }
    const id = users.length ? users[users.length - 1].id + 1 : 1;
    // 新用户添加到用户列表
    users.push({id:id, username, email, password, enable:true, role });
    setUsers(users);

    return [200, { message: 'Registration successful' }];
});

// 登录接口
mock.onPost('/api/login').reply(config => {
    const { username, password } = JSON.parse(config.data);
    const users = getUsers();

    // 验证用户名和密码
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        return [200, { message: 'Login successful' }];
    }

    return [401, { message: 'Invalid username or password' }];
});

//获取菜单
mock.onGet('/api/menus').reply(200, getMenus());

// 添加菜单接口
mock.onPost('/api/menus').reply(config => {
    const newMenu1 = JSON.parse(config.data);
    const findMaxId = (menus) => {
        let maxId = 0;

        const findMax = (menuList) => {
            menuList.forEach(menu => {
                if (menu.id > maxId) {
                    maxId = menu.id;
                }
                if (menu.subMenus && menu.subMenus.length > 0) {
                    findMax(menu.subMenus);
                }
            });
        };

        findMax(menus);
        return maxId;
    };
    if(!newMenu1.id && !newMenu1.parent){

        let menus = getMenus();
        const index = findMaxId(menus);
        const newMenu = {
            id: index+1,
            key: newMenu1.key,
            name: newMenu1.name,
            enable: newMenu1.enable,
        }

        menus.push(newMenu); // 添加新菜单


        setMenus(menus);
        return [200, menus];
    }else{
        let menus = getMenus();
        menus.forEach((menu)=>{
            console.log(menu.id+':'+newMenu1.parent)
            if(menu.id === newMenu1.parent){
                if(menu.subMenus){
                    const index = findMaxId(menu)+1;
                    const newMenu = {
                        id: index+1,
                        key: newMenu1.key,
                        name: newMenu1.name,
                        enable: newMenu1.enable,
                    }
                    menu.subMenus.push(newMenu)
                }else{
                    const newMenu = {
                        id: findMaxId(menus)+1,
                        key: newMenu1.key,
                        name: newMenu1.name,
                        enable: newMenu1.enable,
                    }
                    menu.subMenus = [];
                    console.log(menu);
                    menu.subMenus.push(newMenu)
                }
            }
        })
        setMenus(menus);
        return [200, menus];
    }
});


// 删除菜单接口
mock.onDelete(new RegExp('/api/menus/.+')).reply(config => {
    const menuKey = config.url.split('/').pop();
    console.log(menuKey)
    let menus = getMenus();
    menus = menus.filter(menu => String(menu.id) !== menuKey);
    setMenus(menus);
    return [200, menus];
});

mock.onDelete('/api/submenus').reply(config => {
    const { id, parentKey } = JSON.parse(config.data);
    let menus = getMenus();

    const deleteSubMenu = (menuList, parentKey, subMenuId) => {
        return menuList.map(menu => {
            if (menu.key === parentKey) {
                menu.subMenus = menu.subMenus.filter(subMenu => subMenu.id !== subMenuId);
                if(menu.subMenus.length === 0){
                    console.log(1)
                    delete menu.subMenus;
                }
            } else if (menu.subMenus && menu.subMenus.length > 0) {
                menu.subMenus = deleteSubMenu(menu.subMenus, parentKey, subMenuId);
            }

            return menu;
        });
    };

    menus = deleteSubMenu(menus, parentKey, id);
    setMenus(menus);
    return [200, menus];
});

//更新菜单

mock.onPut('/api/menus').reply(config => {
    const updatedMenu = JSON.parse(config.data);
    let menus = getMenus();

    const updateMenu = (menuList, updatedMenu) => {
        return menuList.map(menu => {
            if (menu.id === updatedMenu.id) {
                return { ...menu, ...updatedMenu };
            }
            if (menu.subMenus && menu.subMenus.length > 0) {
                menu.subMenus = updateMenu(menu.subMenus, updatedMenu);
            }
            return menu;
        });
    };

    const updateSubMenu = (menuList, parentKey, updatedMenu) => {
        return menuList.map(menu => {
            if (menu.id === parentKey) {
                menu.subMenus = menu.subMenus.map(subMenu => {
                    if (subMenu.id === updatedMenu.id) {
                        return { ...subMenu, ...updatedMenu };
                    }
                    return subMenu;
                });
            } else if (menu.subMenus && menu.subMenus.length > 0) {
                menu.subMenus = updateSubMenu(menu.subMenus, parentKey, updatedMenu);
            }
            return menu;
        });
    };

    if (updatedMenu.id && !updatedMenu.parent) {
        // 更新菜单
        menus = updateMenu(menus, updatedMenu);
        setMenus(menus);
        return [200, menus];
    } else if (updatedMenu.id && updatedMenu.parent) {
        // 更新子菜单
        menus = updateSubMenu(menus, updatedMenu.parent, updatedMenu);
        setMenus(menus);
        return [200, menus];
    }

    return [400, { message: 'Invalid request' }];
});


// 初始化LocalStorage中的角色数据
const initializeRoles = () => {
    const roles = JSON.parse(localStorage.getItem('roles')) || [];
    if (roles.length === 0) {
        const defaultRoles = [
            { id: 1, name: 'Admin', description: 'Administrator role', enable: true, menus: [{ id: 1 }, { id: 2, sub: [3,4,5] }] },
            { id: 2, name: 'User', description: 'Regular user role', enable: true, menus: [{ id: 1 }] }
        ];
        localStorage.setItem('roles', JSON.stringify(defaultRoles));
    }
    return roles;
};

// 获取角色数据
const getRoles = () => JSON.parse(localStorage.getItem('roles')) || [];

// 设置角色数据
const setRoles = (roles) => localStorage.setItem('roles', JSON.stringify(roles));

// 初始化角色数据
initializeRoles();

mock.onGet('/api/roles').reply(200, getRoles());


mock.onPost('/api/roles').reply(config => {
    const newRole = JSON.parse(config.data);
    const roles = getRoles();
    newRole.id = roles.length ? roles[roles.length - 1].id + 1 : 1;
    roles.push(newRole);
    setRoles(roles);
    return [200, roles];
});

mock.onPut('/api/roles').reply(config => {
    const updatedRole = JSON.parse(config.data);
    let roles = getRoles();
    roles = roles.map(role => role.id === updatedRole.id ? updatedRole : role);
    setRoles(roles);
    return [200, roles];
});

mock.onDelete(new RegExp('/api/roles/.+')).reply(config => {
    const roleId = Number(config.url.split('/').pop());
    let roles = getRoles();
    roles = roles.filter(role => role.id !== roleId);
    setRoles(roles);
    return [200, roles];
});

mock.onGet('/api/users').reply(200, getUsers());

mock.onPost('/api/users').reply(config => {
    const newUser = JSON.parse(config.data);
    const users = getUsers();
    newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
    users.push(newUser);
    setUsers(users);
    return [200, users];
});

mock.onPut('/api/users').reply(config => {
    const updatedUser = JSON.parse(config.data);
    let users = getUsers();
    users = users.map(user => user.id === updatedUser.id ? updatedUser : user);
    setUsers(users);
    return [200, users];
});

mock.onDelete(new RegExp('/api/users/.+')).reply(config => {
    const userId = Number(config.url.split('/').pop());
    let users = getUsers();
    users = users.filter(user => user.id !== userId);
    setUsers(users);
    return [200, users];
});


export default mock;
