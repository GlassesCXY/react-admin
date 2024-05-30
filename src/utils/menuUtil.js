const mergeFilterArrays = (array1, array2) => {
    const mergedMap = new Map();

    const addToMap = (array) => {
        array.forEach(item => {
            if (mergedMap.has(item.id)) {
                const existingItem = mergedMap.get(item.id);
                if (item.sub) {
                    existingItem.sub = existingItem.sub || new Set();
                    item.sub.forEach(subId => existingItem.sub.add(subId));
                }
            } else {
                mergedMap.set(item.id, item.sub ? { sub: new Set(item.sub) } : {});
            }
        });
    };

    addToMap(array1);
    addToMap(array2);

    const resultArray = [];
    mergedMap.forEach((value, key) => {
        const newItem = { id: key };
        if (value.sub) {
            newItem.sub = Array.from(value.sub);
        }
        resultArray.push(newItem);
    });

    return resultArray;
};

const filterMenus = (menus, filterArray) => {
    const filterMap = new Map();

    // 构建过滤映射
    filterArray.forEach(item => {
        if (item.sub) {
            filterMap.set(item.id, new Set(item.sub));
        } else {
            filterMap.set(item.id, null);
        }
    });

    const filter = (menuList) => {
        return menuList.reduce((acc, menu) => {
            if (filterMap.has(menu.id)) {
                if (menu.subMenus) {
                    const allowedSubs = filterMap.get(menu.id);
                    if (allowedSubs !== null) {
                        menu.subMenus = menu.subMenus.filter(subMenu => allowedSubs.has(subMenu.id));
                    }
                    if(allowedSubs == null && menu.subMenus){
                        delete menu.subMenus;
                    }
                }
                acc.push(menu);
            }
            return acc;
        }, []);
    };

    return filter(menus);
};

const filterUnlockedMenus = (menuList) => {
    return menuList.reduce((acc, menu) => {
        if (!menu.locked) {
            const filteredMenu = { ...menu };
            if (menu.subMenus) {
                filteredMenu.subMenus = filterUnlockedMenus(menu.subMenus);
            }
            acc.push(filteredMenu);
        }
        return acc;
    }, []);
};



export  {mergeFilterArrays, filterMenus, filterUnlockedMenus}