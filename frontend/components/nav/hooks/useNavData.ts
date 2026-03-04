import { useState, useEffect } from "react";


import {NavItem} from "@/types";
import {DEFAULT_NAV_ITEMS, NAV_API_URL} from "@/components/nav/constants";

/**
 * 导航数据获取Hook
 * @returns navItems 导航菜单数据
 */
export const useNavData = () => {
    const [navItems, setNavItems] = useState<NavItem[]>(DEFAULT_NAV_ITEMS);

    useEffect(() => {
        // 用IIFE处理async函数，解决Promise被忽略的警告
        (async () => {
            try {
                const res = await fetch(NAV_API_URL, {
                    method: "GET",
                    cache: "no-store",
                });

                // 不直接throw，避免本地捕获throw的警告，优雅处理错误
                if (!res.ok) {
                    console.warn(`导航接口请求失败: ${res.status}`);
                    return;
                }

                const data = await res.json();
                setNavItems(data);
            } catch (err) {
                console.error("获取导航数据失败:", err);
                // 错误时使用兜底数据，不额外throw
                setNavItems(DEFAULT_NAV_ITEMS);
            }
        })();
    }, []);

    return navItems;
};